import { ApisauceInstance, create, ApiResponse } from "apisauce";
import { getGeneralApiProblem } from "./api-problem";
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config";
import * as Types from "./api.types";
import messaging from "@react-native-firebase/messaging";
import auth from "@react-native-firebase/auth";

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance
  /**
   * Configurable options.
   */
  config: ApiConfig

  private idCountSplitter = "$,$";

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    });
  }

  convertSTGoal = (raw) => {
    return {
      id: raw.id,
      title: raw.title,
      mon: raw.mon,
      tue: raw.tue,
      wed: raw.wed,
      thu: raw.thu,
      fri: raw.fri,
      sat: raw.sat,
      sun: raw.sun
    };
  }

  convertGoal = (raw) => {
    const STgoalsList: Types.STGoal[] = raw.shortTermGoals.map(this.convertSTGoal);
    return {
      LTgoal: raw.title,
      description: raw.description,
      STgoals: STgoalsList,
      id: raw.id
    };
  }

  convertAward = (raw) => {
    const oneAward = [raw.title, raw.description];
    return oneAward;
  }

  getUserID() {
    return auth().currentUser.uid;
  }

  /**
   * Sign a user out, delete there notification token from the server.
   */
  async signOut(): Promise<Types.SuccessResult> {
    const notId = await messaging().getToken();
    const userId = await auth().currentUser.uid;
    const deleteNotId: Types.DeleteNotificationToken = { token: notId };

    const response: ApiResponse<any> = await this.apisauce.delete(
      "/users/" + userId + "/notification",
      deleteNotId,
    );

    auth().signOut();
    this.apisauce.deleteHeader("Authorization");

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    return { kind: "ok" };
  }

  /**
   * Post a user to database (may already exist)
   * @param usr user data received from Authentication
   */
  async postUserSignIn(
    id: string,
    name: string,
    email: string,
  ): Promise<Types.PostUserSignInResult> {
    const notId = await messaging().getToken();

    const postUsr: Types.PostUser = { email: email, username: name, id: id, notificationId: notId };

    const idToken = await auth().currentUser.getIdToken();
    this.apisauce.setHeader("Authorization", "Bearer " + idToken);

    const response: ApiResponse<any> = await this.apisauce.post("/users", postUsr);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    const convertUser = (raw) => {
      return {
        email: raw.email,
        name: raw.username,
        goalsCompleted: raw.goalsCompleted,
        timeMode: raw.timeMode
      };
    };

    // transform the data into the format we are expecting
    try {
      const rawUser = response.data;
      const resultUser: Types.User = convertUser(rawUser);
      return { kind: "ok", user: resultUser };
    } catch {
      return { kind: "bad-data" };
    }
  }

  async putUserTimeMode(
    newTimeMode: number,
  ): Promise<Types.SuccessResult> {
    const userId = await auth().currentUser.uid;
    const timeBody: Types.PutTimeMode = { timeMode: newTimeMode };

    const response: ApiResponse<any> = await this.apisauce.put("/users/time/" + userId, timeBody);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    return { kind: "ok" };
  }

  /**
   * Gets a single user by ID
   */

  async getUser(id: string): Promise<Types.GetUserResult> {
    // make the api call
    const idToken = await auth().currentUser.getIdToken();
    __DEV__ && console.log(idToken);
    this.apisauce.setHeader("Authorization", "Bearer " + idToken);
    const response: ApiResponse<any> = await this.apisauce.get(`/users/${id}`);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    // transform the data into the format we are expecting
    try {
      const resultUser: Types.User = {
        email: response.data.email,
        name: response.data.username,
        goalsCompleted: response.data.goalsCompleted,
        timeMode: response.data.timeMode
      };
      return { kind: "ok", user: resultUser };
    } catch {
      return { kind: "bad-data" };
    }
  }

  async toggleCompletedGoal(id: string, completed: boolean): Promise<Types.SuccessResult> {
    const userId = auth().currentUser.uid;
    const url = "/goals/shortterm/counter";
    const stgId = id.split(this.idCountSplitter)[0];
    const response: ApiResponse<any> = await this.apisauce.put(url, { userId: userId, shortTermGoalId: stgId, complete: completed });

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    return { kind: "ok" };
  }

  async getDailyGoals(day: string): Promise<Types.DailyGoalResult> {
    const userId = auth().currentUser.uid;
    const response: ApiResponse<any> = await this.apisauce.get("/goals/shortterm", { id: userId, dayOfWeek: day });

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    const idToCount = new Map();

    const convertGoal = (raw) => {
      const stgId = raw.stgId;
      let count = idToCount.get(stgId);
      if (count) {
        idToCount.set(stgId, ++count);
      } else {
        count = 1;
        idToCount.set(stgId, count);
      }
      return {
        id: raw.stgId + this.idCountSplitter + count,
        title: raw.title,
        time: raw.time
      };
    };

    try {
      const rawGoals = response.data.shortTermGoals;
      const resultGoalList: Types.DailyGoal[] = rawGoals.map(convertGoal);
      return { kind: "ok", goals: resultGoalList };
    } catch {
      return { kind: "bad-data" };
    }
  }

  async getAllGoals(userId: string = this.getUserID()): Promise<Types.GetLTGoalsResult> {
    const idToken = await auth().currentUser.getIdToken();
    this.apisauce.setHeader("Authorization", "Bearer " + idToken);
    const response: ApiResponse<any> = await this.apisauce.get(`/goals?id=${userId}`);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    try {
      const rawGoals = response.data.longTermGoals;
      const resultGoalList: Types.Goal[] = rawGoals.map(this.convertGoal);
      return { kind: "ok", LTgoals: resultGoalList };
    } catch {
      return { kind: "bad-data" };
    }
  }

  async getSTsuggestion(title: string): Promise<Types.GetSTsuggestion> {
    const idToken = await auth().currentUser.getIdToken();
    // const idToken = "test"
    this.apisauce.setHeader("Authorization", "Bearer " + idToken);
    const response: ApiResponse<any> = await this.apisauce.get(`/goals/suggestedstg?title=${title}`);
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    try {
      const answer = response.data.answer;
      return { kind: "ok", suggestion: answer };
    } catch {
      return { kind: "bad-data" };
    }
  }

  async postLTgoal(LTgoal: string, description: string, STgoals: Array<Types.STGoal>, userId: string = this.getUserID()): Promise<Types.PostGoalResult> {
    const idToken = await auth().currentUser.getIdToken();
    // const idToken = "test"
    this.apisauce.setHeader("Authorization", "Bearer " + idToken);
    const response: ApiResponse<any> = await this.apisauce.post("/goals", { userId: userId, title: LTgoal, description: description, shortTermGoals: STgoals });

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    return { kind: "ok" };
  }

  async putLTgoal(LTgoal: string, description: string, STgoals: Array<Types.STGoal>, goalId: string, userId: string = this.getUserID()): Promise<Types.PostGoalResult> {
    const idToken = await auth().currentUser.getIdToken();
    // const idToken = "test"
    this.apisauce.setHeader("Authorization", "Bearer " + idToken);
    const response: ApiResponse<any> = await this.apisauce.put(`/goals/${goalId}`, { userId: userId, title: LTgoal, description: description, shortTermGoals: STgoals, id: goalId });

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    return { kind: "ok" };
  }

  async deleteLTgoal(goalId: string, userId: string = this.getUserID()): Promise<Types.PostGoalResult> {
    const idToken = await auth().currentUser.getIdToken();
    // const idToken = "test"
    this.apisauce.setHeader("Authorization", "Bearer " + idToken);
    const response: ApiResponse<any> = await this.apisauce.delete(`/goals/${goalId}`, { userId: userId, id: goalId });

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    return { kind: "ok" };
  }
}
