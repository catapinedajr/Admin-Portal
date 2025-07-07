import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Info, 
  ShoppingCart, 
  Clock, 
  Heart, 
  User, 
  Settings, 
  LogOut,
  BookOpen,
  Shield,
  TrendingUp,
  Wallet,
  Package,
  Star,
  ExternalLink,
  Gift
} from "@/lib/icons";

interface MoreSectionProps {
  moreSubTab: string;
  setMoreSubTab: (tab: string) => void;
}

export default function MoreSection({ moreSubTab, setMoreSubTab }: MoreSectionProps) {
  const [, setLocation] = useLocation();
  const [storeCategory, setStoreCategory] = useState("all");
  
  return (
    <div className="space-y-6">


      {/* More Sub-navigation */}
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2">
          <Button
            variant={moreSubTab === "about" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMoreSubTab("about")}
            className="text-xs px-3 py-1"
          >
            <Info className="w-3 h-3 mr-1" />
            About Us
          </Button>
          <Button
            variant={moreSubTab === "store" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMoreSubTab("store")}
            className="text-xs px-3 py-1"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Store
          </Button>
        </div>
      </div>

      {/* Store Section */}
      {moreSubTab === "store" && (
        <div className="space-y-6">
          {/* Store Header */}
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-white">HODLearn Store</h3>
            <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">
              Trusted Bitcoin Resources
            </Badge>
          </div>

          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: "all", label: "All", icon: ShoppingCart },
              { id: "books", label: "Books", icon: BookOpen },
              { id: "hardware", label: "Hardware", icon: Shield },
              { id: "exchanges", label: "Exchanges", icon: TrendingUp },
              { id: "ira", label: "Bitcoin IRA", icon: Wallet },
              { id: "merch", label: "Merch", icon: Package }
            ].map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  onClick={() => setStoreCategory(category.id)}
                  variant={storeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center gap-2 text-xs px-3 py-1 ${
                    storeCategory === category.id
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          {/* Affiliate Disclosure */}
          <Card className="bg-zinc-900/50 border-zinc-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Gift className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-zinc-300">
                  <strong className="text-white">Affiliate Disclosure:</strong> HODLearn may earn a commission from purchases. 
                  This supports our free educational content while recommending only products we trust.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Books */}
            {(storeCategory === "all" || storeCategory === "books") && (
              <>
                <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-2xl mb-2">📚</div>
                        <CardTitle className="text-lg text-white">The Bitcoin Standard</CardTitle>
                        <p className="text-zinc-400 text-sm">by Saifedean Ammous</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-zinc-300">4.8</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-zinc-300 text-sm mb-3">The definitive guide to Bitcoin's role as sound money</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">$24.99</span>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                        Buy Now
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-2xl mb-2">📖</div>
                        <CardTitle className="text-lg text-white">Broken Money</CardTitle>
                        <p className="text-zinc-400 text-sm">by Lyn Alden</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-zinc-300">4.9</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-zinc-300 text-sm mb-3">How our monetary system is failing and how Bitcoin fixes it</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">$28.95</span>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                        Buy Now
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Hardware */}
            {(storeCategory === "all" || storeCategory === "hardware") && (
              <>
                <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-2xl mb-2">🔒</div>
                        <CardTitle className="text-lg text-white">Ledger Nano X</CardTitle>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">Bluetooth</Badge>
                          <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">100+ Coins</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-zinc-300">4.5</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-zinc-300 text-sm mb-3">Bluetooth-enabled hardware wallet with mobile app support</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">$149.00</span>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                        Shop Now
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-2xl mb-2">🛡️</div>
                        <CardTitle className="text-lg text-white">Trezor Model T</CardTitle>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">Touchscreen</Badge>
                          <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">Open Source</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-zinc-300">4.7</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-zinc-300 text-sm mb-3">Touchscreen hardware wallet with advanced security features</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">$219.00</span>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                        Shop Now
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Exchanges */}
            {(storeCategory === "all" || storeCategory === "exchanges") && (
              <>
                <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-2xl mb-2">🏔️</div>
                        <CardTitle className="text-lg text-white">River Financial</CardTitle>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 mt-1">
                          $25 Bitcoin bonus
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-zinc-300">4.9</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-zinc-300 text-sm mb-3">Bitcoin-only exchange with zero trading fees</p>
                    <div className="flex gap-1 mb-3">
                      <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">Bitcoin Only</Badge>
                      <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">Zero Fees</Badge>
                    </div>
                    <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      Get Bonus
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-2xl mb-2">🦢</div>
                        <CardTitle className="text-lg text-white">Swan Bitcoin</CardTitle>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 mt-1">
                          $10 Bitcoin bonus
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-zinc-300">4.8</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-zinc-300 text-sm mb-3">Dollar-cost averaging made simple with automatic buys</p>
                    <div className="flex gap-1 mb-3">
                      <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">Auto DCA</Badge>
                      <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">Low Fees</Badge>
                    </div>
                    <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      Get Bonus
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Bitcoin IRA */}
            {(storeCategory === "all" || storeCategory === "ira") && (
              <>
                <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-2xl mb-2">🏦</div>
                        <CardTitle className="text-lg text-white">Bitcoin IRA</CardTitle>
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mt-1">
                          Free consultation
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-zinc-300">4.6</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-zinc-300 text-sm mb-3">Self-directed IRA with Bitcoin and cryptocurrency options</p>
                    <div className="flex gap-1 mb-3">
                      <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">Tax Advantaged</Badge>
                      <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">Secure Storage</Badge>
                    </div>
                    <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      Learn More
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-2xl mb-2">📈</div>
                        <CardTitle className="text-lg text-white">iTrustCapital</CardTitle>
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mt-1">
                          No setup fees
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-zinc-300">4.4</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-zinc-300 text-sm mb-3">Real-time trading platform for crypto IRAs</p>
                    <div className="flex gap-1 mb-3">
                      <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">Real-Time Trading</Badge>
                      <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">Low Fees</Badge>
                    </div>
                    <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      Learn More
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Merchandise */}
            {(storeCategory === "all" || storeCategory === "merch") && (
              <>
                <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div>
                      <div className="text-2xl mb-2">👕</div>
                      <CardTitle className="text-lg text-white">HODLearn T-Shirt</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-zinc-300 text-sm mb-3">Premium cotton tee with HODLearn logo</p>
                    <div className="mb-3">
                      <p className="text-xs text-zinc-400 mb-2">Available Sizes:</p>
                      <div className="flex gap-1">
                        {["S", "M", "L", "XL", "XXL"].map((size) => (
                          <Badge key={size} variant="outline" className="border-zinc-600 text-zinc-300 text-xs">
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">$24.99</span>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                        Add to Cart
                        <ShoppingCart className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div>
                      <div className="text-2xl mb-2">🧢</div>
                      <CardTitle className="text-lg text-white">21 Million Cap</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-zinc-300 text-sm mb-3">Adjustable cap celebrating Bitcoin's fixed supply</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">$29.99</span>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                        Add to Cart
                        <ShoppingCart className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Coming Soon Notice */}
          <Card className="bg-zinc-900/50 border-zinc-700">
            <CardContent className="p-4 text-center">
              <h4 className="text-lg font-bold text-white mb-2">Store Coming Soon</h4>
              <p className="text-zinc-300 text-sm mb-3">
                We're working on integrating real affiliate links and a complete shopping experience. 
                These products showcase what will be available.
              </p>
              <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                Development Preview
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* About Us Section */}
      {moreSubTab === "about" && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">About HODLearn</h3>
            <p className="text-zinc-400">The story behind how to learn Bitcoin</p>
          </div>

          {/* Full About Content */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-2xl mx-auto">
                HL
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-bold">Why HODLearn?</h4>
                <p className="text-zinc-300 leading-relaxed">
                  Bitcoin learning was overwhelming and confusing. We created HODLearn to make it simple, 
                  daily, and accessible for everyone - no technical background required.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  Just like HODLing requires patience, learning Bitcoin takes time. Small daily steps 
                  build real understanding and lasting conviction.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Philosophy Summary */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-400 mt-1" />
                  <div>
                    <h5 className="font-semibold text-white mb-1">Your Pace</h5>
                    <p className="text-sm text-zinc-400">
                      Everyone learns Bitcoin differently. We meet you where you are.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-orange-400 mt-1" />
                  <div>
                    <h5 className="font-semibold text-white mb-1">Built with Care</h5>
                    <p className="text-sm text-zinc-400">
                      Every lesson is written like we're explaining it to our own family.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}