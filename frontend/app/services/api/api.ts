import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import { result } from "validate.js"
import messaging from "@react-native-firebase/messaging"
import auth from "@react-native-firebase/auth"

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

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
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
    })
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
    }
  }

  convertGoal = (raw) => {
    // console.log(JSON.stringify(raw));
    const STgoalsList: Types.STGoal[] = raw.shortTermGoals.map(this.convertSTGoal)
    return {
      LTgoal: raw.title,
      description: raw.description,
      STgoals: STgoalsList,
      id: raw.id
    }
  }

  getUserID(){
    return auth().currentUser.uid
  }

  /**
   * Sign a user out, delete there notification token from the server.
   */
  async signOut(): Promise<Types.SignOutResult> {
    const notId = await messaging().getToken();
    const userId = await auth().currentUser.uid;
    const deleteNotId: Types.DeleteNotificationToken = { token: notId }

    const response: ApiResponse<any> = await this.apisauce.delete(
      "/users/" + userId + "/notification",
      deleteNotId,
    )

    auth().signOut();
    this.apisauce.deleteHeader("Authorization");

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok"}
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
    const notId = await messaging().getToken()

    const postUsr: Types.PostUser = { email: email, username: name, id: id, notificationId: notId }

    const idToken = await auth().currentUser.getIdToken();
    this.apisauce.setHeader("Authorization", idToken);

    const response: ApiResponse<any> = await this.apisauce.post("/users", postUsr)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const convertUser = (raw) => {
      return {
        email: raw.email,
        name: raw.username,
      }
    }

    // transform the data into the format we are expecting
    try {
      const rawUser = response.data
      const resultUser: Types.User = convertUser(rawUser)
      return { kind: "ok", user: resultUser }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a single user by ID
   */

  async getUser(id: string): Promise<Types.GetUserResult> {
    // make the api call
    const idToken = await auth().currentUser.getIdToken();
    this.apisauce.setHeader("Authorization", idToken);
    const response: ApiResponse<any> = await this.apisauce.get(`/users/${id}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultUser: Types.User = {
        email: response.data.email,
        name: response.data.username,
      }
      return { kind: "ok", user: resultUser }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async getAllGoals(user_id: string = this.getUserID()): Promise<Types.GetLTGoalsResult> {
 // async getAllGoals(user_id: string = "eq06XtykrqSHJtqWblOYkhWat6s2"): Promise<Types.GetLTGoalsResult> {
    const idToken = await auth().currentUser.getIdToken();
    // const idToken = "test"
    this.apisauce.setHeader("Authorization", "Bearer " + idToken);
    const response: ApiResponse<any> = await this.apisauce.get(`/goals?id=${user_id}`)

    if (!response.ok){
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawGoals = response.data.longTermGoals
      const resultGoalList: Types.Goal[] = rawGoals.map(this.convertGoal)
      return { kind: "ok", LTgoals: resultGoalList}
    } catch {
      return { kind: "bad-data" }
    }
  }

  async getSTsuggestion(title: string): Promise<Types.GetSTsuggestion> {
    const idToken = await auth().currentUser.getIdToken();
    // const idToken = "test"
    this.apisauce.setHeader("Authorization", "Bearer " + idToken);
    const response: ApiResponse<any> = await this.apisauce.get(`/goals/suggestedstg?title=${title}`)
    if (!response.ok){
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const answer = response.data.answer
      console.log("This is the answer:" + answer)
      return { kind: "ok", suggestion: answer}
    } catch {
      return { kind: "bad-data" }
    }
  }

  async postLTgoal(LTgoal: string, description: string, STgoals: Array<Types.STGoal>, user_id: string = this.getUserID()): Promise<Types.PostGoalResult> {
    const idToken = await auth().currentUser.getIdToken();
    // const idToken = "test"
    this.apisauce.setHeader("Authorization", "Bearer " + idToken);
    const response: ApiResponse<any> = await this.apisauce.post("/goals", {userId: user_id, title: LTgoal, description: description, shortTermGoals: STgoals})

    if (!response.ok){
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      // const rawGoal = response.data
      console.log(JSON.stringify(response.data))
     // const resultGoal: Types.Goal = this.convertGoal(rawGoal)
      return { kind: "ok" }
    } catch {
      return { kind: "bad-data"}
    } 
  }
  
  // async getOneLTgoal(goal_id): Promise<Types.GetOneGoalResult> {
  //   const response: ApiResponse<any> = await this.apisauce.get(`/LTgoals/${goal_id}`)

  //   if (!response.ok){
  //     const problem = getGeneralApiProblem(response)
  //     if (problem) return problem
  //   }

  //   try {
  //     const rawGoal = response.data
  //     const resultGoal: Types.Goal = this.convertGoal(rawGoal)
  //     return { kind: "ok", goal: resultGoal }
  //   } catch {
  //     return { kind: "bad-data" }
  //   }
  // }

  // editOneLTgoal
  // deleteLTgoal
}
