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

interface DayContent {
  dayIndex: number;
  title: string;
  setupQuestions: Array<{
    id: string;
    question: string;
  }>;
  lesson: {
    content: string;
    keyTakeaways: string[];
    whyItMatters: string;
  };
}

export default function LearnScreen() {
  const [currentDay, setCurrentDay] = useState(1);
  const [dayContent, setDayContent] = useState<DayContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLesson, setShowLesson] = useState(false);

  useEffect(() => {
    fetchDayContent(currentDay);
  }, [currentDay]);

  const fetchDayContent = async (dayIndex: number) => {
    try {
      setLoading(true);
      
      // Import API service
      const { api } = await import('../utils/api');
      
      // Fetch day metadata with error handling
      const metaResult = await api.getDayMetadata(dayIndex);
      const factsResult = await api.getDailyFacts(dayIndex);
      
      if (!metaResult.data || !factsResult.data) {
        console.error('Failed to fetch day content');
        setLoading(false);
        return;
      }
      
      const metaData = metaResult.data;
      const factsData = factsResult.data;

      setDayContent({
        dayIndex: metaData.dayIndex,
        title: metaData.title,
        setupQuestions: factsData,
        lesson: {
          content: "Every day you delay learning about Bitcoin, inflation continues to erode your purchasing power. The money in your bank account buys less today than it did last year, and it will buy even less next year. This isn't an accident—it's by design.\n\nThe current monetary system is built on debt and endless money printing. When governments need money, they simply create it out of thin air, diluting the value of every dollar you've earned and saved. Your hard work is being systematically devalued.\n\nBitcoin offers an alternative: a form of money with a fixed supply that no government or institution can manipulate. Understanding this difference isn't just educational—it's financial self-defense.",
          keyTakeaways: [
            "Inflation steals your purchasing power daily",
            "Governments create money from nothing",
            "Bitcoin has a fixed supply of 21 million"
          ],
          whyItMatters: "Learning about Bitcoin isn't just about understanding technology—it's about protecting your financial future from systematic wealth transfer through inflation."
        }
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching day content:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.loadingText}>Loading Day {currentDay}...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Learn Today</Text>
          <Text style={styles.dayIndicator}>Day {currentDay}</Text>
        </View>

        {/* Day Navigation */}
        <View style={styles.dayNavigation}>
          <TouchableOpacity 
            style={[styles.navButton, currentDay === 1 && styles.navButtonDisabled]}
            onPress={() => currentDay > 1 && setCurrentDay(currentDay - 1)}
            disabled={currentDay === 1}
          >
            <Text style={styles.navButtonText}>← Prev</Text>
          </TouchableOpacity>
          <Text style={styles.currentDayText}>Day {currentDay}</Text>
          <TouchableOpacity 
            style={[styles.navButton, currentDay >= 14 && styles.navButtonDisabled]}
            onPress={() => currentDay < 14 && setCurrentDay(currentDay + 1)}
            disabled={currentDay >= 14}
          >
            <Text style={styles.navButtonText}>Next →</Text>
          </TouchableOpacity>
        </View>

        {dayContent && (
          <>
            {/* Day Title */}
            <View style={styles.titleCard}>
              <Text style={styles.dayTitle}>{dayContent.title}</Text>
            </View>

            {/* Setup Questions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🤔 Setup Questions</Text>
              {dayContent.setupQuestions.map((question, index) => (
                <View key={question.id} style={styles.questionCard}>
                  <Text style={styles.questionNumber}>{index + 1}.</Text>
                  <Text style={styles.questionText}>{question.question}</Text>
                </View>
              ))}
            </View>

            {/* Lesson Toggle */}
            <TouchableOpacity 
              style={styles.lessonToggle}
              onPress={() => setShowLesson(!showLesson)}
            >
              <Text style={styles.lessonToggleText}>
                {showLesson ? '📖 Hide Lesson' : '📖 Read Lesson'}
              </Text>
            </TouchableOpacity>

            {/* Lesson Content */}
            {showLesson && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📚 Today's Lesson</Text>
                <View style={styles.lessonCard}>
                  <Text style={styles.lessonContent}>{dayContent.lesson.content}</Text>
                  
                  <View style={styles.keyTakeaways}>
                    <Text style={styles.takeawaysTitle}>Key Takeaways:</Text>
                    {dayContent.lesson.keyTakeaways.map((takeaway, index) => (
                      <Text key={index} style={styles.takeaway}>• {takeaway}</Text>
                    ))}
                  </View>

                  <View style={styles.whyItMatters}>
                    <Text style={styles.whyTitle}>Why It Matters:</Text>
                    <Text style={styles.whyContent}>{dayContent.lesson.whyItMatters}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Quiz Button */}
            <TouchableOpacity style={styles.quizButton}>
              <Text style={styles.quizButtonText}>Take Today's Quiz</Text>
              <Text style={styles.quizButtonSubtext}>Test your knowledge</Text>
            </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dayIndicator: {
    color: '#f97316',
    fontSize: 16,
    fontWeight: '600',
  },
  dayNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  navButton: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(113, 113, 122, 0.2)',
  },
  navButtonText: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '600',
  },
  currentDayText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleCard: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  dayTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  questionCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(113, 113, 122, 0.3)',
  },
  questionNumber: {
    color: '#f97316',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  questionText: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  lessonToggle: {
    backgroundColor: '#f97316',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  lessonToggleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  lessonCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(113, 113, 122, 0.3)',
  },
  lessonContent: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  keyTakeaways: {
    marginBottom: 20,
  },
  takeawaysTitle: {
    color: '#f97316',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  takeaway: {
    color: '#a1a1aa',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  whyItMatters: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(113, 113, 122, 0.3)',
    paddingTop: 16,
  },
  whyTitle: {
    color: '#f97316',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  whyContent: {
    color: '#a1a1aa',
    fontSize: 14,
    lineHeight: 20,
  },
  quizButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    marginBottom: 20,
  },
  quizButtonText: {
    color: '#22c55e',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quizButtonSubtext: {
    color: '#a1a1aa',
    fontSize: 14,
  },
});