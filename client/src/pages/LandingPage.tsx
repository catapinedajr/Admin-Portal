import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Gamepad2, Settings, Check } from "lucide-react";

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
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                HL
              </div>
              <span className="text-xl font-bold">HODLearn™</span>
            </div>
            <Button
              onClick={() => setLocation('/auth')}
              variant="outline"
              className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
              data-testid="button-login-header"
            >
              Log In
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Stop Wondering About Bitcoin.
            <br />
            <span className="text-orange-500">Start Learning.</span>
          </h1>
          <p className="text-lg md:text-xl text-orange-400 font-medium mb-6">
            This is HODLearn
          </p>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8">
            Learn Bitcoin in bite-sized daily lessons. No jargon. No confusion. Just clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setLocation('/auth?mode=register')}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
              data-testid="button-get-started"
            >
              Get Started Free
            </Button>
            <Button
              onClick={() => setLocation('/auth')}
              size="lg"
              variant="outline"
              className="border-zinc-600 bg-zinc-800/50 hover:bg-zinc-800 text-white px-8"
              data-testid="button-login-hero"
            >
              Log In
            </Button>
          </div>
        </section>

        {/* App Download Section */}
        <section className="py-12 text-center border-t border-zinc-800">
          <h2 className="text-xl font-semibold mb-6 text-zinc-300">Get the App</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(deviceType === 'ios' || deviceType === 'desktop') && (
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl px-6 py-3 transition-colors"
                data-testid="link-app-store"
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-zinc-400">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </a>
            )}
            {(deviceType === 'android' || deviceType === 'desktop') && (
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl px-6 py-3 transition-colors"
                data-testid="link-play-store"
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-zinc-400">Get it on</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </a>
            )}
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="py-12 border-t border-zinc-800">
          <h2 className="text-2xl font-bold text-center mb-8">What You'll Get</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Money</h3>
                <p className="text-sm text-zinc-400">
                  Track Bitcoin prices in real-time. See how inflation impacts your purchasing power.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Connect</h3>
                <p className="text-sm text-zinc-400">
                  Join a community of Bitcoin learners. Discuss, ask questions, and learn together.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Practice</h3>
                <p className="text-sm text-zinc-400">
                  Try risk-free simulators for wallets, security training, DCA strategies, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-white">More</h3>
                <p className="text-sm text-zinc-400">
                  Access the Bitcoin glossary, track achievements, manage your account settings.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why HODLearn Section */}
        <section className="py-12 border-t border-zinc-800">
          <h2 className="text-2xl font-bold text-center mb-8">Why HODLearn?</h2>
          <div className="max-w-xl mx-auto space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-zinc-300">Daily bite-sized lessons (5-10 minutes)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-zinc-300">Earn sats as you learn</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-zinc-300">Practice with safe simulators before using real Bitcoin</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-zinc-300">Join a supportive community of learners</p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 text-center border-t border-zinc-800">
          <Button
            onClick={() => setLocation('/auth?mode=register')}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-6 text-lg"
            data-testid="button-cta-bottom"
          >
            Start Your Bitcoin Education Today
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
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
