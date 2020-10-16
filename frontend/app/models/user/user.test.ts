import { UserModel, User } from "./user"

test("can be created", () => {
  const instance: User = UserModel.create({})

  expect(instance).toBeTruthy()
})