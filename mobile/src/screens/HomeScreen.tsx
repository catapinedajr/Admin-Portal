import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

interface User {
  id: number;
  firstName: string;
  streak: number;
  dayIndex: number;
}

interface DashboardData {
  user: User;
  bitcoinPrice: number;
  dailyFact: {
    title: string;
    content: string;
  };
}

export default function HomeScreen() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5000';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // For demo purposes, using default user ID 1
      const response = await fetch(`${API_URL}/api/dashboard/1`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Loading your conviction...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {getTimeBasedGreeting()}{dashboardData?.user.firstName ? `, ${dashboardData.user.firstName}` : ''}!
          </Text>
          <Text style={styles.subtitle}>This is HODLearn</Text>
        </View>
        <View style={styles.bitcoinPrice}>
          <Text style={styles.priceText}>${dashboardData?.bitcoinPrice?.toLocaleString() || '---'}</Text>
          <Text style={styles.priceLabel}>BTC</Text>
        </View>
      </View>

      {/* Streak Achievement Card */}
      <LinearGradient
        colors={['#1f2937', '#374151']}
        style={styles.streakCard}
      >
        <View style={styles.streakHeader}>
          <Text style={styles.streakTitle}>Bitcoin Learning Streak</Text>
          <Text style={styles.streakDays}>{dashboardData?.user.streak || 0} days</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min((dashboardData?.user.streak || 0) / 7 * 100, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {dashboardData?.user.streak && dashboardData.user.streak >= 7 ? 
              'Habit formed! Keep going!' : 
              `${7 - (dashboardData?.user.streak || 0)} days to habit`
            }
          </Text>
        </View>

        <View style={styles.milestones}>
          <View style={[styles.milestone, (dashboardData?.user.streak || 0) >= 7 && styles.milestoneActive]}>
            <Text style={styles.milestoneText}>7d: 2K sats</Text>
          </View>
          <View style={[styles.milestone, (dashboardData?.user.streak || 0) >= 30 && styles.milestoneActive]}>
            <Text style={styles.milestoneText}>30d: 10K sats</Text>
          </View>
          <View style={[styles.milestone, (dashboardData?.user.streak || 0) >= 365 && styles.milestoneActive]}>
            <Text style={styles.milestoneText}>365d: 100K sats</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Daily Learning Card */}
      <View style={styles.learningCard}>
        <View style={styles.dayBadge}>
          <Text style={styles.dayBadgeText}>Day {dashboardData?.user.dayIndex || 1}</Text>
        </View>
        
        <Text style={styles.factTitle}>
          {dashboardData?.dailyFact?.title || 'Loading today\'s lesson...'}
        </Text>
        
        <Text style={styles.factPreview}>
          {dashboardData?.dailyFact?.content?.substring(0, 100) || 'Building your Bitcoin conviction...'}...
        </Text>

        <TouchableOpacity style={styles.continueButton}>
          <LinearGradient
            colors={['#f97316', '#ea580c']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Continue Learning</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🔒</Text>
            <Text style={styles.actionText}>Security</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>❓</Text>
            <Text style={styles.actionText}>Why Bitcoin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Community</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09090b',
  },
  loadingText: {
    color: '#f97316',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingTop: 20,
  },
  greeting: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#71717a',
    fontSize: 16,
    marginTop: 4,
  },
  bitcoinPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    color: '#f97316',
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceLabel: {
    color: '#71717a',
    fontSize: 12,
  },
  streakCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  streakDays: {
    color: '#f97316',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#27272a',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f97316',
    borderRadius: 4,
  },
  progressText: {
    color: '#a1a1aa',
    fontSize: 14,
    textAlign: 'center',
  },
  milestones: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  milestone: {
    backgroundColor: '#27272a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  milestoneActive: {
    backgroundColor: '#f97316',
  },
  milestoneText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  learningCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  dayBadge: {
    backgroundColor: '#f97316',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  dayBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  factTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  factPreview: {
    color: '#a1a1aa',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  continueButton: {
    borderRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    marginTop: 8,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
    width: '30%',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});