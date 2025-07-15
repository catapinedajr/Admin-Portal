import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

type SimulatorType = 'safety' | 'wallet' | 'transactions' | 'transfer' | 'hodl' | 'dca' | 'inflation' | 'fees';

interface Simulator {
  id: SimulatorType;
  title: string;
  description: string;
  icon: string;
  isPremium: boolean;
  comingSoon?: boolean;
}

const simulators: Simulator[] = [
  {
    id: 'safety',
    title: 'Safety Training',
    description: '16-scenario Bitcoin security certification. Learn to protect your Bitcoin from scams and theft.',
    icon: '🛡️',
    isPremium: false
  },
  {
    id: 'wallet',
    title: 'Wallet Explorer',
    description: 'Compare wallet types and practice seed phrase recovery in a safe environment.',
    icon: '💼',
    isPremium: true,
    comingSoon: true
  },
  {
    id: 'transactions',
    title: 'Transaction Builder',
    description: 'Build Bitcoin transactions step-by-step and understand fees, confirmations, and timing.',
    icon: '⚡',
    isPremium: true,
    comingSoon: true
  },
  {
    id: 'transfer',
    title: 'Transfer Speed Race',
    description: 'Compare Bitcoin vs traditional banking settlement times with real-world scenarios.',
    icon: '🏃‍♂️',
    isPremium: true,
    comingSoon: true
  },
  {
    id: 'hodl',
    title: 'HODL Strategy',
    description: 'Backtest Bitcoin holding strategies vs traditional assets over different time periods.',
    icon: '💎',
    isPremium: true,
    comingSoon: true
  },
  {
    id: 'dca',
    title: 'DCA Calculator',
    description: 'Model dollar-cost averaging strategies with historical Bitcoin price data.',
    icon: '📈',
    isPremium: true,
    comingSoon: true
  },
  {
    id: 'inflation',
    title: 'Inflation Impact',
    description: 'Calculate how inflation erodes purchasing power vs Bitcoin protection over time.',
    icon: '📉',
    isPremium: true,
    comingSoon: true
  },
  {
    id: 'fees',
    title: 'Fee Comparison',
    description: 'Compare traditional banking fees vs Bitcoin transaction costs for different scenarios.',
    icon: '💸',
    isPremium: true,
    comingSoon: true
  }
];

export default function SimulatorsScreen() {
  const [activeSimulator, setActiveSimulator] = useState<SimulatorType | null>(null);

  const handleSimulatorPress = (simulator: Simulator) => {
    if (simulator.comingSoon) {
      Alert.alert(
        'Coming Soon',
        `${simulator.title} will be available in the next mobile app update. This feature is currently available on the web version.`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (simulator.isPremium) {
      Alert.alert(
        'Premium Feature',
        'This simulator requires a premium subscription. Upgrade to access all interactive Bitcoin education tools.',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Learn More', onPress: () => {/* Navigate to premium */ } }
        ]
      );
      return;
    }

    // For now, just show an alert for the safety training
    if (simulator.id === 'safety') {
      Alert.alert(
        'Safety Training',
        'Bitcoin Security Certification starting soon. This interactive 16-scenario training will test your knowledge of Bitcoin safety best practices.',
        [{ text: 'Start Training', onPress: () => setActiveSimulator('safety') }]
      );
    }
  };

  const renderSimulator = (simulator: Simulator) => (
    <TouchableOpacity
      key={simulator.id}
      style={[
        styles.simulatorCard,
        simulator.isPremium && styles.premiumCard,
        simulator.comingSoon && styles.comingSoonCard
      ]}
      onPress={() => handleSimulatorPress(simulator)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.icon}>{simulator.icon}</Text>
        <View style={styles.cardBadges}>
          {simulator.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PREMIUM</Text>
            </View>
          )}
          {simulator.comingSoon && (
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>COMING SOON</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.simulatorTitle}>{simulator.title}</Text>
      <Text style={styles.simulatorDescription}>{simulator.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.launchButton}>
          {simulator.comingSoon ? 'Available Soon' : 'Launch Simulator'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (activeSimulator === 'safety') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setActiveSimulator(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Safety Training</Text>
        </View>
        <ScrollView contentContainerStyle={styles.trainingContent}>
          <Text style={styles.trainingTitle}>🛡️ Bitcoin Security Certification</Text>
          <Text style={styles.trainingSubtitle}>
            Master Bitcoin safety with 16 real-world scenarios
          </Text>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>What You'll Learn:</Text>
            <Text style={styles.feature}>• Identify phishing emails and fake websites</Text>
            <Text style={styles.feature}>• Secure seed phrase storage best practices</Text>
            <Text style={styles.feature}>• Verify Bitcoin addresses safely</Text>
            <Text style={styles.feature}>• Avoid common scams and social engineering</Text>
            <Text style={styles.feature}>• Hardware wallet security protocols</Text>
            <Text style={styles.feature}>• Multi-signature wallet understanding</Text>
          </View>

          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Security Assessment</Text>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            Complete mobile training coming soon. Full interactive version available on web.
          </Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Practice Simulators</Text>
        <Text style={styles.headerSubtitle}>Interactive Bitcoin Education Tools</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.simulatorsGrid}>
          {simulators.map(renderSimulator)}
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Safe Practice Environment</Text>
          <Text style={styles.infoText}>
            All simulators use fake data and testnet Bitcoin for safe learning. 
            No real money is ever at risk during practice sessions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  backButton: {
    fontSize: 16,
    color: '#f97316',
    marginBottom: 10,
  },
  content: {
    padding: 20,
  },
  simulatorsGrid: {
    gap: 16,
  },
  simulatorCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  premiumCard: {
    borderColor: '#f97316',
    borderWidth: 1,
  },
  comingSoonCard: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
  },
  cardBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  premiumBadge: {
    backgroundColor: '#f97316',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  premiumText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  comingSoonBadge: {
    backgroundColor: '#3f3f46',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  comingSoonText: {
    color: '#a1a1aa',
    fontSize: 10,
    fontWeight: 'bold',
  },
  simulatorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  simulatorDescription: {
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    alignItems: 'center',
  },
  launchButton: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    marginTop: 32,
    padding: 20,
    backgroundColor: '#18181b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 20,
  },
  trainingContent: {
    padding: 20,
  },
  trainingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  trainingSubtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 32,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  feature: {
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 20,
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: '#f97316',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: '#71717a',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});