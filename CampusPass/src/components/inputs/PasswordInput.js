import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import CustomInput from "./CustomInput";

const PasswordInput = ({
  label = "Password",
  value,
  onChangeText,
  error,
  placeholder,
  style,
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <CustomInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      error={error}
      placeholder={placeholder}
      style={style}
      disabled={disabled}
      secureTextEntry={!visible}
      leftIcon="lock-outline"
      rightIcon={
        <TextInput.Icon
          icon={visible ? "eye-off-outline" : "eye-outline"}
          onPress={() => setVisible(!visible)}
        />
      }
    />
  );
};

export default PasswordInput;
