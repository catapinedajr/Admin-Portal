import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Gamepad2, TrendingUp, BookOpen, Shield, MessageCircle } from "lucide-react";

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

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const deviceType = getDeviceType();

  const appStoreUrl = "https://apps.apple.com/app/hodlearn";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.hodlearn";

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                HL
              </div>
              <span className="text-lg md:text-xl font-bold">HODLearn™</span>
            </div>
            <Button
              onClick={() => setLocation('/auth')}
              variant="ghost"
              size="sm"
              className="text-zinc-300 hover:text-white hover:bg-zinc-800"
              data-testid="button-login-header"
            >
              Log In
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-12 md:py-20 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight px-2">
            Stop Wondering About Bitcoin.
            <br />
            <span className="text-orange-500">Start Learning.</span>
          </h1>
          <p className="text-base md:text-lg text-orange-400/90 font-medium mb-4 md:mb-5">
            This is HODLearn
          </p>
          <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto mb-4 md:mb-6 px-4">
            Daily Bitcoin lessons, safe simulators, and an active community — all in one place.
          </p>
          
          {/* Social Proof */}
          <div className="flex items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-zinc-500 mb-6 md:mb-8">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-orange-500/70" />
              <span>Active community</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-orange-500/70" />
              <span>Learn together</span>
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
            <Button
              onClick={() => setLocation('/auth?mode=register')}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 w-full sm:w-auto"
              data-testid="button-get-started"
            >
              Get Started Free
            </Button>
            <Button
              onClick={() => setLocation('/auth')}
              size="lg"
              variant="outline"
              className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 text-white px-6 md:px-8 w-full sm:w-auto"
              data-testid="button-login-hero"
            >
              Log In
            </Button>
          </div>
        </section>

        {/* How It Works - 3 Steps */}
        <section className="py-10 md:py-14 border-t border-zinc-800">
          <h2 className="text-lg md:text-xl font-semibold text-center mb-8 md:mb-10 text-zinc-300">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Step 1: Learn */}
            <div className="text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-500/15 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2 text-white">Learn</h3>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                Daily bite-sized lessons. 5-10 minutes. No jargon.
              </p>
            </div>

            {/* Arrow (desktop only) */}
            <div className="hidden md:flex items-center justify-center -mx-4">
              <div className="w-full h-px bg-gradient-to-r from-zinc-700 via-orange-500/50 to-zinc-700" />
            </div>

            {/* Step 2: Practice */}
            <div className="text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-500/15 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2 text-white">Practice</h3>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                Risk-free simulators. Learn before using real Bitcoin.
              </p>
            </div>

            {/* Arrow (desktop only) */}
            <div className="hidden md:flex items-center justify-center -mx-4">
              <div className="w-full h-px bg-gradient-to-r from-zinc-700 via-orange-500/50 to-zinc-700" />
            </div>

            {/* Step 3: Connect */}
            <div className="text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-500/15 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2 text-white">Connect</h3>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                Join a community of learners. Ask questions. Build conviction.
              </p>
            </div>
          </div>
        </section>

        {/* Value Grid - 3 Cards */}
        <section className="py-10 md:py-14 border-t border-zinc-800/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {/* Community Card - First */}
            <Card className="bg-zinc-800/40 border-zinc-700/50 hover:border-orange-500/40 transition-colors">
              <CardContent className="p-5 md:p-6">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Community</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Learn alongside others on the same journey. Discuss ideas, ask questions, and build conviction together.
                </p>
              </CardContent>
            </Card>

            {/* Practice Card */}
            <Card className="bg-zinc-800/40 border-zinc-700/50 hover:border-orange-500/40 transition-colors">
              <CardContent className="p-5 md:p-6">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Gamepad2 className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Practice</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Try wallets, security training, and DCA strategies in safe simulators — no real money at risk.
                </p>
              </CardContent>
            </Card>

            {/* Track Card */}
            <Card className="bg-zinc-800/40 border-zinc-700/50 hover:border-orange-500/40 transition-colors">
              <CardContent className="p-5 md:p-6">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Track</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Real-time Bitcoin prices and insights. See how inflation impacts your purchasing power.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 md:py-16 text-center border-t border-zinc-800/50">
          <p className="text-zinc-400 text-sm mb-4">Ready to start?</p>
          <Button
            onClick={() => setLocation('/auth?mode=register')}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 md:px-10 py-5 md:py-6 text-base md:text-lg"
            data-testid="button-cta-bottom"
          >
            Join the Community & Start Learning
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 md:py-10 bg-zinc-900/50">
        <div className="max-w-5xl mx-auto px-4">
          {/* App Download */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            {(deviceType === 'ios' || deviceType === 'desktop') && (
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-4 py-2.5 transition-colors text-sm"
                data-testid="link-app-store"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>App Store</span>
              </a>
            )}
            {(deviceType === 'android' || deviceType === 'desktop') && (
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-4 py-2.5 transition-colors text-sm"
                data-testid="link-play-store"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <span>Google Play</span>
              </a>
            )}
          </div>

          {/* Footer Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© HODLearn</p>
            <div className="flex gap-6">
              <a 
                href="/terms" 
                className="hover:text-orange-500 transition-colors"
                data-testid="link-terms"
              >
                Terms
              </a>
              <a 
                href="/privacy" 
                className="hover:text-orange-500 transition-colors"
                data-testid="link-privacy"
              >
                Privacy
              </a>
              <a 
                href="/about" 
                className="hover:text-orange-500 transition-colors"
                data-testid="link-about"
              >
                About
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
