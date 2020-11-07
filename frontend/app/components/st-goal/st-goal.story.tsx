import * as React from "react";
import { storiesOf } from "@storybook/react-native";
import { StoryScreen } from "../../../storybook/views";

storiesOf("StGoal", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>);
// .add("Style Presets", () => (
//   // <Story>
//   //   <UseCase text="Primary" usage="The primary.">
//   //     <StGoal style={{ backgroundColor: color.error }} />
//   //   </UseCase>
//   // </Story>
// ))
