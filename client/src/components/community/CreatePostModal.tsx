import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X, Send } from 'lucide-react';

interface CreatePostModalProps {
  categoryId: number;
  categoryName: string;
  onClose: () => void;
  onCreatePost: (post: { title: string; content: string; categoryId: number; dayIndex?: number }) => void;
}

export function CreatePostModal({ categoryId, categoryName, onClose, onCreatePost }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dayIndex, setDayIndex] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onCreatePost({
        title: title.trim(),
        content: content.trim(),
        categoryId,
        dayIndex: dayIndex ? parseInt(dayIndex) : undefined
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg">Create New Post</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-zinc-400">Posting in</span>
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-300 border-orange-500/20">
              {categoryName}
            </Badge>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-zinc-300">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="What's your question or topic?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-orange-500/20"
              maxLength={200}
            />
            <div className="text-xs text-zinc-500 mt-1">
              {title.length}/200 characters
            </div>
          </div>
          
          {/* Content */}
          <div>
            <Label htmlFor="content" className="text-sm font-medium text-zinc-300">
              Content *
            </Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, ask questions, or start a discussion..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-orange-500/20 min-h-[120px]"
              maxLength={5000}
            />
            <div className="text-xs text-zinc-500 mt-1">
              {content.length}/5000 characters
            </div>
          </div>
          
          {/* Optional day link */}
          <div>
            <Label htmlFor="dayIndex" className="text-sm font-medium text-zinc-300">
              Related to Curriculum Day (Optional)
            </Label>
            <Input
              id="dayIndex"
              type="number"
              placeholder="e.g., 7"
              value={dayIndex}
              onChange={(e) => setDayIndex(e.target.value)}
              className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-orange-500/20"
              min="1"
              max="180"
            />
            <div className="text-xs text-zinc-500 mt-1">
              Link your post to a specific day in the HODLearn curriculum
            </div>
          </div>
          
          {/* Guidelines reminder */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-md p-3">
            <h4 className="text-sm font-medium text-orange-400 mb-2">Posting Guidelines</h4>
            <ul className="text-xs text-zinc-400 space-y-1">
              <li>• Be respectful and constructive</li>
              <li>• Provide context for your questions</li>
              <li>• Search existing posts before creating new ones</li>
              <li>• Focus on education, not financial advice</li>
            </ul>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !content.trim() || isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
            >
              {isSubmitting ? (
                'Posting...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" />
                  Create Post
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}