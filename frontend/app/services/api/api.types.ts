import { GeneralApiProblem } from "./api-problem"

export interface User {
  email: string
  name: string
}

export interface PostUser {
  id: string
  username: string
  email: string
}

export interface Goal {
  LTgoal: string,
  STgoals: Array<STGoal>, 
  date_added: Date,
  id: string
}

export interface STGoal {
  id: string 
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  saturday: number
  sunday: number
}

export type GetLTGoalsResult = { kind: "ok"; LTgoals: Goal[] } | GeneralApiProblem
export type GetOneGoalResult = { kind: "ok"; goal: Goal } | GeneralApiProblem
export type PostUserSignInResult = { kind: "ok"; user: User } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
