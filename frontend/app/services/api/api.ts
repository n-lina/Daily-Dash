import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
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
      id: raw._id,
      text: raw.title,
      monday: raw.monday,
      tuesday: raw.tuesday,
      wednesday: raw.wednesday,
      thursday: raw.thursday,
      friday: raw.friday,
      saturday: raw.saturday,
      sunday: raw.sunday
    }
  }

  convertGoal = (raw) => {
    const STgoalsList: Types.STGoal[] = raw.shortTermGoals.map(this.convertSTGoal)
    return {
      LTgoal: raw.title,
      STgoals: STgoalsList,
      id: raw._id
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
    this.apisauce.setHeader("Authorization", "Bearer " + idToken);

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
    __DEV__ && console.log(idToken);
    this.apisauce.setHeader("Authorization", "Bearer " + idToken);
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

  async getDailyGoals(day: string) : Promise<Types.DailyGoalResult> {
    const userId = auth().currentUser.uid;
    const response: ApiResponse<any> = await this.apisauce.get('/goals/shortterm', {id: userId, dayOfWeek: day})

    if (!response.ok){
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const convertGoal = (raw) => {
      return {
        id: raw.stgId + raw.time,
        title: raw.title,
        time: raw.time
      }
    }

    try {
      const rawGoals = response.data.shortTermGoals
      const resultGoalList: Types.DailyGoal[] = rawGoals.map(convertGoal)
      return { kind: "ok", goals: resultGoalList}
    } catch {
      return { kind: "bad-data" }
    }
  }

  async getAllGoals(user_id: string = this.getUserID()): Promise<Types.GetLTGoalsResult> {
    const response: ApiResponse<any> = await this.apisauce.get(`/goals/${user_id}`)

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

  async postLTgoal(LTgoal: string, STgoals: Array<Types.STGoal>, date_added: Date, id: string ): Promise<Types.GetOneGoalResult> {
    const response: ApiResponse<any> = await this.apisauce.post("/users/goals", {LTgoal: LTgoal, STgoals: STgoals, date_added: date_added, id: id })

    if (!response.ok){
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawGoal = response.data
      const resultGoal: Types.Goal = this.convertGoal(rawGoal)
      return { kind: "ok", goal: resultGoal }
    } catch {
      return { kind: "bad-data"}
    } 
  }
  
  async getOneLTgoal(goal_id): Promise<Types.GetOneGoalResult> {
    const response: ApiResponse<any> = await this.apisauce.get(`/LTgoals/${goal_id}`)

    if (!response.ok){
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawGoal = response.data
      const resultGoal: Types.Goal = this.convertGoal(rawGoal)
      return { kind: "ok", goal: resultGoal }
    } catch {
      return { kind: "bad-data" }
    }
  }

  // editOneLTgoal
  // deleteLTgoal
}
