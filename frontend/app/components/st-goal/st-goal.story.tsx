import * as React from "react";
import { storiesOf } from "@storybook/react-native";
import { StoryScreen, Story, UseCase } from "../../../storybook/views";
import { color } from "../../theme";
import { StGoal } from "./st-goal";

storiesOf("StGoal", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>);
// .add("Style Presets", () => (
//   // <Story>
//   //   <UseCase text="Primary" usage="The primary.">
//   //     <StGoal style={{ backgroundColor: color.error }} />
//   //   </UseCase>
//   // </Story>
// ))
