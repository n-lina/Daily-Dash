import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "../text/text";
import { viewPresets, textPresets } from "./button.presets";
import { ButtonProps } from "./button.props";
import { mergeAll, flatten } from "ramda";

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: ButtonProps) {
  // grab the props
  const {
    preset = "primary",
    tx,
    text,
    style: styleOverride,
    textStyle: textStyleOverride,
    children,
    ...rest
  } = props;

  const dailyDashBtnStyle = {
      marginLeft: 10,
      marginRight: 10, 
      backgroundColor: "#008080",
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      marginBottom: 5
  }

  const viewStyle = mergeAll(flatten([viewPresets[preset] || viewPresets.primary, dailyDashBtnStyle, styleOverride]));
  const textStyle = mergeAll(
    flatten([textPresets[preset] || textPresets.primary, {fontSize: 12}, textStyleOverride]),
  );

  const content = children || <Text tx={tx} text={text} style={textStyle} />;

  return (
    <TouchableOpacity style={viewStyle} {...rest}>
      {content}
    </TouchableOpacity>
  );
}
