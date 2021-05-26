import React from 'react'

import { Input as NBInput, IInputProps as NBInputProps, FormControl} from 'native-base'
import { Controller, ControllerProps, FieldError } from 'react-hook-form'

interface InputProps extends NBInputProps {
  label?: string;
  helperText?: string;
  controller: Omit<ControllerProps, 'render'>;
  error?: FieldError;
}

export const Input = ({ 
  label, 
  helperText, 
  controller,
  error,
  ...rest 
}: InputProps) => {
  
  return (
    <FormControl width='100%' isInvalid={!!error}>

      {!!label && (
        <FormControl.Label>
          {label}
        </FormControl.Label>
      )}

      <Controller
        name={controller.name}
        control={controller.control}
        render={({ field }) => {
          const { onChange, ...inputProps } = field
          return (
            <NBInput width='100%' onChangeText={(value) => onChange(value)} {...rest} {...inputProps} />
          )
        }}
        defaultValue={controller.defaultValue}
        rules={controller.rules}
        shouldUnregister={controller.shouldUnregister}
      />

      {!!helperText && (
        <FormControl.HelperText>
          {helperText}
        </FormControl.HelperText>
      )}

      {!!error && (
        <FormControl.ErrorMessage>
          {error.message}
        </FormControl.ErrorMessage>
      )}

    </FormControl>
  )
}