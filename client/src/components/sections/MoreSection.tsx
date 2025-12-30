import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  Gift,
  AlertCircle,
  ImageOff
} from "@/lib/icons";
import { apiRequest } from "@/lib/queryClient";

interface StoreProduct {
  id: string;
  type: 'affiliate' | 'referral' | 'inventory';
  name: string;
  description: string | null;
  category: string;
  priceUsd: string | null;
  imageUrl: string | null;
  url: string | null;
  vendor: string | null;
  isFeatured: boolean;
}

interface MoreSectionProps {
  moreSubTab: string;
  setMoreSubTab: (tab: string) => void;
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'book':
    case 'course':
      return BookOpen;
    case 'hardware_wallet':
    case 'software':
      return Shield;
    case 'exchange':
      return TrendingUp;
    case 'btc_ira':
    case 'lending':
    case 'custody':
      return Wallet;
    default:
      return Package;
  }
}

function mapBackendCategory(category: string): string {
  switch (category) {
    case 'book':
    case 'course':
      return 'books';
    case 'hardware_wallet':
    case 'software':
      return 'hardware';
    case 'exchange':
      return 'exchanges';
    case 'btc_ira':
    case 'lending':
    case 'custody':
      return 'ira';
    case 'apparel':
    case 'accessories':
    case 'stickers':
    case 'merch':
    case 'other':
      return 'merch';
    default:
      return 'all';
  }
}

function ProductImage({ src, alt }: { src: string | null; alt: string }) {
  const [error, setError] = useState(false);
  
  if (!src || error) {
    return (
      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
        <ImageOff className="w-6 h-6 text-orange-500/50" />
      </div>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-12 h-12 rounded-lg object-cover"
      onError={() => setError(true)}
    />
  );
}

export default function MoreSection({ moreSubTab, setMoreSubTab }: MoreSectionProps) {
  const [, setLocation] = useLocation();
  const [storeCategory, setStoreCategory] = useState("all");
  
  // Fetch store products from API
  const { data: storeData, isLoading, error } = useQuery<{ products: StoreProduct[] }>({
    queryKey: ['/api/store/products'],
    enabled: moreSubTab === 'store',
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Track clicks
  const trackClickMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiRequest('POST', `/api/store/click/${productId}`);
    },
  });

  const handleProductClick = (product: StoreProduct) => {
    trackClickMutation.mutate(product.id);
    if (product.url) {
      window.open(product.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Filter products by category
  const filteredProducts = storeData?.products.filter(p => 
    storeCategory === 'all' || mapBackendCategory(p.category) === storeCategory
  ) || [];

  // Get categories that have products
  const categoriesWithProducts = new Set(storeData?.products.map(p => mapBackendCategory(p.category)) || []);
  
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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full mt-3" />
                    <div className="flex justify-between items-center mt-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="bg-red-950/30 border-red-800">
              <CardContent className="p-6 text-center">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-white mb-2">Unable to load products</h4>
                <p className="text-zinc-400 text-sm">Please try again later.</p>
              </CardContent>
            </Card>
          ) : filteredProducts.length === 0 ? (
            <Card className="bg-zinc-900/50 border-zinc-700">
              <CardContent className="p-6 text-center">
                <Package className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-white mb-2">No products yet</h4>
                <p className="text-zinc-400 text-sm">
                  {storeCategory === 'all' 
                    ? "Check back soon for trusted Bitcoin resources." 
                    : `No ${storeCategory} products available yet.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => {
                const CategoryIcon = getCategoryIcon(product.category);
                const isExternal = product.type === 'affiliate' || product.type === 'referral';
                
                return (
                  <Card 
                    key={product.id} 
                    className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors cursor-pointer"
                    onClick={() => isExternal && handleProductClick(product)}
                    data-testid={`card-product-${product.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <ProductImage src={product.imageUrl} alt={product.name} />
                          <div>
                            <CardTitle className="text-lg text-white">{product.name}</CardTitle>
                            {product.vendor && (
                              <p className="text-zinc-400 text-sm">{product.vendor}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {product.isFeatured && (
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                              Featured
                            </Badge>
                          )}
                          <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs capitalize">
                            {product.category.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {product.description && (
                        <p className="text-zinc-300 text-sm mb-3 line-clamp-2">{product.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        {product.priceUsd ? (
                          <span className="text-lg font-bold text-white">
                            ${parseFloat(product.priceUsd).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-sm text-zinc-400">Free to sign up</span>
                        )}
                        {isExternal ? (
                          <Button 
                            size="sm" 
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(product);
                            }}
                          >
                            {product.type === 'affiliate' ? 'Shop Now' : 'Learn More'}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            Add to Cart
                            <ShoppingCart className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
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