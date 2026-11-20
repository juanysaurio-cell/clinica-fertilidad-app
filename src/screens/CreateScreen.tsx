import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { useCreateItem } from '../hooks/useCreateItem';

type Props = NativeStackScreenProps<HomeStackParamList, 'CreateScreen'>;

export const CreateScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Alta Complejidad');
  const [durationWeeks, setDurationWeeks] = useState('4');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');

  const { mutate, isPending } = useCreateItem();

  const showMessage = (heading: string, msg: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${heading}: ${msg}`);
    } else {
      Alert.alert(heading, msg);
    }
  };

  const handleSave = () => {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle || !cleanDescription) {
      showMessage(
        'Datos incompletos',
        'Completa al menos el nombre del tratamiento y la descripción general.'
      );
      return;
    }

    const parsedWeeks = Number(durationWeeks);

    mutate(
      {
        title: cleanTitle,
        category: category.trim() || 'General',
        durationWeeks:
          Number.isFinite(parsedWeeks) && parsedWeeks > 0 ? parsedWeeks : 4,
        description: cleanDescription,
        detailedDescription: detailedDescription.trim() || undefined,
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
        onError: (err) => {
          showMessage(
            'Error al crear',
            err.message || 'No se pudo enviar el registro.'
          );
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
        <Text style={styles.label}>Nombre del tratamiento *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Estimulación ovárica controlada"
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Categoría</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Alta Complejidad, Diagnóstico..."
          placeholderTextColor="#94A3B8"
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Duración estimada (semanas)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="4"
          placeholderTextColor="#94A3B8"
          value={durationWeeks}
          onChangeText={setDurationWeeks}
        />

        <Text style={styles.label}>Descripción general *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Resumen breve del tratamiento..."
          placeholderTextColor="#94A3B8"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Detalles clínicos (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Información adicional del procedimiento..."
          placeholderTextColor="#94A3B8"
          multiline
          value={detailedDescription}
          onChangeText={setDetailedDescription}
        />

        <View style={styles.buttonWrapper}>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.submitBtn,
              isPending && styles.disabledBtn,
              pressed && !isPending && styles.pressedBtn,
            ]}
            onPress={handleSave}
            disabled={isPending}
          >
            {isPending ? (
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
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 12,
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