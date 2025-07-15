import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

type CommunityTab = 'overview' | 'forums' | 'videos' | 'stories';

interface ForumPost {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  category: string;
}

interface Video {
  id: string;
  title: string;
  speaker: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
}

interface SuccessStory {
  id: string;
  title: string;
  author: string;
  preview: string;
  date: string;
}

const forumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Best practices for cold storage?',
    author: 'BitcoinNewbie',
    replies: 23,
    lastActivity: '2 hours ago',
    category: 'Security'
  },
  {
    id: '2',
    title: 'DCA strategy - weekly vs monthly?',
    author: 'HODLer2021',
    replies: 15,
    lastActivity: '4 hours ago',
    category: 'Investment'
  },
  {
    id: '3',
    title: 'Lightning Network for beginners',
    author: 'LightningLearner',
    replies: 31,
    lastActivity: '6 hours ago',
    category: 'Technology'
  }
];

const curatedVideos: Video[] = [
  {
    id: '1',
    title: 'What is Bitcoin?',
    speaker: 'Andreas Antonopoulos',
    duration: '12:45',
    difficulty: 'Beginner',
    thumbnail: '📺'
  },
  {
    id: '2',
    title: 'Bitcoin vs Gold',
    speaker: 'Michael Saylor',
    duration: '18:30',
    difficulty: 'Intermediate',
    thumbnail: '📺'
  },
  {
    id: '3',
    title: 'Lightning Network Deep Dive',
    speaker: 'Elizabeth Stark',
    duration: '25:15',
    difficulty: 'Advanced',
    thumbnail: '📺'
  }
];

const successStories: SuccessStory[] = [
  {
    id: '1',
    title: 'From Skeptic to Bitcoin Advocate',
    author: 'Sarah M.',
    preview: 'I used to think Bitcoin was just for tech nerds and criminals. After learning about monetary policy...',
    date: '3 days ago'
  },
  {
    id: '2',
    title: 'How Bitcoin Saved My Business',
    author: 'Carlos R.',
    preview: 'Running a small business in Argentina, inflation was killing my savings. Bitcoin changed everything...',
    date: '1 week ago'
  },
  {
    id: '3',
    title: 'My First Year of DCA',
    author: 'Emma K.',
    preview: 'Started with $50/month and learned so much about patience and long-term thinking...',
    date: '2 weeks ago'
  }
];

export default function ConnectScreen() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('overview');

  const handleForumPress = (post: ForumPost) => {
    Alert.alert(
      post.title,
      `Full forum discussions coming soon in the next mobile update. Join the conversation on the web version.`,
      [{ text: 'OK' }]
    );
  };

  const handleVideoPress = (video: Video) => {
    Alert.alert(
      video.title,
      `Video player coming soon in the next mobile update. Watch curated Bitcoin education videos on the web version.`,
      [{ text: 'OK' }]
    );
  };

  const handleStoryPress = (story: SuccessStory) => {
    Alert.alert(
      story.title,
      `Full success stories coming soon in the next mobile update. Read inspiring Bitcoin journeys on the web version.`,
      [{ text: 'OK' }]
    );
  };

  const renderTabButton = (tab: CommunityTab, label: string, icon: string) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderOverview = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome to the HODLearn Community</Text>
        <Text style={styles.welcomeText}>
          Connect with fellow Bitcoin learners, share experiences, and grow your knowledge together.
        </Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>1,247</Text>
          <Text style={styles.statLabel}>Community Members</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Forum Discussions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>89</Text>
          <Text style={styles.statLabel}>Curated Videos</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('forums')}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionTitle}>Join Discussions</Text>
          <Text style={styles.actionDesc}>Ask questions and share insights</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('videos')}>
          <Text style={styles.actionIcon}>📺</Text>
          <Text style={styles.actionTitle}>Watch Videos</Text>
          <Text style={styles.actionDesc}>Expert Bitcoin education content</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('stories')}>
          <Text style={styles.actionIcon}>🌟</Text>
          <Text style={styles.actionTitle}>Success Stories</Text>
          <Text style={styles.actionDesc}>Real Bitcoin adoption journeys</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderForums = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <Text style={styles.sectionTitle}>Recent Discussions</Text>
      {forumPosts.map((post) => (
        <TouchableOpacity
          key={post.id}
          style={styles.forumPost}
          onPress={() => handleForumPress(post)}
        >
          <View style={styles.postHeader}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postCategory}>{post.category}</Text>
          </View>
          <View style={styles.postMeta}>
            <Text style={styles.postAuthor}>by {post.author}</Text>
            <Text style={styles.postReplies}>{post.replies} replies</Text>
            <Text style={styles.postTime}>{post.lastActivity}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <View style={styles.comingSoonNote}>
        <Text style={styles.comingSoonText}>
          Full forum functionality coming soon in mobile app update
        </Text>
      </View>
    </ScrollView>
  );

  const renderVideos = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <Text style={styles.sectionTitle}>Curated Bitcoin Education</Text>
      {curatedVideos.map((video) => (
        <TouchableOpacity
          key={video.id}
          style={styles.videoCard}
          onPress={() => handleVideoPress(video)}
        >
          <Text style={styles.videoThumbnail}>{video.thumbnail}</Text>
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{video.title}</Text>
            <Text style={styles.videoSpeaker}>by {video.speaker}</Text>
            <View style={styles.videoMeta}>
              <Text style={styles.videoDuration}>{video.duration}</Text>
              <View style={[styles.difficultyBadge, 
                video.difficulty === 'Beginner' && styles.beginnerBadge,
                video.difficulty === 'Intermediate' && styles.intermediateBadge,
                video.difficulty === 'Advanced' && styles.advancedBadge
              ]}>
                <Text style={styles.difficultyText}>{video.difficulty}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
      <View style={styles.comingSoonNote}>
        <Text style={styles.comingSoonText}>
          Video player coming soon in mobile app update
        </Text>
      </View>
    </ScrollView>
  );

  const renderStories = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <Text style={styles.sectionTitle}>Success Stories</Text>
      {successStories.map((story) => (
        <TouchableOpacity
          key={story.id}
          style={styles.storyCard}
          onPress={() => handleStoryPress(story)}
        >
          <Text style={styles.storyTitle}>{story.title}</Text>
          <Text style={styles.storyAuthor}>by {story.author}</Text>
          <Text style={styles.storyPreview}>{story.preview}</Text>
          <Text style={styles.storyDate}>{story.date}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.comingSoonNote}>
        <Text style={styles.comingSoonText}>
          Full success stories coming soon in mobile app update
        </Text>
      </View>
    </ScrollView>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'forums':
        return renderForums();
      case 'videos':
        return renderVideos();
      case 'stories':
        return renderStories();
      default:
        return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connect & Learn</Text>
        <Text style={styles.headerSubtitle}>Join the Bitcoin Learning Community</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {renderTabButton('overview', 'Overview', '🏠')}
          {renderTabButton('forums', 'Forums', '💬')}
          {renderTabButton('videos', 'Videos', '📺')}
          {renderTabButton('stories', 'Stories', '🌟')}
        </ScrollView>
      </View>

      {renderActiveTab()}
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
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  tabs: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  activeTabButton: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tabLabel: {
    fontSize: 14,
    color: '#a1a1aa',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#ffffff',
  },
  tabContent: {
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 20,
  },
  statsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#18181b',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f97316',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a1a1aa',
    textAlign: 'center',
  },
  quickActions: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: '#18181b',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  forumPost: {
    backgroundColor: '#18181b',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    marginRight: 8,
  },
  postCategory: {
    fontSize: 12,
    color: '#f97316',
    backgroundColor: '#f97316/20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  postMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  postAuthor: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  postReplies: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  postTime: {
    fontSize: 12,
    color: '#71717a',
  },
  videoCard: {
    backgroundColor: '#18181b',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 12,
    flexDirection: 'row',
  },
  videoThumbnail: {
    fontSize: 48,
    marginRight: 16,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  videoSpeaker: {
    fontSize: 12,
    color: '#a1a1aa',
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  videoDuration: {
    fontSize: 12,
    color: '#71717a',
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  beginnerBadge: {
    backgroundColor: '#22c55e',
  },
  intermediateBadge: {
    backgroundColor: '#f59e0b',
  },
  advancedBadge: {
    backgroundColor: '#ef4444',
  },
  difficultyText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  storyCard: {
    backgroundColor: '#18181b',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 12,
  },
  storyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  storyAuthor: {
    fontSize: 12,
    color: '#f97316',
    marginBottom: 8,
  },
  storyPreview: {
    fontSize: 13,
    color: '#a1a1aa',
    lineHeight: 18,
    marginBottom: 8,
  },
  storyDate: {
    fontSize: 12,
    color: '#71717a',
  },
  comingSoonNote: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#18181b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 12,
    color: '#71717a',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});