import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BitcoinPriceData {
  price: number;
  change24h: number;
  performance: {
    oneYear: number;
    fourYear: number;
    tenYear: number;
  };
}

interface WalletData {
  totalSatoshisEarned: number;
  totalUsdValue: number;
  currentStreak: number;
  bestStreak: number;
}

export default function HomeScreen() {
  const [bitcoinPrice, setBitcoinPrice] = useState<BitcoinPriceData | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // Import API service
      const { api } = await import('../utils/api');
      
      // Fetch Bitcoin price with error handling
      const priceResult = await api.getBitcoinPrice();
      if (priceResult.data) {
        setBitcoinPrice(priceResult.data);
      }

      // Fetch wallet data with error handling
      const walletResult = await api.getWalletDashboard();
      if (walletResult.data) {
        setWalletData(walletResult.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.loadingText}>Loading HODLearn...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>HODLearn</Text>
          <Text style={styles.subtitle}>Building Bitcoin conviction daily</Text>
        </View>

        {/* Bitcoin Price Card */}
        {bitcoinPrice && (
          <View style={styles.priceCard}>
            <LinearGradient
              colors={['#f97316', '#ea580c']}
              style={styles.priceGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.bitcoinLabel}>Bitcoin Price</Text>
              <Text style={styles.bitcoinPrice}>{formatPrice(bitcoinPrice.price)}</Text>
              <Text style={[
                styles.priceChange,
                { color: bitcoinPrice.change24h >= 0 ? '#22c55e' : '#ef4444' }
              ]}>
                {formatPercentage(bitcoinPrice.change24h)} (24h)
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* Learning Progress Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📚 Daily Learning</Text>
            <Text style={styles.dayNumber}>Day 1</Text>
          </View>
          <Text style={styles.lessonTitle}>Your Money is Being Stolen</Text>
          <Text style={styles.lessonPreview}>
            Every day you wait, inflation silently steals your purchasing power...
          </Text>
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Continue Learning</Text>
          </TouchableOpacity>
        </View>

        {/* Wallet Summary */}
        {walletData && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>💰 Bitcoin Learning Wallet</Text>
            </View>
            <View style={styles.walletStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{walletData.totalSatoshisEarned.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Satoshis Earned</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{walletData.currentStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
            <Text style={styles.usdValue}>
              ≈ ${walletData.totalUsdValue.toFixed(2)} USD
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={styles.actionText}>Practice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Charts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Community</Text>
          </TouchableOpacity>
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
    marginBottom: 24,
    alignItems: 'center',
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
  priceCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  priceGradient: {
    padding: 20,
    alignItems: 'center',
  },
  bitcoinLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  bitcoinPrice: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  priceChange: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(113, 113, 122, 0.3)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  dayNumber: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '600',
  },
  lessonTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  lessonPreview: {
    color: '#a1a1aa',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: '#f97316',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  walletStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#f97316',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#a1a1aa',
    fontSize: 12,
    marginTop: 4,
  },
  usdValue: {
    color: '#71717a',
    fontSize: 14,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '500',
  },
});