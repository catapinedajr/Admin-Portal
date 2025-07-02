import { Crown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PWAInstallButton from "@/components/PWAInstallButton";
import EmailCollectionModal from "@/components/EmailCollectionModal";
import { useState } from "react";

interface HomeHeaderProps {
  user: any;
  isPremium: boolean;
}

export default function HomeHeader({ user, isPremium }: HomeHeaderProps) {
  const [showEmailModal, setShowEmailModal] = useState(false);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  const greeting = user?.firstName 
    ? `${getTimeBasedGreeting()}, ${user.firstName}!`
    : getTimeBasedGreeting();

  return (
    <>
      <header className="bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-orange-500">H</span>
              <span className="text-xl font-bold text-orange-500">₿</span>
              <span className="text-2xl font-bold text-orange-500">DL</span>
              <span className="text-sm text-zinc-400 ml-1">How-to-learn BTC</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <PWAInstallButton />
            
            {isPremium ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-600/20 text-orange-400 rounded-md text-xs border border-orange-600/30">
                <Crown className="w-3 h-3" />
                <span className="sr-only">Premium</span>
              </div>
            ) : (
              <Button
                onClick={() => setShowEmailModal(true)}
                size="sm"
                className="flex items-center gap-1 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-xs border border-zinc-700"
              >
                <Plus className="w-3 h-3" />
                <span className="sr-only">Upgrade</span>
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-zinc-100">{greeting}</h1>
          <p className="text-zinc-400 mt-1">Ready to continue your Bitcoin journey?</p>
        </div>
      </header>

      <EmailCollectionModal 
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Upgrade to Premium"
        description="Get unlimited access to all Bitcoin learning content, advanced simulators, and premium features."
      />
    </>
  );
}