import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import BottomNavigation from "@/components/BottomNavigation";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { Video, FileText, File, Link2, ExternalLink, Play, User as UserIcon, Wallet } from "lucide-react";

interface ResourceLink {
  id: number;
  title: string;
  description: string | null;
  url: string;
  type: string;
  category: string | null;
  thumbnailUrl: string | null;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function YouTubeEmbed({ videoId, title }: { videoId: string; title?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (isPlaying) {
    return (
      <div 
        className="relative w-full aspect-video rounded-t-lg overflow-hidden bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <div 
      className="relative w-full aspect-video cursor-pointer group rounded-t-lg overflow-hidden"
      onClick={(e) => {
        e.stopPropagation();
        setIsPlaying(true);
      }}
    >
      <img 
        src={thumbnailUrl}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
        </div>
      </div>
      <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white flex items-center gap-1">
        <Video className="w-3 h-3" />
        YouTube
      </div>
    </div>
  );
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'video': return Video;
    case 'article': return FileText;
    case 'document': return File;
    default: return Link2;
  }
}

function getCategoryLabel(category: string | null): string {
  if (!category) return '';
  const labels: Record<string, string> = {
    'bitcoin-basics': 'Bitcoin Basics',
    'economics': 'Economics',
    'security': 'Security',
    'technical': 'Technical',
    'history': 'History',
    'reference': 'Reference',
  };
  return labels[category] || category;
}

function ResourceCard({ resource }: { resource: ResourceLink }) {
  const TypeIcon = getTypeIcon(resource.type);
  const youtubeId = resource.type === 'video' ? extractYouTubeId(resource.url) : null;

  return (
    <Card className="bg-zinc-800/50 border-zinc-700 overflow-hidden hover:border-zinc-600 transition-colors">
      {youtubeId ? (
        <YouTubeEmbed videoId={youtubeId} title={resource.title} />
      ) : resource.thumbnailUrl ? (
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img 
            src={resource.thumbnailUrl} 
            alt={resource.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white flex items-center gap-1">
            <TypeIcon className="w-3 h-3" />
            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
          </div>
        </div>
      ) : (
        <div className="aspect-video bg-zinc-900 flex items-center justify-center rounded-t-lg">
          <TypeIcon className="w-12 h-12 text-zinc-600" />
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-white line-clamp-2">{resource.title}</h3>
          {!youtubeId && (
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0 p-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        
        {resource.description && (
          <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{resource.description}</p>
        )}
        
        <div className="flex items-center gap-2">
          {resource.category && (
            <Badge variant="outline" className="text-xs text-zinc-400 border-zinc-600">
              {getCategoryLabel(resource.category)}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs text-zinc-400 border-zinc-600">
            <TypeIcon className="w-3 h-3 mr-1" />
            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResourcesPage() {
  const [, setLocation] = useLocation();
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const { data: resources = [], isLoading } = useQuery<ResourceLink[]>({
    queryKey: ["/api/resources", typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.append('type', typeFilter);
      const res = await fetch(`/api/resources?${params}`);
      if (!res.ok) throw new Error('Failed to fetch resources');
      return res.json();
    }
  });

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'video', label: 'Videos' },
    { value: 'article', label: 'Articles' },
    { value: 'document', label: 'Documents' },
  ];

  return (
    <div className="min-h-screen bg-zinc-900">
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setLocation('/')}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                  HL
                </div>
                <div>
                  <h1 className="text-xl font-bold">HODLearn™</h1>
                  <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PWAInstallButton />
              <Button 
                onClick={() => setLocation('/wallet')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                title="Learning Wallet"
              >
                <Wallet className="w-4 h-4" />
              </Button>
              <Button 
                onClick={() => setLocation('/account')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                title="Account Settings"
              >
                <UserIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Resources</h2>
          <p className="text-zinc-400">Curated videos, articles, and documents to deepen your Bitcoin knowledge</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filterOptions.map(option => (
            <Button
              key={option.value}
              variant={typeFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter(option.value)}
              className={typeFilter === option.value 
                ? "bg-orange-500 hover:bg-orange-600 border-orange-500" 
                : "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600"
              }
            >
              {option.label}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="bg-zinc-800/50 border-zinc-700">
                <Skeleton className="aspect-video w-full rounded-t-lg" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-16">
            <Link2 className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
            <h3 className="text-lg font-medium text-zinc-400 mb-2">No resources yet</h3>
            <p className="text-zinc-500 text-sm">Check back soon for curated learning materials</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
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
