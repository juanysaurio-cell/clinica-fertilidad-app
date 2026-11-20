import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HomeStackParamList } from '../navigation/types';
import {
  itemSchema,
  ItemFormInput,
  ItemFormData,
} from '../schemas/itemSchema';
import { FormField } from '../components/FormField';
import { useCreateItem } from '../hooks/useItems';

type Props = NativeStackScreenProps<HomeStackParamList, 'CreateScreen'>;

export const CreateScreen: React.FC<Props> = ({ navigation }) => {
  const { mutate, isPending } = useCreateItem();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ItemFormInput, unknown, ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: '',
      category: 'Alta Complejidad',
      durationWeeks: 4,
      description: '',
      detailedDescription: '',
    },
  });

  const busy = isPending || isSubmitting;

  const onSubmit = (values: ItemFormInput) => {
    const parsed = itemSchema.parse(values);

    mutate(
      {
        title: parsed.title,
        category: parsed.category,
        durationWeeks: parsed.durationWeeks,
        description: parsed.description,
        detailedDescription: parsed.detailedDescription || undefined,
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
        onError: (err) => {
          if (Platform.OS === 'web') {
            window.alert(`Error al crear: ${err.message}`);
          } else {
            Alert.alert('Error al crear', err.message);
          }
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <FormField
          name="title"
          control={control}
          label="Nombre del tratamiento *"
          placeholder="Ej: Estimulación ovárica controlada"
        />

        <FormField
          name="category"
          control={control}
          label="Categoría *"
          placeholder="Ej: Alta Complejidad, Diagnóstico..."
        />

        <FormField
          name="durationWeeks"
          control={control}
          label="Duración estimada (semanas) *"
          placeholder="4"
          isNumeric
        />

        <FormField
          name="description"
          control={control}
          label="Descripción general *"
          placeholder="Resumen breve del tratamiento..."
          multiline
          style={styles.textArea}
        />

        <FormField
          name="detailedDescription"
          control={control}
          label="Detalles clínicos (opcional)"
          placeholder="Información adicional del procedimiento..."
          multiline
          style={styles.textArea}
        />

        <View style={styles.buttonWrapper}>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.submitBtn,
              busy && styles.disabledBtn,
              pressed && !busy && styles.pressedBtn,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitText}>Guardar tratamiento</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { flex: 1 },
  form: { flexGrow: 1, padding: 20, paddingBottom: 48 },
  textArea: { height: 90, textAlignVertical: 'top' },
  buttonWrapper: { marginTop: 24, marginBottom: 16 },
  submitBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  pressedBtn: { backgroundColor: '#0369A1' },
  disabledBtn: { opacity: 0.65 },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});