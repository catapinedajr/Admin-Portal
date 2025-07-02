import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Store() {
  return (
    <div className="relative space-y-6">
      {/* Coming Soon Watermark Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold text-orange-500/20 transform -rotate-12 select-none">
            COMING SOON
          </div>
          <div className="bg-zinc-900/90 rounded-lg p-6 border border-orange-500/30">
            <h4 className="text-2xl font-bold text-orange-400 mb-2">Store Opening Soon</h4>
            <p className="text-zinc-300 max-w-md">
              We're curating the best Bitcoin hardware, books, and learning resources for you. 
              Check back soon for exclusive deals!
            </p>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Bitcoin Learning Store</h3>
        <p className="text-zinc-400">Essential tools and resources for your Bitcoin journey</p>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Hardware Wallets */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h4 className="text-lg font-bold text-white mb-4">Hardware Wallets</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h5 className="font-semibold text-white">Ledger Nano X</h5>
                  <p className="text-sm text-zinc-400">Secure hardware wallet</p>
                </div>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  $149
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h5 className="font-semibold text-white">Trezor Model T</h5>
                  <p className="text-sm text-zinc-400">Advanced security features</p>
                </div>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  $219
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Books */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h4 className="text-lg font-bold text-white mb-4">Essential Reading</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h5 className="font-semibold text-white">Broken Money by Lyn Alden</h5>
                  <p className="text-sm text-zinc-400">Modern monetary analysis</p>
                </div>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  $25
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h5 className="font-semibold text-white">The Bitcoin Standard</h5>
                  <p className="text-sm text-zinc-400">Bitcoin economics masterpiece</p>
                </div>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  $20
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Affiliate Disclosure */}
      <div className="text-center">
        <p className="text-xs text-zinc-500">
          We may earn a commission from purchases made through these links. This helps support BTC Journey's educational mission.
        </p>
      </div>
    </div>
  );
}