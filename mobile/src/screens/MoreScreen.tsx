import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  status: 'available' | 'coming-soon';
}

export default function MoreScreen() {
  const features: FeatureItem[] = [
    {
      icon: '📚',
      title: 'Daily Bitcoin Lessons',
      description: '180 days of Bitcoin education at your own pace',
      status: 'available'
    },
    {
      icon: '🧠',
      title: 'Interactive Quizzes',
      description: 'Test your knowledge and earn satoshis',
      status: 'available'
    },
    {
      icon: '💰',
      title: 'Satoshi Rewards',
      description: 'Earn real Bitcoin value while learning',
      status: 'available'
    },
    {
      icon: '🏆',
      title: 'Streak Tracking',
      description: 'Build consistency with daily learning habits',
      status: 'available'
    },
    {
      icon: '📊',
      title: 'Price Charts',
      description: 'Live Bitcoin price and historical data',
      status: 'available'
    },
    {
      icon: '🎯',
      title: 'Practice Simulators',
      description: 'Risk-free Bitcoin transaction practice',
      status: 'coming-soon'
    },
    {
      icon: '👥',
      title: 'Community Forum',
      description: 'Connect with other Bitcoin learners',
      status: 'coming-soon'
    },
    {
      icon: '🎥',
      title: 'Expert Videos',
      description: 'Curated Bitcoin content from industry leaders',
      status: 'coming-soon'
    }
  ];

  const handleWebsiteOpen = () => {
    Linking.openURL('https://hodlearnbeta.replit.app');
  };

  const handleSupportEmail = () => {
    Linking.openURL('mailto:support@hodlearn.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>HODLearn</Text>
          <Text style={styles.subtitle}>Building Bitcoin conviction daily</Text>
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📱 About the App</Text>
          <Text style={styles.infoText}>
            HODLearn is your complete Bitcoin education platform. Learn at your own pace 
            with daily lessons, earn satoshis for progress, and build lasting Bitcoin 
            conviction through practical knowledge.
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>✨ Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureLeft}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
              <View style={[
                styles.statusBadge,
                feature.status === 'available' ? styles.statusAvailable : styles.statusComingSoon
              ]}>
                <Text style={[
                  styles.statusText,
                  feature.status === 'available' ? styles.statusTextAvailable : styles.statusTextComingSoon
                ]}>
                  {feature.status === 'available' ? 'Live' : 'Soon'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Learning Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>🎯 Your Learning Journey</Text>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>180</Text>
              <Text style={styles.progressLabel}>Days of Content</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>5</Text>
              <Text style={styles.progressLabel}>Minutes Daily</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>Free</Text>
              <Text style={styles.progressLabel}>To Start</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleWebsiteOpen}>
            <Text style={styles.actionIcon}>🌐</Text>
            <Text style={styles.actionText}>Visit Website</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSupportEmail}>
            <Text style={styles.actionIcon}>📧</Text>
            <Text style={styles.actionText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Mission Statement */}
        <View style={styles.missionCard}>
          <Text style={styles.missionTitle}>🚀 Our Mission</Text>
          <Text style={styles.missionText}>
            To make Bitcoin education accessible, engaging, and rewarding for everyone. 
            We believe that understanding Bitcoin is essential financial literacy for 
            the digital age.
          </Text>
        </View>

        {/* Version Info */}
        <View style={styles.versionCard}>
          <Text style={styles.versionText}>HODLearn Mobile v1.0.0</Text>
          <Text style={styles.versionSubtext}>Built with React Native & Expo</Text>
          <Text style={styles.versionSubtext}>
            Powered by {'\n'}Live Bitcoin data & PostgreSQL
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Understanding Bitcoin takes time.{'\n'}
            Building conviction takes community.{'\n'}
            <Text style={styles.footerHighlight}>This is HODLearn.</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
  },
  infoCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(113, 113, 122, 0.3)',
  },
  infoTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    color: '#a1a1aa',
    fontSize: 16,
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  featureItem: {
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(113, 113, 122, 0.3)',
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDescription: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusAvailable: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusComingSoon: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextAvailable: {
    color: '#22c55e',
  },
  statusTextComingSoon: {
    color: '#f97316',
  },
  progressCard: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  progressTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressNumber: {
    color: '#f97316',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressLabel: {
    color: '#a1a1aa',
    fontSize: 12,
    textAlign: 'center',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 16,
    padding: 20,
    flex: 0.48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(113, 113, 122, 0.3)',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  missionCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  missionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  missionText: {
    color: '#a1a1aa',
    fontSize: 16,
    lineHeight: 24,
  },
  versionCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  versionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  versionSubtext: {
    color: '#71717a',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  footerText: {
    color: '#a1a1aa',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footerHighlight: {
    color: '#f97316',
    fontWeight: '600',
  },
});