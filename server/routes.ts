import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (default user for simplicity)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(1); // Default user ID
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get daily facts for today
  app.get("/api/daily-facts", async (req, res) => {
    try {
      const today = new Date();
      const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24)) % 5; // Cycle through 5 days of content
      const facts = await storage.getDailyFacts(dayIndex);
      res.json(facts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get daily facts" });
    }
  });

  // Get today's lesson
  app.get("/api/lesson", async (req, res) => {
    try {
      const today = new Date();
      const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24)) % 10;
      const lesson = await storage.getLesson(0); // For now, return the first lesson
      if (!lesson) {
        return res.status(404).json({ message: "No lesson found for today" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Failed to get lesson" });
    }
  });

  // Get user progress for today
  app.get("/api/progress/today", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const progress = await storage.getUserProgress(1, today);
      res.json(progress || { factsViewed: 0, lessonCompleted: false, progressPercentage: 0 });
    } catch (error) {
      res.status(500).json({ message: "Failed to get today's progress" });
    }
  });

  // Get user progress for the week
  app.get("/api/progress/week", async (req, res) => {
    try {
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1);
      const startDate = monday.toISOString().split('T')[0];
      
      const weekProgress = await storage.getUserProgressForWeek(1, startDate);
      
      // Fill in missing days with default values
      const fullWeek = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const existingProgress = weekProgress.find(p => p.date === dateStr);
        fullWeek.push(existingProgress || {
          date: dateStr,
          factsViewed: 0,
          lessonCompleted: false,
          progressPercentage: 0
        });
      }
      
      res.json(fullWeek);
    } catch (error) {
      res.status(500).json({ message: "Failed to get week progress" });
    }
  });

  // Update user progress
  app.post("/api/progress", async (req, res) => {
    try {
      const { factsViewed, lessonCompleted } = req.body;
      const today = new Date().toISOString().split('T')[0];
      
      const progressPercentage = Math.min(100, (factsViewed * 25) + (lessonCompleted ? 50 : 0));
      
      const progress = await storage.createOrUpdateUserProgress({
        userId: 1,
        date: today,
        factsViewed: factsViewed || 0,
        lessonCompleted: lessonCompleted || false,
        progressPercentage
      });

      // Update user's completed lessons if lesson was completed
      if (lessonCompleted) {
        const user = await storage.getUser(1);
        if (user) {
          await storage.updateUserProgress(1, user.completedLessons + 1, today);
        }
      }

      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Get knowledge areas
  app.get("/api/knowledge-areas", async (req, res) => {
    try {
      const areas = await storage.getKnowledgeAreas();
      res.json(areas);
    } catch (error) {
      res.status(500).json({ message: "Failed to get knowledge areas" });
    }
  });

  // Get conviction content for today
  app.get("/api/conviction-content", async (req, res) => {
    try {
      const today = new Date();
      const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24)) % 2; // Cycle through 2 days of content
      const content = await storage.getConvictionContent(dayIndex);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to get conviction content" });
    }
  });

  // Treasury companies routes
  app.get("/api/treasury-companies", async (req, res) => {
    try {
      const companies = await storage.getTreasuryCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to get treasury companies" });
    }
  });

  app.get("/api/treasury-companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const company = await storage.getTreasuryCompanyById(id);
      if (!company) {
        return res.status(404).json({ message: "Treasury company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to get treasury company" });
    }
  });

  // Sovereign adoption routes
  app.get("/api/sovereign-adoption", async (req, res) => {
    try {
      const adoptions = await storage.getSovereignAdoptions();
      res.json(adoptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sovereign adoptions" });
    }
  });

  app.get("/api/sovereign-adoption/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const adoption = await storage.getSovereignAdoptionById(id);
      if (!adoption) {
        return res.status(404).json({ message: "Sovereign adoption not found" });
      }
      res.json(adoption);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sovereign adoption" });
    }
  });

  app.get("/api/sovereign-adoption/type/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const adoptions = await storage.getSovereignAdoptionsByType(type);
      res.json(adoptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sovereign adoptions by type" });
    }
  });

  // Mark lesson as complete
  app.post("/api/lesson/complete", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const user = await storage.getUser(1);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update lesson completion in progress
      await storage.createOrUpdateUserProgress({
        userId: 1,
        date: today,
        factsViewed: 3, // Assume all facts viewed
        lessonCompleted: true,
        progressPercentage: 100
      });

      // Update user's total completed lessons
      await storage.updateUserProgress(1, user.completedLessons + 1, today);

      // Update streak if this is the first activity today
      const existingProgress = await storage.getUserProgress(1, today);
      if (!existingProgress?.lessonCompleted) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const yesterdayProgress = await storage.getUserProgress(1, yesterdayStr);
        
        const newStreak = yesterdayProgress ? user.currentStreak + 1 : 1;
        const newLongest = Math.max(user.longestStreak, newStreak);
        
        await storage.updateUserStreak(1, newStreak, newLongest);
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to complete lesson" });
    }
  });

  // Bitcoin price routes - using CoinGecko API
  app.get('/api/bitcoin-price', async (req, res) => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true');
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      const bitcoin = data.bitcoin;
      
      // Get additional market data
      const marketResponse = await fetch('https://api.coingecko.com/api/v3/global');
      const marketData = await marketResponse.json();
      const dominance = marketData.data?.market_cap_percentage?.btc || 0;
      
      const priceData = {
        id: 1,
        timestamp: new Date(bitcoin.last_updated_at * 1000),
        priceUsd: bitcoin.usd.toString(),
        marketCap: bitcoin.usd_market_cap.toString(),
        volume24h: bitcoin.usd_24h_vol.toString(),
        change24h: bitcoin.usd_24h_change?.toFixed(2) || "0.00",
        change7d: "0.00", // Would need separate API call for 7d data
        dominance: dominance.toFixed(1),
      };
      
      res.json(priceData);
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      // Fallback to basic mock data if API fails
      res.json({
        id: 1,
        timestamp: new Date(),
        priceUsd: "0.00",
        marketCap: "0",
        volume24h: "0",
        change24h: "0.00",
        change7d: "0.00",
        dominance: "0.0",
        error: "Unable to fetch live price data"
      });
    }
  });

  app.get('/api/bitcoin-price/history', async (req, res) => {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const days = Math.ceil(hours / 24);
      
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`);
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      const prices = data.prices || [];
      
      // Convert to our format and limit to requested hours
      const history = prices.slice(-hours).map((price: [number, number]) => ({
        timestamp: new Date(price[0]),
        priceUsd: price[1].toFixed(2),
        change24h: "0.00", // Could calculate from price differences
      }));
      
      res.json(history);
    } catch (error) {
      console.error('Error fetching Bitcoin price history:', error);
      res.json([]);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
