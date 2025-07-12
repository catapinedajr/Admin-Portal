import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function MoreScreen() {
  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const menuItems = [
    {
      title: 'Community',
      subtitle: 'Connect with other learners',
      icon: '👥',
      action: () => console.log('Navigate to community'),
    },
    {
      title: 'Practice Simulators',
      subtitle: 'Safe Bitcoin practice',
      icon: '🎯',
      action: () => console.log('Navigate to simulators'),
    },
    {
      title: 'Security Training',
      subtitle: 'Bitcoin safety certification',
      icon: '🔒',
      action: () => console.log('Navigate to security'),
    },
    {
      title: 'Inflation Calculator',
      subtitle: 'See money printing impact',
      icon: '📈',
      action: () => console.log('Navigate to inflation calculator'),
    },
  ];

  const storeItems = [
    {
      title: 'Hardware Wallets',
      subtitle: 'Secure Bitcoin storage',
      icon: '🔐',
      items: ['Ledger Nano X', 'Trezor Model T', 'ColdCard Mk4'],
    },
    {
      title: 'Bitcoin Books',
      subtitle: 'Essential reading',
      icon: '📚',
      items: ['The Bitcoin Standard', 'Broken Money', 'Fiat Standard'],
    },
    {
      title: 'Exchanges',
      subtitle: 'Trusted Bitcoin platforms',
      icon: '🏦',
      items: ['River Financial', 'Swan Bitcoin', 'Strike'],
    },
  ];

  const supportLinks = [
    {
      title: 'HODLearn Web App',
      subtitle: 'Full desktop experience',
      url: 'https://hodlearnbeta.replit.app',
    },
    {
      title: 'Support & Feedback',
      subtitle: 'Get help or share suggestions',
      url: 'mailto:support@hodlearn.app',
    },
    {
      title: 'Privacy Policy',
      subtitle: 'How we protect your data',
      url: 'https://hodlearnbeta.replit.app/privacy',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
        <Text style={styles.headerSubtitle}>Explore additional features and resources</Text>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>{item.icon}</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Store Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Store</Text>
        <View style={styles.storeNotice}>
          <Text style={styles.storeNoticeText}>
            🚧 Coming Soon - Bitcoin products and educational resources
          </Text>
        </View>
        {storeItems.map((category, index) => (
          <View key={index} style={styles.storeCategory}>
            <View style={styles.storeCategoryHeader}>
              <Text style={styles.storeCategoryIcon}>{category.icon}</Text>
              <View>
                <Text style={styles.storeCategoryTitle}>{category.title}</Text>
                <Text style={styles.storeCategorySubtitle}>{category.subtitle}</Text>
              </View>
            </View>
            <View style={styles.storeItems}>
              {category.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.storeItem}>
                  <Text style={styles.storeItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        
        <View style={styles.appInfoCard}>
          <LinearGradient
            colors={['#f97316', '#ea580c']}
            style={styles.appIcon}
          >
            <Text style={styles.appIconText}>H</Text>
          </LinearGradient>
          <View style={styles.appDetails}>
            <Text style={styles.appName}>HODLearn</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Bitcoin education through daily learning and safe practice
            </Text>
          </View>
        </View>

        <View style={styles.taglineCard}>
          <Text style={styles.tagline}>Understanding Bitcoin takes time</Text>
          <Text style={styles.tagline}>Building conviction takes community</Text>
          <Text style={[styles.tagline, styles.taglineHighlight]}>This is HODLearn</Text>
        </View>
      </View>

      {/* Support & Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & Links</Text>
        {supportLinks.map((link, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.linkItem}
            onPress={() => handleOpenLink(link.url)}
          >
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>{link.title}</Text>
              <Text style={styles.linkSubtitle}>{link.subtitle}</Text>
            </View>
            <Text style={styles.linkArrow}>↗</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Educational Notice */}
      <View style={styles.disclaimerCard}>
        <Text style={styles.disclaimerTitle}>📚 Educational Platform</Text>
        <Text style={styles.disclaimerText}>
          HODLearn is designed for educational purposes. All Bitcoin amounts shown in the wallet 
          are learning credits, not real Bitcoin. Always do your own research before making 
          any financial decisions.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
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
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#27272a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  menuSubtitle: {
    color: '#71717a',
    fontSize: 14,
    marginTop: 2,
  },
  menuArrow: {
    color: '#71717a',
    fontSize: 20,
  },
  storeNotice: {
    backgroundColor: '#f97316',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  storeNoticeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  storeCategory: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  storeCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeCategoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  storeCategoryTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  storeCategorySubtitle: {
    color: '#71717a',
    fontSize: 14,
  },
  storeItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  storeItem: {
    backgroundColor: '#27272a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  storeItemText: {
    color: '#ffffff',
    fontSize: 12,
  },
  appInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appIconText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  appVersion: {
    color: '#71717a',
    fontSize: 14,
    marginTop: 2,
  },
  appDescription: {
    color: '#a1a1aa',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  taglineCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
  },
  tagline: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  taglineHighlight: {
    color: '#f97316',
    fontWeight: '600',
    marginBottom: 0,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  linkSubtitle: {
    color: '#71717a',
    fontSize: 14,
    marginTop: 2,
  },
  linkArrow: {
    color: '#f97316',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimerCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  disclaimerTitle: {
    color: '#f97316',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  disclaimerText: {
    color: '#a1a1aa',
    fontSize: 14,
    lineHeight: 20,
  },
});