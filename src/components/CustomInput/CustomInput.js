import {View, TextInput, StyleSheet, Platform, Text} from 'react-native';
import React from 'react';
import {Controller} from 'react-hook-form';

const CustomInput = ({
  control,
  name,
  rules = {},
  placeholder,
  secureTextEntry,
  multiline = false,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <>
          <View style={[styles.container, error ? styles.error : {}]}>
            <TextInput
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={[styles.input, multiline ? styles.multilineInput : {}]}
              secureTextEntry={secureTextEntry}
              multiline={multiline}
            />
          </View>
          {error && (
            <Text style={styles.errorText}>{error.message || 'Error'}</Text>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',

    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,

    ...Platform.select({
      ios: {
        padding: 15,
      },
      android: {
        paddingHorizontal: 10,
      },
      default: {paddingHorizontal: 10},
    }),
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  error: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    alignSelf: 'stretch',
  },
  input: {},
  multilineInput: {
    height: 100,
    maxHeight: 100,
  },
});

export default CustomInput;
