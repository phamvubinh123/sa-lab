import React, { useState } from 'react';
import { ExternalLink, Play, Video } from 'lucide-react';
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  getYouTubeWatchUrl,
  type VideoResource
} from '../data/videoResources';
import type { Lang } from '../data/i18n';

interface Props {
  video: VideoResource;
  lang: Lang;
  compact?: boolean;
}

export const YouTubeEmbedCard: React.FC<Props> = ({ video, lang, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const isVi = lang === 'vi';

  return (
    <div className={`yt-video-card ${compact ? 'compact' : ''}`}>
      <div className="yt-player-frame">
        {isPlaying ? (
          <iframe
            src={getYouTubeEmbedUrl(video.youtubeId, true)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            className="yt-thumbnail-btn"
            onClick={() => setIsPlaying(true)}
            aria-label={isVi ? `Phát video: ${video.title}` : `Play video: ${video.title}`}
          >
            <img
              src={getYouTubeThumbnailUrl(video.youtubeId)}
              alt={video.title}
              loading="lazy"
            />
            <span className="yt-play-overlay">
              <Play size={24} fill="currentColor" />
            </span>
            <span className="yt-duration-badge">{video.duration}</span>
          </button>
        )}
      </div>

      <div className="yt-video-meta">
        <div className="yt-meta-top">
          <span className="yt-channel-pill">
            <Video size={13} />
            {video.channel}
          </span>
          <a
            href={getYouTubeWatchUrl(video.youtubeId)}
            target="_blank"
            rel="noopener noreferrer"
            className="yt-external-link"
          >
            {isVi ? 'Mở trên YouTube' : 'Watch on YouTube'}
            <ExternalLink size={12} />
          </a>
        </div>
        <h4 className="yt-video-title">{video.title}</h4>
        <p className="yt-video-highlight">
          {isVi ? video.highlightVi : video.highlightEn}
        </p>
      </div>
    </div>
  );
};
