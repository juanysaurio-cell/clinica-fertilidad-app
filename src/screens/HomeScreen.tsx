import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content"  />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Semana 01 — Layouts con Flexbox</Text>

        {/* Layout 1: Header con Botón de Acción */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Layout 1: Header + Botón</Text>
          <View style={styles.layout1}>
            <Text style={styles.layout1Title}>Clínica de Fertilidad</Text>
            <Pressable 
              style={styles.btnPrimary} 
              onPress={() => Alert.alert('Layout 1', 'Botón presionado')}
            >
              <Text style={styles.btnText}>+ Nuevo</Text>
            </Pressable>
          </View>
        </View>

        {/* Layout 2: Tab Bar Proporcional Simulado */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Layout 2: Tab Bar Proporcional</Text>
          <View style={styles.layout2}>
            <Text style={styles.tabItem}>Inicio</Text>
            <Text style={styles.tabItem}>Tratamientos</Text>
            <Text style={styles.tabItem}>Perfil</Text>
          </View>
        </View>

        {/* Layout 3: Tarjeta con Avatar Flex Align-Items */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Layout 3: Tarjeta Avatar</Text>
          <View style={styles.layout3}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>Foto</Text>
            </View>
            <View style={styles.textFlex}>
              <Text style={styles.userName}>Dr. Alejandro Vargas</Text>
              <Text style={styles.userSub}>Embriología Clínica</Text>
            </View>
          </View>
        </View>

        {/* Layout 4: División Proporcional Flex 1/3 y 2/3 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Layout 4: División 1/3 y 2/3</Text>
          <View style={styles.layout4}>
            <View style={styles.panelLeft}>
              <Text style={styles.panelText}>1/3</Text>
            </View>
            <View style={styles.panelRight}>
              <Text style={styles.panelText}>2/3</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: '#0284C7', textTransform: 'uppercase', marginBottom: 8 },
  textFlex: { flex: 1 },

  // Layout 1
  layout1: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  layout1Title: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  btnPrimary: { backgroundColor: '#0284C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  btnText: { color: '#FFF', fontWeight: '600' },

  // Layout 2
  layout2: { flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: '#F1F5F9', padding: 10, borderRadius: 8 },
  tabItem: { fontWeight: '600', color: '#475569' },

  // Layout 3
  layout3: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 11, color: '#475569' },
  userName: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  userSub: { fontSize: 12, color: '#64748B' },

  // Layout 4
  layout4: { flexDirection: 'row', height: 50, borderRadius: 8, overflow: 'hidden' },
  panelLeft: { flex: 1, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center' },
  panelRight: { flex: 2, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  panelText: { fontWeight: '700', color: '#0369A1' },
});