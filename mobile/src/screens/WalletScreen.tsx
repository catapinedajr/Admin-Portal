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

interface WalletData {
  balance: {
    sats: number;
    btc: string;
    usd: string;
  };
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  recentActivity: Array<{
    id: number;
    type: string;
    amount: number;
    description: string;
    createdAt: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    earned: boolean;
    earnedAt?: string;
  }>;
}

export default function WalletScreen() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'achievements'>('overview');

  const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5000';

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      // Fetch wallet data for demo user ID 1
      const response = await fetch(`${API_URL}/api/wallet/1`);
      const data = await response.json();
      setWalletData(data);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Loading your wallet...</Text>
      </View>
    );
  }

  const renderOverviewTab = () => (
    <View>
      {/* Balance Card */}
      <LinearGradient
        colors={['#1f2937', '#374151']}
        style={styles.balanceCard}
      >
        <Text style={styles.balanceLabel}>Bitcoin Learning Wallet</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.satsBalance}>
            {walletData?.balance.sats.toLocaleString() || '0'} sats
          </Text>
          <Text style={styles.btcBalance}>
            {walletData?.balance.btc || '0.00000000'} BTC
          </Text>
        </View>
        <Text style={styles.usdBalance}>
          ≈ ${walletData?.balance.usd || '0.00'} USD
        </Text>
        
        <View style={styles.balanceActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Earnings Summary */}
      <View style={styles.earningsCard}>
        <Text style={styles.cardTitle}>Earnings Summary</Text>
        <View style={styles.earningsGrid}>
          <View style={styles.earningItem}>
            <Text style={styles.earningValue}>
              {walletData?.earnings.today.toLocaleString() || '0'}
            </Text>
            <Text style={styles.earningLabel}>Today</Text>
          </View>
          <View style={styles.earningItem}>
            <Text style={styles.earningValue}>
              {walletData?.earnings.thisWeek.toLocaleString() || '0'}
            </Text>
            <Text style={styles.earningLabel}>This Week</Text>
          </View>
          <View style={styles.earningItem}>
            <Text style={styles.earningValue}>
              {walletData?.earnings.thisMonth.toLocaleString() || '0'}
            </Text>
            <Text style={styles.earningLabel}>This Month</Text>
          </View>
          <View style={styles.earningItem}>
            <Text style={styles.earningValue}>
              {walletData?.earnings.total.toLocaleString() || '0'}
            </Text>
            <Text style={styles.earningLabel}>All Time</Text>
          </View>
        </View>
      </View>

      {/* Why Think in Sats */}
      <View style={styles.educationCard}>
        <Text style={styles.cardTitle}>💡 Why think in sats?</Text>
        <Text style={styles.educationText}>
          Satoshis (sats) are the smallest unit of Bitcoin. There are 100,000,000 sats in 1 Bitcoin. 
          Thinking in sats helps you understand Bitcoin's true divisibility and makes small amounts more meaningful.
        </Text>
        <Text style={styles.educationExample}>
          Example: 100,000 sats = 0.001 BTC = ${((100000 / 100000000) * 45000).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const renderActivityTab = () => (
    <View>
      <Text style={styles.tabTitle}>Recent Activity</Text>
      {walletData?.recentActivity.length ? (
        walletData.recentActivity.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text style={styles.activityIconText}>
                {activity.type === 'quiz_completion' ? '🧠' : 
                 activity.type === 'streak_bonus' ? '🔥' : 
                 activity.type === 'milestone' ? '🏆' : '⚡'}
              </Text>
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              <Text style={styles.activityDate}>
                {new Date(activity.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.activityAmount}>
              +{activity.amount.toLocaleString()} sats
            </Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Start learning to earn your first sats!
          </Text>
        </View>
      )}
    </View>
  );

  const renderAchievementsTab = () => (
    <View>
      <Text style={styles.tabTitle}>Achievements</Text>
      {walletData?.achievements.map((achievement) => (
        <View 
          key={achievement.id} 
          style={[
            styles.achievementItem,
            achievement.earned && styles.achievementEarned
          ]}
        >
          <View style={styles.achievementIcon}>
            <Text style={styles.achievementIconText}>
              {achievement.earned ? '🏆' : '🔒'}
            </Text>
          </View>
          <View style={styles.achievementDetails}>
            <Text style={[
              styles.achievementTitle,
              achievement.earned && styles.achievementTitleEarned
            ]}>
              {achievement.title}
            </Text>
            <Text style={styles.achievementDescription}>
              {achievement.description}
            </Text>
            {achievement.earned && achievement.earnedAt && (
              <Text style={styles.achievementDate}>
                Earned {new Date(achievement.earnedAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bitcoin Learning Wallet</Text>
        <Text style={styles.headerSubtitle}>Track your Bitcoin education progress</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNav}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'activity' && styles.tabActive]}
          onPress={() => setActiveTab('activity')}
        >
          <Text style={[styles.tabText, activeTab === 'activity' && styles.tabTextActive]}>
            Activity
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'achievements' && styles.tabActive]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.tabTextActive]}>
            Rewards
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'activity' && renderActivityTab()}
        {activeTab === 'achievements' && renderAchievementsTab()}
      </View>
    </ScrollView>
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
    backgroundColor: '#09090b',
  },
  loadingText: {
    color: '#f97316',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#71717a',
    fontSize: 16,
  },
  tabNav: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#f97316',
  },
  tabText: {
    color: '#71717a',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  tabContent: {
    padding: 20,
    paddingBottom: 100,
  },
  tabTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  balanceLabel: {
    color: '#71717a',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceContainer: {
    marginBottom: 8,
  },
  satsBalance: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  btcBalance: {
    color: '#71717a',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  usdBalance: {
    color: '#f97316',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#27272a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  earningsCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  earningItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  earningValue: {
    color: '#f97316',
    fontSize: 20,
    fontWeight: 'bold',
  },
  earningLabel: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 4,
  },
  educationCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  educationText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  educationExample: {
    color: '#f97316',
    fontSize: 14,
    fontStyle: 'italic',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#27272a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 20,
  },
  activityDetails: {
    flex: 1,
  },
  activityDescription: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  activityDate: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 2,
  },
  activityAmount: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  emptyStateText: {
    color: '#71717a',
    fontSize: 16,
    textAlign: 'center',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    opacity: 0.5,
  },
  achievementEarned: {
    opacity: 1,
    borderColor: '#f97316',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#27272a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementIconText: {
    fontSize: 20,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementTitle: {
    color: '#71717a',
    fontSize: 16,
    fontWeight: '600',
  },
  achievementTitleEarned: {
    color: '#ffffff',
  },
  achievementDescription: {
    color: '#71717a',
    fontSize: 14,
    marginTop: 2,
  },
  achievementDate: {
    color: '#f97316',
    fontSize: 12,
    marginTop: 4,
  },
});