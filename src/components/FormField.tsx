import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import {
  Controller,
  Control,
  FieldValues,
  FieldPath,
} from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> extends TextInputProps {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  isNumeric?: boolean;
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  isNumeric = false,
  style,
  ...textInputProps
}: FormFieldProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <TextInput
              style={[
                styles.input,
                error ? styles.inputError : undefined,
                style,
              ]}
              placeholderTextColor="#94A3B8"
              onBlur={onBlur}
              onChangeText={(text) => {
                if (isNumeric) {
                  const digitsOnly = text.replace(/[^0-9]/g, '');
                  onChange(digitsOnly === '' ? '' : Number(digitsOnly));
                } else {
                  onChange(text);
                }
              }}
              value={value === undefined || value === null ? '' : String(value)}
              keyboardType={isNumeric ? 'numeric' : textInputProps.keyboardType}
              {...textInputProps}
            />
            {error?.message && (
              <Text style={styles.errorText}>{error.message}</Text>
            )}
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});