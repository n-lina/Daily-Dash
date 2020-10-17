import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"

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

  /**
   * Post a user to database (may already exist)
   * @param usr user data received from Authentication
   */
  async postUserSignIn(id: string, name: string, email: string): Promise<Types.PostUserSignInResult> {

    const postUsr: Types.PostUser = {email: email, username: name, id: id}

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

  async getUser(token: string, id: string): Promise<Types.GetUserResult> {
    // make the api call
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
}
