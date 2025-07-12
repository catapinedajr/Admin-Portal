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

interface ContentDay {
  dayIndex: number;
  title: string;
  themes: string[];
}

interface SetupQuestion {
  questionText: string;
  answerText: string;
}

interface Quiz {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: number;
  explanation: string;
}

interface LearnData {
  contentDay: ContentDay;
  setupQuestions: SetupQuestion[];
  lesson: {
    content: string;
    keyTakeaways: string[];
    whyItMatters: string;
  };
  quizzes: Quiz[];
  userProgress: {
    currentDay: number;
    hasCompletedToday: boolean;
  };
}

export default function LearnScreen() {
  const [learnData, setLearnData] = useState<LearnData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'facts' | 'lesson' | 'quiz'>('facts');

  const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5000';

  useEffect(() => {
    fetchLearnData();
  }, []);

  const fetchLearnData = async () => {
    try {
      // Fetch current day's content
      const dayResponse = await fetch(`${API_URL}/api/content/day/1`); // Using day 1 for demo
      const dayData = await dayResponse.json();

      // Fetch setup questions
      const questionsResponse = await fetch(`${API_URL}/api/content/setup-questions/1`);
      const questionsData = await questionsResponse.json();

      // Fetch lesson
      const lessonResponse = await fetch(`${API_URL}/api/content/lesson/1`);
      const lessonData = await lessonResponse.json();

      // Fetch quiz
      const quizResponse = await fetch(`${API_URL}/api/quiz/1`);
      const quizData = await quizResponse.json();

      setLearnData({
        contentDay: dayData,
        setupQuestions: questionsData,
        lesson: lessonData,
        quizzes: quizData,
        userProgress: {
          currentDay: 1,
          hasCompletedToday: false,
        },
      });
    } catch (error) {
      console.error('Failed to fetch learn data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Loading your lesson...</Text>
      </View>
    );
  }

  const renderFactsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Setup Questions</Text>
      <Text style={styles.sectionSubtitle}>Build your curiosity about today's topic</Text>
      
      {learnData?.setupQuestions.map((question, index) => (
        <View key={index} style={styles.questionCard}>
          <Text style={styles.questionNumber}>Question {index + 1}</Text>
          <Text style={styles.questionText}>{question.questionText}</Text>
          <TouchableOpacity style={styles.expandButton}>
            <Text style={styles.expandButtonText}>Think about it →</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity 
        style={styles.nextButton}
        onPress={() => setActiveSection('lesson')}
      >
        <LinearGradient colors={['#f97316', '#ea580c']} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>Continue to Lesson</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderLessonSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Deep Dive</Text>
      <Text style={styles.sectionSubtitle}>Understanding the fundamentals</Text>
      
      <View style={styles.lessonCard}>
        <Text style={styles.lessonContent}>
          {learnData?.lesson.content}
        </Text>

        <View style={styles.takeawaysSection}>
          <Text style={styles.takeawaysTitle}>Key Takeaways</Text>
          {learnData?.lesson.keyTakeaways.map((takeaway, index) => (
            <Text key={index} style={styles.takeawayText}>
              • {takeaway}
            </Text>
          ))}
        </View>

        <View style={styles.whyItMattersSection}>
          <Text style={styles.whyItMattersTitle}>Why It Matters</Text>
          <Text style={styles.whyItMattersText}>
            {learnData?.lesson.whyItMatters}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.nextButton}
        onPress={() => setActiveSection('quiz')}
      >
        <LinearGradient colors={['#f97316', '#ea580c']} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>Test Your Knowledge</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderQuizSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Knowledge Check</Text>
      <Text style={styles.sectionSubtitle}>Test your understanding</Text>
      
      {learnData?.quizzes.map((quiz, index) => (
        <View key={index} style={styles.quizCard}>
          <Text style={styles.quizNumber}>Question {index + 1}</Text>
          <Text style={styles.quizQuestion}>{quiz.questionText}</Text>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionLabel}>A</Text>
              <Text style={styles.optionText}>{quiz.optionA}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionLabel}>B</Text>
              <Text style={styles.optionText}>{quiz.optionB}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionLabel}>C</Text>
              <Text style={styles.optionText}>{quiz.optionC}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionLabel}>D</Text>
              <Text style={styles.optionText}>{quiz.optionD}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.completeButton}>
        <LinearGradient colors={['#22c55e', '#16a34a']} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>Complete Day</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Day {learnData?.contentDay.dayIndex}: {learnData?.contentDay.title}
        </Text>
        <Text style={styles.headerSubtitle}>
          {learnData?.contentDay.themes.join(' • ')}
        </Text>
      </View>

      {/* Progress Navigation */}
      <View style={styles.progressNav}>
        <TouchableOpacity 
          style={[styles.navButton, activeSection === 'facts' && styles.navButtonActive]}
          onPress={() => setActiveSection('facts')}
        >
          <Text style={[styles.navButtonText, activeSection === 'facts' && styles.navButtonTextActive]}>
            Facts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, activeSection === 'lesson' && styles.navButtonActive]}
          onPress={() => setActiveSection('lesson')}
        >
          <Text style={[styles.navButtonText, activeSection === 'lesson' && styles.navButtonTextActive]}>
            Lesson
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, activeSection === 'quiz' && styles.navButtonActive]}
          onPress={() => setActiveSection('quiz')}
        >
          <Text style={[styles.navButtonText, activeSection === 'quiz' && styles.navButtonTextActive]}>
            Quiz
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Sections */}
      {activeSection === 'facts' && renderFactsSection()}
      {activeSection === 'lesson' && renderLessonSection()}
      {activeSection === 'quiz' && renderQuizSection()}
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
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#f97316',
    fontSize: 16,
  },
  progressNav: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 4,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  navButtonActive: {
    backgroundColor: '#f97316',
  },
  navButtonText: {
    color: '#71717a',
    fontSize: 14,
    fontWeight: '600',
  },
  navButtonTextActive: {
    color: '#ffffff',
  },
  section: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: '#71717a',
    fontSize: 16,
    marginBottom: 24,
  },
  questionCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  questionNumber: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  questionText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  expandButton: {
    alignSelf: 'flex-start',
  },
  expandButtonText: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '500',
  },
  lessonCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  lessonContent: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  takeawaysSection: {
    marginBottom: 24,
  },
  takeawaysTitle: {
    color: '#f97316',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  takeawayText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  whyItMattersSection: {
    backgroundColor: '#27272a',
    padding: 16,
    borderRadius: 8,
  },
  whyItMattersTitle: {
    color: '#f97316',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  whyItMattersText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
  },
  quizCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  quizNumber: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  quizQuestion: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    padding: 12,
    borderRadius: 8,
  },
  optionLabel: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
    width: 20,
  },
  optionText: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
  },
  nextButton: {
    borderRadius: 8,
  },
  completeButton: {
    borderRadius: 8,
    marginTop: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});