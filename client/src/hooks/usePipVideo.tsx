import { useState, createContext, useContext, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface PipVideoData {
  videoId: string;
  title: string;
  creator: string;
  duration: string;
  note: string;
  progress: number;
  startTime?: number; // Current playback time when entering PIP
  onClose: () => void;
}

interface PipContextType {
  pipVideo: PipVideoData | null;
  setPipVideo: (video: PipVideoData | null) => void;
  expandVideo: (video: PipVideoData) => void;
}

const PipContext = createContext<PipContextType | null>(null);

export function PipProvider({ children }: { children: ReactNode }) {
  const [pipVideo, setPipVideo] = useState<PipVideoData | null>(null);
  const [expandedVideo, setExpandedVideo] = useState<PipVideoData | null>(null);

  const expandVideo = (video: PipVideoData) => {
    setPipVideo(null); // Clear PIP
    setExpandedVideo(video); // Show expanded
  };

  return (
    <PipContext.Provider value={{ pipVideo, setPipVideo, expandVideo }}>
      {children}
      
      {/* PIP Video */}
      {pipVideo && (
        <div className="fixed bottom-20 right-4 w-80 h-52 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-50 overflow-hidden">
          <div className="relative h-32">
            <iframe
              src={`https://www.youtube.com/embed/${pipVideo.videoId}?autoplay=1&modestbranding=1&rel=0`}
              className="w-full h-full rounded-t-lg"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => expandVideo(pipVideo)}
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
          
          <div className="p-3 bg-zinc-900">
            <h4 className="text-sm font-medium text-white truncate mb-1">{pipVideo.title}</h4>
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400 truncate">{pipVideo.creator}</p>
              <div className="flex items-center gap-2">
                <div className="w-12 bg-zinc-700 rounded-full h-1">
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

      {/* Expanded Video Dialog */}
      {expandedVideo && (
        <Dialog open={!!expandedVideo} onOpenChange={() => setExpandedVideo(null)}>
          <DialogContent className="max-w-7xl w-[95vw] h-[95vh] bg-zinc-900 border-zinc-700 p-0 overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold truncate flex-1">{expandedVideo.title}</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setExpandedVideo(null)}
                  className="bg-zinc-800 hover:bg-zinc-700 ml-4"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1">
                <iframe
                  src={`https://www.youtube.com/embed/${expandedVideo.videoId}?autoplay=1&modestbranding=1&rel=0`}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
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