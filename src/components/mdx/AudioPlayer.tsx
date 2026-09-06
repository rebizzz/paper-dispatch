'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc3 } from 'lucide-react';
import { withBasePath } from '@/lib/basePath';

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  duration?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title = 'Audio Dispatch',
  artist = 'Voice Recording / Audio Note',
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setTotalDuration(audio.duration || 0);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-paper-border bg-paper-card p-4 sm:p-5 shadow-sm transition-all duration-200">
      <audio ref={audioRef} src={withBasePath(src)} preload="metadata" />

      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Disc/Icon + Track Info */}
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-3.5">
          <div
            className={`relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-paper-subtle border border-paper-border text-paper-coral ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '6s' }}
          >
            <Disc3 className="h-5 w-5 text-paper-coral" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-sans font-semibold text-paper-ink text-sm tracking-tight truncate">{title}</span>
              <span className="shrink-0 rounded-md bg-paper-coral/10 px-2 py-0.5 text-[10px] font-mono font-medium text-paper-coral border border-paper-coral/20">Audio</span>
            </div>
            <p className="text-xs text-paper-textSubtle truncate">{artist}</p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper-ink text-paper-bg shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current translate-x-0.5" />}
          </button>

          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-paper-border bg-paper-subtle text-paper-textSubtle hover:text-paper-ink"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-paper-coral" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Progress & Time */}
      <div className="mt-4 space-y-1.5">
        <div className="relative flex items-center py-1">
          <input
            type="range"
            min="0"
            max={totalDuration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-paper-subtle accent-paper-coral outline-none"
          />
        </div>
        <div className="flex justify-between font-mono text-[11px] text-paper-textSubtle">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>
    </div>
  );
};
