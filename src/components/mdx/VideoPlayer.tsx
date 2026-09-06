'use client';

import React from 'react';
import { Film } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  caption?: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  caption,
  poster,
  autoplay = false,
  loop = false,
  muted = true,
  controls = true,
}) => {
  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  const isVimeo = src.includes('vimeo.com');

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0];
    } else if (url.includes('embed/')) {
      return url;
    }
    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  };

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-paper-border bg-paper-card shadow-sm transition-all duration-200">
      <div className="relative aspect-video w-full overflow-hidden bg-black/40">
        {isYouTube ? (
          <iframe
            src={getYouTubeEmbedUrl(src)}
            title={caption || 'Video player'}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isVimeo ? (
          <iframe
            src={src}
            title={caption || 'Video player'}
            className="h-full w-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={src}
            poster={poster}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            controls={controls}
            playsInline
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {caption && (
        <figcaption className="flex items-center gap-2 border-t border-paper-border bg-paper-subtle px-4 py-2 text-xs text-paper-textSubtle">
          <Film className="h-3.5 w-3.5 text-paper-coral" />
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  );
};
