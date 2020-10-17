import { GeneralApiProblem } from "./api-problem"

export interface User {
  email: string
  name: string
}

export interface PostUser {
  id: string
  name: string
  email: string
}

export type PostUserSignInResult = { kind: "ok"; user: User } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
