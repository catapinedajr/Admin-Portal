import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Gamepad2, 
  TrendingUp, 
  BookOpen, 
  Shield, 
  Wallet,
  Calendar,
  Trophy,
  MessageCircle,
  Mail,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Target,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function getDeviceType(): 'ios' | 'android' | 'desktop' {
  const userAgent = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'ios';
  }
  if (/Android/.test(userAgent)) {
    return 'android';
  }
  return 'desktop';
}

function captureUtmParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');
    const utmContent = params.get('utm_content');
    
    if (utmSource || utmMedium || utmCampaign || utmContent) {
      const utmData = {
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        captured_at: new Date().toISOString(),
      };
      localStorage.setItem('hodlearn_utm', JSON.stringify(utmData));
    }
  } catch (e) {
  }
}

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const deviceType = getDeviceType();
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    captureUtmParams();
  }, []);

  const appStoreUrl = "https://apps.apple.com/app/hodlearn";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.hodlearn";
  
  const socialLinks = {
    twitter: "https://x.com/hodlosophy",
    instagram: "https://instagram.com/hodlosophy", 
    tiktok: "https://tiktok.com/@hodlosophy",
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setContactForm({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="border-b border-zinc-800 bg-black/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                HL
              </div>
              <span className="text-lg md:text-xl font-bold">HODLearn</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
              <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact</button>
            </nav>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setLocation('/auth')}
                variant="ghost"
                size="sm"
                className="text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                Log In
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-16 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />
          <div className="max-w-6xl mx-auto px-4 relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-sm text-orange-400 mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span>Now available on the App Store</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
                  Master Bitcoin
                  <br />
                  <span className="text-orange-500">One Day at a Time</span>
                </h1>
                
                <p className="text-zinc-400 text-base md:text-lg max-w-lg mb-8">
                  A daily learning journey that transforms curiosity into conviction. 
                  Bite-sized lessons, risk-free simulators, and a community of learners.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
                  <a
                    href={appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-zinc-100 rounded-xl px-6 py-4 transition-colors font-medium"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs opacity-70">Download on the</div>
                      <div className="text-base font-semibold">App Store</div>
                    </div>
                  </a>
                  
                  <Button
                    onClick={() => setLocation('/auth?mode=register')}
                    variant="outline"
                    size="lg"
                    className="border-zinc-600 bg-zinc-800/50 hover:bg-zinc-800 text-white px-6 py-4 h-auto"
                  >
                    Try Web Version
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-zinc-500">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Free to start
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    No crypto needed
                  </span>
                </div>
              </div>

              <div className="hidden md:flex justify-center">
                <div className="relative">
                  <div className="w-64 h-[520px] bg-zinc-950 rounded-[3rem] border-4 border-zinc-700 shadow-2xl overflow-hidden p-2">
                    <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-zinc-900">
                      {/* To use a real screenshot: 
                          1. Take a screenshot of the app on your phone
                          2. Save it to: client/src/assets/app-screenshot.png
                          3. Import it at the top: import appScreenshot from "@/assets/app-screenshot.png"
                          4. Replace the div below with: <img src={appScreenshot} alt="HODLearn App" className="w-full h-full object-cover object-top" />
                      */}
                      <div className="h-full bg-gradient-to-b from-zinc-900 to-zinc-800 p-4 flex flex-col">
                        <div className="flex items-center gap-2 mb-6 pt-6">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xs">HL</div>
                          <span className="font-semibold text-sm">HODLearn</span>
                        </div>
                        
                        <div className="bg-zinc-700/50 rounded-2xl p-4 mb-4">
                          <p className="text-xs text-zinc-400 mb-1">Day 1</p>
                          <h3 className="font-semibold text-sm mb-2">What is Bitcoin?</h3>
                          <div className="w-full bg-zinc-600 rounded-full h-1.5">
                            <div className="bg-orange-500 h-1.5 rounded-full w-1/4"></div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-2xl p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Wallet className="w-4 h-4 text-orange-400" />
                            <span className="text-xs text-orange-400">HODLearn Points</span>
                          </div>
                          <p className="text-lg font-bold">2,450 pts</p>
                          <p className="text-xs text-zinc-500">Pegged to BTC</p>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 text-orange-400 mt-auto pb-4">
                          <Trophy className="w-5 h-5" />
                          <span className="font-semibold">5 Day Streak!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -z-10 inset-0 bg-orange-500/20 blur-3xl rounded-full scale-75" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24 bg-zinc-950/50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                Everything You Need to 
                <span className="text-orange-500"> Learn Bitcoin</span>
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                From complete beginner to confident holder. Our structured curriculum 
                and interactive tools make learning Bitcoin intuitive and engaging.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-zinc-800/40 border-zinc-700 hover:border-orange-500/40 transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Daily Curriculum</h3>
                  <p className="text-zinc-400 text-sm">
                    A complete Bitcoin education journey. One lesson per day, 
                    5-10 minutes each. Build knowledge progressively.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/40 border-zinc-700 hover:border-orange-500/40 transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Wallet className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">HODLearn Points</h3>
                  <p className="text-zinc-400 text-sm">
                    Earn points pegged to Bitcoin for every lesson and quiz. 
                    Learn to think in Bitcoin while tracking your progress.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/40 border-zinc-700 hover:border-orange-500/40 transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Risk-Free Simulators</h3>
                  <p className="text-zinc-400 text-sm">
                    Practice DCA strategies, wallet security, and transactions 
                    without risking real money. Learn by doing.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/40 border-zinc-700 hover:border-orange-500/40 transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Community Forums</h3>
                  <p className="text-zinc-400 text-sm">
                    Join thousands of learners. Ask questions, share insights, 
                    and build conviction together.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/40 border-zinc-700 hover:border-orange-500/40 transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Trophy className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Streaks & Achievements</h3>
                  <p className="text-zinc-400 text-sm">
                    Stay motivated with daily streaks, milestone badges, 
                    and progress tracking. Make learning a habit.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/40 border-zinc-700 hover:border-orange-500/40 transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Live Bitcoin Data</h3>
                  <p className="text-zinc-400 text-sm">
                    Real-time price tracking and market insights. 
                    Understand how Bitcoin fits into the bigger picture.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-zinc-400">Simple, structured, effective</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/15 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-orange-500" />
                </div>
                <div className="text-orange-500 font-bold text-sm mb-2">Step 1</div>
                <h3 className="font-semibold text-lg mb-2">Learn Daily</h3>
                <p className="text-zinc-400 text-sm">
                  Complete one lesson per day. Each takes just 5-10 minutes 
                  and builds on previous knowledge.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/15 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="w-8 h-8 text-orange-500" />
                </div>
                <div className="text-orange-500 font-bold text-sm mb-2">Step 2</div>
                <h3 className="font-semibold text-lg mb-2">Practice Safely</h3>
                <p className="text-zinc-400 text-sm">
                  Use interactive simulators to practice what you learn. 
                  No real money, no risk, full experience.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/15 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-orange-500" />
                </div>
                <div className="text-orange-500 font-bold text-sm mb-2">Step 3</div>
                <h3 className="font-semibold text-lg mb-2">Build Conviction</h3>
                <p className="text-zinc-400 text-sm">
                  Over time, you'll understand Bitcoin deeply. 
                  Make informed decisions with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-t border-zinc-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Join a <span className="text-orange-500">Trusted Community</span>
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                We're building more than an app - we're building a community of learners 
                who support each other on the journey to Bitcoin understanding.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-zinc-800/30 rounded-2xl border border-zinc-700">
                <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Active Community</h3>
                <p className="text-zinc-400 text-sm">
                  Connect with fellow learners, ask questions, and share your journey 
                  in our moderated community forums.
                </p>
              </div>

              <div className="text-center p-6 bg-zinc-800/30 rounded-2xl border border-zinc-700">
                <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Trusted Content</h3>
                <p className="text-zinc-400 text-sm">
                  Expert-curated curriculum designed for accuracy and clarity. 
                  No hype, no scams - just Bitcoin education done right.
                </p>
              </div>

              <div className="text-center p-6 bg-zinc-800/30 rounded-2xl border border-zinc-700">
                <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Vetted Resources</h3>
                <p className="text-zinc-400 text-sm">
                  Access our curated library of trusted Bitcoin products, tools, 
                  and resources from verified partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24 bg-zinc-950/50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                Why We Built <span className="text-orange-500">HODLearn</span>
              </h2>
            </div>

            <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-8 md:p-12">
              <div className="space-y-6 text-zinc-300 leading-relaxed">
                <p>
                  Bitcoin isn't just another investment. It's a fundamental shift in how 
                  money works. But most people don't understand it - and that's a problem.
                </p>
                
                <p>
                  Traditional finance education is boring, academic, and disconnected from 
                  real life. We believe the best way to learn Bitcoin is through 
                  <span className="text-orange-400 font-medium"> daily practice</span>, 
                  <span className="text-orange-400 font-medium"> immediate relevance</span>, and 
                  <span className="text-orange-400 font-medium"> hands-on experience</span>.
                </p>
                
                <p>
                  HODLearn is the "Duolingo of Bitcoin Education" - structured daily lessons 
                  that fit into your life, HODLearn Points that teach you to think in Bitcoin, 
                  and a supportive community of fellow learners.
                </p>

                <div className="pt-4 flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <span>Daily lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wallet className="w-5 h-5 text-orange-500" />
                    <span>BTC-pegged rewards</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-5 h-5 text-orange-500" />
                    <span>Trusted community</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-16 md:py-24">
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                Get in <span className="text-orange-500">Touch</span>
              </h2>
              <p className="text-zinc-400">
                Questions, feedback, or partnership inquiries? We'd love to hear from you.
              </p>
            </div>

            <Card className="bg-zinc-800/40 border-zinc-700">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-zinc-300">Name</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Your name"
                        className="bg-zinc-900 border-zinc-700 focus:border-orange-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-zinc-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="your@email.com"
                        className="bg-zinc-900 border-zinc-700 focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-zinc-300">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="How can we help?"
                      rows={4}
                      className="bg-zinc-900 border-zinc-700 focus:border-orange-500 resize-none"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-zinc-500 text-sm">
              <p>Or email us directly at <a href="mailto:info@hodlearn.io" className="text-orange-400 hover:underline">info@hodlearn.io</a></p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Ready to Start Your Bitcoin Journey?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Download HODLearn today and join thousands of learners building 
              their Bitcoin knowledge one day at a time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-zinc-100 rounded-xl px-8 py-4 transition-colors font-medium"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-70">Download on the</div>
                  <div className="text-base font-semibold">App Store</div>
                </div>
              </a>
              
              {deviceType !== 'ios' && (
                <a
                  href={playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-xl px-8 py-4 transition-colors font-medium"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-70">Get it on</div>
                    <div className="text-base font-semibold">Google Play</div>
                  </div>
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 py-12 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                  HL
                </div>
                <span className="text-lg font-bold">HODLearn</span>
              </div>
              <p className="text-zinc-500 text-sm max-w-sm">
                The smarter way to learn Bitcoin. Daily lessons, safe practice, 
                and a community of learners on the same journey.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-zinc-300">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-orange-400 transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-orange-400 transition-colors">About</button></li>
                <li><a href={appStoreUrl} className="hover:text-orange-400 transition-colors">Download App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-zinc-300">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-orange-400 transition-colors">Contact</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-zinc-600 text-sm">
              &copy; {new Date().getFullYear()} HODLearn. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-orange-400 transition-colors" aria-label="X (Twitter)">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-orange-400 transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-orange-400 transition-colors" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
