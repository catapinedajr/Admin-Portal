import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Shield, 
  ArrowUpRight, 
  Star, 
  ShoppingCart, 
  Wallet,
  TrendingUp,
  Shirt,
  Gift,
  ExternalLink
} from "@/lib/icons";
import BottomNavigation from "@/components/BottomNavigation";
import { useLocation } from "wouter";

type StoreCategory = "all" | "books" | "hardware" | "exchanges" | "ira" | "merch";

export default function StorePage() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<StoreCategory>("all");

  const categories = [
    { id: "all" as const, label: "All Products", icon: ShoppingCart },
    { id: "books" as const, label: "Books", icon: BookOpen },
    { id: "hardware" as const, label: "Hardware", icon: Shield },
    { id: "exchanges" as const, label: "Exchanges", icon: TrendingUp },
    { id: "ira" as const, label: "Bitcoin IRA", icon: Wallet },
    { id: "merch" as const, label: "Merch", icon: Shirt }
  ];

  const books = [
    {
      title: "The Bitcoin Standard",
      author: "Saifedean Ammous",
      price: "$24.99",
      rating: 4.8,
      description: "The definitive guide to Bitcoin's role as sound money",
      affiliate: true,
      image: "📚",
      link: "#"
    },
    {
      title: "Broken Money",
      author: "Lyn Alden",
      price: "$28.95",
      rating: 4.9,
      description: "How our monetary system is failing and how Bitcoin fixes it",
      affiliate: true,
      image: "📖",
      link: "#"
    },
    {
      title: "The Fiat Standard",
      author: "Saifedean Ammous",
      price: "$26.99",
      rating: 4.7,
      description: "The debt slavery alternative to human civilization",
      affiliate: true,
      image: "📘",
      link: "#"
    },
    {
      title: "Layered Money",
      author: "Nik Bhatia",
      price: "$22.50",
      rating: 4.6,
      description: "From gold and dollars to Bitcoin and central bank digital currencies",
      affiliate: true,
      image: "💰",
      link: "#"
    }
  ];

  const hardware = [
    {
      title: "Ledger Nano X",
      price: "$149.00",
      rating: 4.5,
      description: "Bluetooth-enabled hardware wallet with mobile app support",
      affiliate: true,
      image: "🔒",
      features: ["Bluetooth", "100+ Coins", "Mobile App"],
      link: "#"
    },
    {
      title: "Trezor Model T",
      price: "$219.00",
      rating: 4.7,
      description: "Touchscreen hardware wallet with advanced security features",
      affiliate: true,
      image: "🛡️",
      features: ["Touchscreen", "1000+ Coins", "Open Source"],
      link: "#"
    },
    {
      title: "Coldcard Mk4",
      price: "$147.00",
      rating: 4.8,
      description: "Bitcoin-only hardware wallet with air-gapped security",
      affiliate: true,
      image: "❄️",
      features: ["Bitcoin Only", "Air-Gapped", "Advanced Security"],
      link: "#"
    },
    {
      title: "SeedSigner",
      price: "$89.00",
      rating: 4.6,
      description: "DIY Bitcoin signing device for ultimate sovereignty",
      affiliate: true,
      image: "🌱",
      features: ["DIY Kit", "Air-Gapped", "No Storage"],
      link: "#"
    }
  ];

  const exchanges = [
    {
      title: "River Financial",
      description: "Bitcoin-only exchange with zero trading fees",
      bonus: "$25 Bitcoin bonus",
      rating: 4.9,
      image: "🏔️",
      features: ["Bitcoin Only", "Zero Fees", "Educational"],
      link: "#"
    },
    {
      title: "Swan Bitcoin",
      description: "Dollar-cost averaging made simple with automatic buys",
      bonus: "$10 Bitcoin bonus",
      rating: 4.8,
      image: "🦢",
      features: ["Auto DCA", "Low Fees", "Educational"],
      link: "#"
    },
    {
      title: "Strike",
      description: "Lightning-fast Bitcoin payments and purchases",
      bonus: "$5 Bitcoin bonus",
      rating: 4.7,
      image: "⚡",
      features: ["Lightning", "Instant", "No Trading Fees"],
      link: "#"
    },
    {
      title: "Cash App",
      description: "Simple Bitcoin buying with instant withdrawal",
      bonus: "$15 referral bonus",
      rating: 4.5,
      image: "💵",
      features: ["Simple UI", "Instant Buy", "Fast Withdrawal"],
      link: "#"
    }
  ];

  const iraProviders = [
    {
      title: "Bitcoin IRA",
      description: "Self-directed IRA with Bitcoin and cryptocurrency options",
      bonus: "Free consultation",
      rating: 4.6,
      image: "🏦",
      features: ["Tax Advantaged", "Self-Directed", "Secure Storage"],
      link: "#"
    },
    {
      title: "iTrustCapital",
      description: "Real-time trading platform for crypto IRAs",
      bonus: "No setup fees",
      rating: 4.4,
      image: "📈",
      features: ["Real-Time Trading", "Multiple Cryptos", "Low Fees"],
      link: "#"
    },
    {
      title: "Choice by Kingdom Trust",
      description: "Alternative investment IRA with Bitcoin custody",
      bonus: "Waived first year fees",
      rating: 4.3,
      image: "👑",
      features: ["Institutional Grade", "Full Custody", "Tax Benefits"],
      link: "#"
    }
  ];

  const merchandise = [
    {
      title: "HODLearn T-Shirt",
      price: "$24.99",
      description: "Premium cotton tee with HODLearn logo",
      image: "👕",
      sizes: ["S", "M", "L", "XL", "XXL"],
      link: "#"
    },
    {
      title: "Bitcoin Logo Hoodie",
      price: "$49.99",
      description: "Comfortable hoodie with embroidered Bitcoin logo",
      image: "🧥",
      sizes: ["S", "M", "L", "XL", "XXL"],
      link: "#"
    },
    {
      title: "HODL Mug",
      price: "$16.99",
      description: "11oz ceramic mug for your morning coffee",
      image: "☕",
      link: "#"
    },
    {
      title: "Bitcoin Sticker Pack",
      price: "$9.99",
      description: "Set of 10 weatherproof Bitcoin stickers",
      image: "🏷️",
      link: "#"
    },
    {
      title: "21 Million Cap",
      price: "$29.99",
      description: "Adjustable cap celebrating Bitcoin's fixed supply",
      image: "🧢",
      link: "#"
    },
    {
      title: "Hardware Wallet Case",
      price: "$19.99",
      description: "Protective case for hardware wallets",
      image: "💼",
      link: "#"
    }
  ];

  const filteredProducts = () => {
    switch (activeCategory) {
      case "books": return books;
      case "hardware": return hardware;
      case "exchanges": return exchanges;
      case "ira": return iraProviders;
      case "merch": return merchandise;
      default: return [...books, ...hardware, ...exchanges, ...iraProviders, ...merchandise];
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">HODLearn Store</h1>
              <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                Affiliate Partner
              </Badge>
            </div>
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Back to App
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={`flex items-center gap-2 ${
                    activeCategory === category.id
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <Card className="bg-zinc-900/50 border-zinc-700 mb-8">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Gift className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-zinc-300">
                <strong className="text-white">Affiliate Disclosure:</strong> HODLearn may earn a commission from purchases made through these links. 
                This helps support our free educational content while recommending only products we trust and use ourselves.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Books */}
          {(activeCategory === "all" || activeCategory === "books") && books.map((book, index) => (
            <Card key={`book-${index}`} className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl mb-2">{book.image}</div>
                    <CardTitle className="text-lg text-white">{book.title}</CardTitle>
                    <p className="text-zinc-400 text-sm">by {book.author}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-zinc-300">{book.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 text-sm mb-4">{book.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-white">{book.price}</span>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    Buy Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Hardware */}
          {(activeCategory === "all" || activeCategory === "hardware") && hardware.map((device, index) => (
            <Card key={`hardware-${index}`} className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl mb-2">{device.image}</div>
                    <CardTitle className="text-lg text-white">{device.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-zinc-300">{device.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 text-sm mb-3">{device.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {device.features.map((feature, i) => (
                    <Badge key={i} variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-white">{device.price}</span>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    Shop Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Exchanges */}
          {(activeCategory === "all" || activeCategory === "exchanges") && exchanges.map((exchange, index) => (
            <Card key={`exchange-${index}`} className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl mb-2">{exchange.image}</div>
                    <CardTitle className="text-lg text-white">{exchange.title}</CardTitle>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 mt-1">
                      {exchange.bonus}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-zinc-300">{exchange.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 text-sm mb-3">{exchange.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {exchange.features.map((feature, i) => (
                    <Badge key={i} variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Get Bonus
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* IRA Providers */}
          {(activeCategory === "all" || activeCategory === "ira") && iraProviders.map((provider, index) => (
            <Card key={`ira-${index}`} className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl mb-2">{provider.image}</div>
                    <CardTitle className="text-lg text-white">{provider.title}</CardTitle>
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mt-1">
                      {provider.bonus}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-zinc-300">{provider.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 text-sm mb-3">{provider.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {provider.features.map((feature, i) => (
                    <Badge key={i} variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Learn More
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Merchandise */}
          {(activeCategory === "all" || activeCategory === "merch") && merchandise.map((item, index) => (
            <Card key={`merch-${index}`} className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors">
              <CardHeader>
                <div>
                  <div className="text-2xl mb-2">{item.image}</div>
                  <CardTitle className="text-lg text-white">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 text-sm mb-3">{item.description}</p>
                {item.sizes && (
                  <div className="mb-4">
                    <p className="text-xs text-zinc-400 mb-2">Available Sizes:</p>
                    <div className="flex gap-1">
                      {item.sizes.map((size, i) => (
                        <Badge key={i} variant="outline" className="border-zinc-600 text-zinc-300 text-xs">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-white">{item.price}</span>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    Add to Cart
                    <ShoppingCart className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-zinc-900/50 border-zinc-700 mt-12">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Store Coming Soon</h3>
            <p className="text-zinc-300 mb-4">
              We're working on integrating real affiliate links and a complete shopping experience. 
              For now, these products showcase what will be available in our store.
            </p>
            <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">
              Development Preview
            </Badge>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation 
        activeSection="more"
        onSectionChange={(section) => {
          if (section === 'home') setLocation('/');
          else if (section === 'learn') setLocation('/learn');
          else if (section === 'money') setLocation('/money');
          else if (section === 'simulators') setLocation('/simulators');
          else if (section === 'more') setLocation('/more');
        }}
      />
    </div>
  );
}