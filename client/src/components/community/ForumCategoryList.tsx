import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, TrendingUp, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ForumCategory } from '@shared/schema';

interface ForumCategoryListProps {
  categories: ForumCategory[];
  onSelectCategory: (categoryId: number) => void;
}

export function ForumCategoryList({ categories, onSelectCategory }: ForumCategoryListProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Bitcoin Community Forums</h2>
        <Badge variant="secondary" className="bg-orange-500/10 text-orange-300 border-orange-500/20">
          {categories.length} Categories
        </Badge>
      </div>
      
      <p className="text-zinc-400 text-sm">
        Connect with fellow Bitcoiners, ask questions, and share insights on your Bitcoin journey.
      </p>
      
      {/* Category grid */}
      <div className="grid gap-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="bg-zinc-900/50 border-zinc-700/50 hover:border-orange-500/30 hover:scale-[1.01] transition-all duration-300 cursor-pointer"
            onClick={() => onSelectCategory(category.id)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white hover:text-orange-300 transition-colors">
                      {category.name}
                    </h3>
                    <Badge variant="outline" className="text-orange-400 border-orange-500/30">
                      {category.postCount} posts
                    </Badge>
                  </div>
                  
                  {category.description && (
                    <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{category.postCount} discussions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>Active community</span>
                    </div>
                  </div>
                </div>
                
                {/* Activity indicators */}
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Clock className="h-3 w-3" />
                    <span>Active</span>
                  </div>
                  {category.postCount > 10 && (
                    <div className="flex items-center gap-1 text-xs text-orange-400">
                      <TrendingUp className="h-3 w-3" />
                      <span>Popular</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <Card className="bg-zinc-900/30 border-zinc-700/30 p-3 text-center">
          <div className="text-lg font-bold text-orange-400">
            {categories.reduce((sum, cat) => sum + cat.postCount, 0)}
          </div>
          <div className="text-xs text-zinc-400">Total Discussions</div>
        </Card>
        
        <Card className="bg-zinc-900/30 border-zinc-700/30 p-3 text-center">
          <div className="text-lg font-bold text-orange-400">
            {categories.filter(cat => cat.postCount > 0).length}
          </div>
          <div className="text-xs text-zinc-400">Active Categories</div>
        </Card>
        
        <Card className="bg-zinc-900/30 border-zinc-700/30 p-3 text-center">
          <div className="text-lg font-bold text-orange-400">24/7</div>
          <div className="text-xs text-zinc-400">Community Online</div>
        </Card>
      </div>
    </div>
  );
}