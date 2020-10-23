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
  id: string
}

export interface STGoal {
  id: string 
  text: string
  monday: Array<number>
  tuesday: Array<number>
  wednesday: Array<number>
  thursday: Array<number>
  friday: Array<number>
  saturday: Array<number>
  sunday: Array<number>
}

export type GetLTGoalsResult = { kind: "ok"; LTgoals: Goal[] } | GeneralApiProblem
export type GetOneGoalResult = { kind: "ok"; goal: Goal } | GeneralApiProblem
export type PostUserSignInResult = { kind: "ok"; user: User } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
