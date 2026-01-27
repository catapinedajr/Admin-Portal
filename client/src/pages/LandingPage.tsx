import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import appScreenshot from "@/assets/IMG_5095.PNG";
import { 
  Shield, 
  Wallet,
  Calendar,
  Trophy,
  ArrowRight,
  CheckCircle,
  Sparkles,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  Users
} from "lucide-react";

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
  
  useEffect(() => {
    captureUtmParams();
  }, []);

  const appStoreUrl = "https://apps.apple.com/app/hodlearn";
  
  const socialLinks = {
    twitter: "https://x.com/thehodlearn",
    instagram: "https://instagram.com/hodlearn",
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
              <div>
                <span className="text-lg md:text-xl font-bold">HODLearn™</span>
                <p className="text-xs text-zinc-400 hidden sm:block">How-to-learn BTC</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
              <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About</button>
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
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 flex flex-col gap-2 md:gap-3">
                  <span>Stop Wondering About Bitcoin.</span>
                  <span className="text-zinc-400">Start Learning.</span>
                  <span className="text-orange-500 whitespace-nowrap">This is HODLearn<sup className="text-[0.5em]">™</sup></span>
                </h1>
                
                <p className="text-zinc-400 text-base md:text-lg max-w-lg mb-8">
                  Daily lessons. 8 interactive simulators. Community forums. 
                  Everything you need to understand Bitcoin - five minutes at a time.
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
                    <Calendar className="w-4 h-4 text-orange-500" />
                    5 minutes a day
                  </span>
                </div>
              </div>

              <div className="hidden md:flex justify-center">
                <div className="relative">
                  <div className="w-64 h-[520px] bg-zinc-950 rounded-[3rem] border-4 border-zinc-700 shadow-2xl overflow-hidden p-2">
                    <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-zinc-900">
                      <img 
                        src={appScreenshot} 
                        alt="HODLearn App" 
                        className="w-full h-full object-cover object-top" 
                      />
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
                  <h3 className="font-semibold text-lg mb-2">Daily Lessons</h3>
                  <p className="text-zinc-400 text-sm">
                    One lesson per day, 5 minutes each. Build knowledge 
                    step by step without feeling overwhelmed.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/40 border-zinc-700 hover:border-orange-500/40 transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">8 Practice Simulators</h3>
                  <p className="text-zinc-400 text-sm">
                    DCA Calculator, HODL Simulator, Security Training, and more. 
                    Practice without risking real money.
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
                    Earn points tied to Bitcoin for every lesson. 
                    Start thinking in Bitcoin while you learn.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/40 border-zinc-700 hover:border-orange-500/40 transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Trophy className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Learning Competitions</h3>
                  <p className="text-zinc-400 text-sm">
                    Compete with other learners in challenges. 
                    Win real prizes while leveling up your knowledge.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/40 border-zinc-700 hover:border-orange-500/40 transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Community Forums</h3>
                  <p className="text-zinc-400 text-sm">
                    Ask questions, share your journey, and learn 
                    from fellow Bitcoin enthusiasts.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/40 border-zinc-700 hover:border-orange-500/40 transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <ShoppingBag className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Curated Store</h3>
                  <p className="text-zinc-400 text-sm">
                    Tested and reviewed Bitcoin products and services. 
                    We've vetted them so you don't have to.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-zinc-900">
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative bg-zinc-800/50 border border-zinc-700 rounded-2xl p-8 md:p-12">
              <div className="absolute -top-4 left-8 text-6xl text-orange-500/30 font-serif">"</div>
              <blockquote className="text-xl md:text-2xl text-zinc-200 leading-relaxed mb-6">
                After 5+ years of studying Bitcoin, I realized the secret wasn't reading whitepapers 
                or watching endless videos. It was learning a little bit each day, having a community 
                to ask questions, and tools to practice before touching real money. I built HODLearn 
                to bring it all together — trusted content, real tools, vetted products, and people 
                on the same journey. So when someone asks "How did you learn so much about Bitcoin?" 
                the answer is simple: HODLearn.
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <span className="text-orange-500 font-bold">HL</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Founder</p>
                  <p className="text-zinc-500 text-sm">HODLearn</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24 border-t border-zinc-800">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                Why <span className="text-orange-500">HODLearn</span>?
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                We're not just teaching Bitcoin. We're building a place where you can 
                learn at your own pace and find support when you need it.
              </p>
            </div>

            <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-8 md:p-10 mb-10">
              <div className="space-y-5 text-zinc-300 leading-relaxed">
                <p>
                  Bitcoin can be confusing. And when prices drop or someone tells you it's a scam, 
                  you'll have questions. <span className="text-orange-400 font-medium">We're here to help you find answers</span> - 
                  today and years from now.
                </p>
                
                <p>
                  Bitcoin keeps evolving. New companies, new uses, new ways people are adopting it every day. 
                  <span className="text-orange-400 font-medium">We'll help you keep up</span> so you always understand what's happening 
                  and why it matters.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <div className="text-center p-5 bg-zinc-800/30 rounded-2xl border border-zinc-700">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2">No Hype, No Scams</h3>
                <p className="text-zinc-400 text-sm">
                  Honest, expert-curated content. Just real education.
                </p>
              </div>

              <div className="text-center p-5 bg-zinc-800/30 rounded-2xl border border-zinc-700">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2">Community Support</h3>
                <p className="text-zinc-400 text-sm">
                  Ask questions, share your journey, learn together.
                </p>
              </div>

              <div className="text-center p-5 bg-zinc-800/30 rounded-2xl border border-zinc-700">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2">Always Current</h3>
                <p className="text-zinc-400 text-sm">
                  Stay informed as Bitcoin and its ecosystem evolve.
                </p>
              </div>
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
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                HL
              </div>
              <div>
                <span className="text-lg font-bold">HODLearn™</span>
                <p className="text-xs text-zinc-400">How-to-learn BTC</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <a href="/privacy" className="hover:text-orange-400 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-orange-400 transition-colors">Terms</a>
              <a href="mailto:info@hodlearn.io" className="hover:text-orange-400 transition-colors">info@hodlearn.io</a>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-800">
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
