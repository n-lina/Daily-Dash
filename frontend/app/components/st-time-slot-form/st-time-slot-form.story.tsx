import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { color } from "../../theme"
import { StTimeSlotForm } from "./st-time-slot-form"

storiesOf("StTimeSlotForm", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  // .add("Style Presets", () => (
  //   <Story>
  //     <UseCase text="Primary" usage="The primary.">
  //       <StTimeSlotForm style={{ backgroundColor: color.error }} />
  //     </UseCase>
  //   </Story>
  // ))
