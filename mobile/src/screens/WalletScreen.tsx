import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WalletData {
  totalSatoshisEarned: number;
  totalUsdValue: number;
  currentStreak: number;
  bestStreak: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
}

interface RecentActivity {
  id: string;
  type: 'quiz' | 'streak' | 'milestone';
  amount: number;
  date: string;
  description: string;
}

export default function WalletScreen() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'quiz',
      amount: 600,
      date: new Date().toISOString(),
      description: 'Day 1 Quiz Completed'
    },
    {
      id: '2',
      type: 'quiz',
      amount: 600,
      date: new Date(Date.now() - 86400000).toISOString(),
      description: 'Day 2 Quiz Completed'
    },
    {
      id: '3',
      type: 'streak',
      amount: 2000,
      date: new Date(Date.now() - 86400000 * 7).toISOString(),
      description: '7-Day Streak Bonus'
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [showInSats, setShowInSats] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      // Import API service
      const { api } = await import('../utils/api');
      
      // Fetch wallet data with error handling
      const result = await api.getWalletDashboard();
      if (result.data) {
        setWalletData(result.data);
      } else {
        console.error('Failed to fetch wallet data:', result.error);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setLoading(false);
    }
  };

  const formatBalance = (satoshis: number) => {
    if (showInSats) {
      return `${satoshis.toLocaleString()} sats`;
    } else {
      return `₿${(satoshis / 100000000).toFixed(8)}`;
    }
  };

  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz': return '🧠';
      case 'streak': return '🔥';
      case 'milestone': return '🎯';
      default: return '⚡';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.loadingText}>Loading Wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Bitcoin Learning Wallet</Text>
          <TouchableOpacity 
            style={styles.unitToggle}
            onPress={() => setShowInSats(!showInSats)}
          >
            <Text style={styles.unitToggleText}>
              {showInSats ? 'Show BTC' : 'Show Sats'}
            </Text>
          </TouchableOpacity>
        </View>

        {walletData && (
          <>
            {/* Main Balance Card */}
            <View style={styles.balanceCard}>
              <LinearGradient
                colors={['#f97316', '#ea580c']}
                style={styles.balanceGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.balanceLabel}>Total Earned</Text>
                <Text style={styles.balanceAmount}>
                  {formatBalance(walletData.totalSatoshisEarned)}
                </Text>
                <Text style={styles.balanceUsd}>
                  ≈ ${walletData.totalUsdValue.toFixed(2)} USD
                </Text>
              </LinearGradient>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{walletData.currentStreak}</Text>
                <Text style={styles.statLabel}>Current Streak</Text>
                <Text style={styles.statIcon}>🔥</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{walletData.bestStreak}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
                <Text style={styles.statIcon}>🏆</Text>
              </View>
            </View>

            {/* Earnings Breakdown */}
            <View style={styles.earningsCard}>
              <Text style={styles.cardTitle}>📊 Earnings Breakdown</Text>
              <View style={styles.earningsRow}>
                <Text style={styles.earningsLabel}>This Week</Text>
                <Text style={styles.earningsValue}>
                  {walletData.weeklyEarnings.toLocaleString()} sats
                </Text>
              </View>
              <View style={styles.earningsRow}>
                <Text style={styles.earningsLabel}>This Month</Text>
                <Text style={styles.earningsValue}>
                  {walletData.monthlyEarnings.toLocaleString()} sats
                </Text>
              </View>
              <View style={styles.earningsRow}>
                <Text style={styles.earningsLabel}>All Time</Text>
                <Text style={styles.earningsValue}>
                  {walletData.totalSatoshisEarned.toLocaleString()} sats
                </Text>
              </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.activityCard}>
              <Text style={styles.cardTitle}>⚡ Recent Activity</Text>
              {recentActivity.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={styles.activityLeft}>
                    <Text style={styles.activityIcon}>
                      {getActivityIcon(activity.type)}
                    </Text>
                    <View>
                      <Text style={styles.activityDescription}>
                        {activity.description}
                      </Text>
                      <Text style={styles.activityDate}>
                        {formatActivityDate(activity.date)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.activityAmount}>
                    +{activity.amount} sats
                  </Text>
                </View>
              ))}
            </View>

            {/* Why Think in Sats */}
            <View style={styles.educationCard}>
              <Text style={styles.cardTitle}>🎓 Why Think in Sats?</Text>
              <Text style={styles.educationText}>
                A satoshi (sat) is the smallest unit of Bitcoin. There are 100 million 
                satoshis in 1 Bitcoin. Thinking in sats helps you understand Bitcoin's 
                divisibility and makes small amounts more meaningful.
              </Text>
              <Text style={styles.educationText}>
                As you learn about Bitcoin, you'll earn sats that represent real value 
                and help you practice thinking like a Bitcoin holder.
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>📚 Keep Learning</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>🎯 Practice More</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  unitToggle: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  unitToggleText: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '600',
  },
  balanceCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  balanceGradient: {
    padding: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceUsd: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 16,
    padding: 20,
    flex: 0.48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(113, 113, 122, 0.3)',
  },
  statValue: {
    color: '#f97316',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#a1a1aa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
  },
  earningsCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(113, 113, 122, 0.3)',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  earningsLabel: {
    color: '#a1a1aa',
    fontSize: 16,
  },
  earningsValue: {
    color: '#f97316',
    fontSize: 16,
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(113, 113, 122, 0.3)',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityDescription: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  activityDate: {
    color: '#a1a1aa',
    fontSize: 12,
    marginTop: 2,
  },
  activityAmount: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '600',
  },
  educationCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  educationText: {
    color: '#a1a1aa',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 0.48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  actionButtonText: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '600',
  },
});