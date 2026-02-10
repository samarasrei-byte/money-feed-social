import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  hasNewStory: boolean;
}

// Mock stories data — will be replaced with real data later
const MOCK_STORIES: StoryUser[] = [
  { id: "you", username: "Seu Story", displayName: "Você", hasNewStory: false },
  { id: "1", username: "maria_fit", displayName: "Maria", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", hasNewStory: true },
  { id: "2", username: "joao_dev", displayName: "João", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", hasNewStory: true },
  { id: "3", username: "ana_style", displayName: "Ana", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", hasNewStory: true },
  { id: "4", username: "lucas_photo", displayName: "Lucas", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", hasNewStory: false },
  { id: "5", username: "carla_mk", displayName: "Carla", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", hasNewStory: true },
];

const STORY_IMAGES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5c3a7a5e16?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=400&h=700&fit=crop",
];

export function StoriesBar() {
  const [viewingStory, setViewingStory] = useState<StoryUser | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  const openStory = (story: StoryUser) => {
    if (story.id === "you") return;
    setViewingStory(story);
    setViewedIds((prev) => new Set(prev).add(story.id));
  };

  const storyIndex = viewingStory ? MOCK_STORIES.findIndex((s) => s.id === viewingStory.id) : -1;
  const storyImage = storyIndex > 0 ? STORY_IMAGES[(storyIndex - 1) % STORY_IMAGES.length] : "";

  return (
    <>
      <div className="border-b border-border bg-background">
        <ScrollArea className="w-full">
          <div className="flex gap-3 px-3 py-3">
            {MOCK_STORIES.map((story) => {
              const isYou = story.id === "you";
              const hasNew = story.hasNewStory && !viewedIds.has(story.id);
              const initials = story.displayName.slice(0, 2).toUpperCase();

              return (
                <button
                  key={story.id}
                  className="flex flex-col items-center gap-1 min-w-[64px]"
                  onClick={() => openStory(story)}
                >
                  <div
                    className={cn(
                      "relative rounded-full p-[2px]",
                      hasNew
                        ? "bg-gradient-primary"
                        : isYou
                        ? ""
                        : "bg-muted"
                    )}
                  >
                    <Avatar className="h-14 w-14 border-2 border-background">
                      <AvatarImage src={story.avatarUrl} alt={story.displayName} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {isYou && (
                      <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-background">
                        <Plus className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate w-16 text-center">
                    {story.username.length > 9 ? story.username.slice(0, 9) + "…" : story.username}
                  </span>
                </button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="h-0" />
        </ScrollArea>
      </div>

      {/* Story Viewer */}
      <Dialog open={!!viewingStory} onOpenChange={(open) => !open && setViewingStory(null)}>
        <DialogContent className="max-w-sm p-0 border-0 bg-black overflow-hidden rounded-2xl [&>button]:hidden">
          {viewingStory && (
            <div className="relative w-full aspect-[9/16] bg-black">
              {/* Progress bar */}
              <div className="absolute top-2 left-2 right-2 z-20 flex gap-1">
                <div className="flex-1 h-0.5 rounded-full bg-white/80" />
              </div>

              {/* Header */}
              <div className="absolute top-6 left-3 right-3 z-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-white/50">
                    <AvatarImage src={viewingStory.avatarUrl} />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {viewingStory.displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white text-sm font-semibold drop-shadow">
                    {viewingStory.username}
                  </span>
                </div>
                <button onClick={() => setViewingStory(null)}>
                  <X className="h-6 w-6 text-white drop-shadow" />
                </button>
              </div>

              {/* Story Image */}
              <img
                src={storyImage}
                alt="Story"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
