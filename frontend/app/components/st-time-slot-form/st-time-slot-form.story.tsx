import * as React from "react";
import { storiesOf } from "@storybook/react-native";
import { StoryScreen } from "../../../storybook/views";

storiesOf("StTimeSlotForm", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>);
// .add("Style Presets", () => (
//   <Story>
//     <UseCase text="Primary" usage="The primary.">
//       <StTimeSlotForm style={{ backgroundColor: color.error }} />
//     </UseCase>
//   </Story>
// ))
