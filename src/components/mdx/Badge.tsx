import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'coral' | 'blue' | 'green' | 'purple' | 'amber';
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'coral' }) => {
  const colorMap = {
    coral: 'bg-paper-coral/15 text-paper-coral border-paper-coral/30',
    blue: 'bg-paper-blue/15 text-paper-blue border-paper-blue/30',
    green: 'bg-paper-green/15 text-paper-green border-paper-green/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium tracking-wide ${colorMap[color]}`}
    >
      {children}
    </span>
  );
};
