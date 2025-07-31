import { useState, createContext, useContext, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, X } from 'lucide-react';

interface PipVideoData {
  videoId: string;
  title: string;
  creator: string;
  progress: number;
  currentTime: number; // Track current playback time
  onExpand: () => void;
  onClose: () => void;
}

interface PipContextType {
  pipVideo: PipVideoData | null;
  setPipVideo: (video: PipVideoData | null) => void;
}

const PipContext = createContext<PipContextType | null>(null);

export function PipProvider({ children }: { children: ReactNode }) {
  const [pipVideo, setPipVideo] = useState<PipVideoData | null>(null);

  return (
    <PipContext.Provider value={{ pipVideo, setPipVideo }}>
      {children}
      {/* Global PIP Video - Always rendered when active */}
      {pipVideo && (
        <div className="fixed bottom-20 right-4 w-72 h-44 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-50 overflow-hidden">
          <div className="relative h-28">
            <iframe
              src={`https://www.youtube.com/embed/${pipVideo.videoId}?autoplay=1&modestbranding=1&rel=0&start=${pipVideo.currentTime}`}
              className="w-full h-full rounded-t-lg"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
            <div className="absolute top-1 right-1 flex gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  pipVideo.onExpand();
                  setPipVideo(null);
                }} 
                className="h-6 w-6 p-0 bg-black/70 hover:bg-black/90 text-white"
                title="Expand to full view"
              >
                <Maximize2 className="w-3 h-3" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  pipVideo.onClose();
                  setPipVideo(null);
                }} 
                className="h-6 w-6 p-0 bg-black/70 hover:bg-black/90 text-white"
                title="Close video"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="p-2 bg-zinc-900">
            <h4 className="text-xs font-medium text-white truncate">{pipVideo.title}</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-zinc-400 truncate">{pipVideo.creator}</p>
              <div className="flex items-center gap-1">
                <div className="w-8 bg-zinc-700 rounded-full h-1">
                  <div
                    className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${pipVideo.progress}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400">{Math.round(pipVideo.progress)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </PipContext.Provider>
  );
}

export function usePipVideo() {
  const context = useContext(PipContext);
  if (!context) {
    throw new Error('usePipVideo must be used within a PipProvider');
  }
  return context;
}