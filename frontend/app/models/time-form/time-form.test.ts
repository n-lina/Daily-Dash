import { TimeFormModel, TimeForm } from "./time-form"

test("can be created", () => {
  const instance: TimeForm = TimeFormModel.create({})

  expect(instance).toBeTruthy()
})