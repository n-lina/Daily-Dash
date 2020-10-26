import { GeneralApiProblem } from "./api-problem"

export interface User {
  email: string
  name: string
}

export interface PostUser {
  id: string
  username: string
  email: string
  notificationId: string
}

export interface Goal {
  LTgoal: string,
  STgoals: Array<STGoal>, 
  id: string
}

export interface STGoal {
  title: string
  mon: Array<number>
  tue: Array<number>
  wed: Array<number>
  thu: Array<number>
  fri: Array<number>
  sat: Array<number>
  sun: Array<number>
}

export interface DailyGoal {
  id: string,
  title: string,
  time: number, // in minutes
}

export interface DeleteNotificationToken {
  token: string
}

export type GetLTGoalsResult = { kind: "ok"; LTgoals: Goal[] } | GeneralApiProblem
export type GetOneGoalResult = { kind: "ok"; goal: Goal } | GeneralApiProblem
export type DailyGoalResult = { kind: "ok"; goals: DailyGoal[] } | GeneralApiProblem
export type SignOutResult = {kind: "ok" } | GeneralApiProblem
export type PostUserSignInResult = { kind: "ok"; user: User } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
export type PostGoalResult = { kind: "ok"} | GeneralApiProblem
export type GetSTsuggestion = {kind: "ok"; suggestion: string} | GeneralApiProblem

