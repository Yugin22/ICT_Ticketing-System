import React, { useEffect, useState } from 'react';
import { Bell, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface AdminBellProps {
  /** Number of unread messages */
  unreadCount: number;
  /** Called when the bell is clicked */
  onClick: () => void;
  /** The message text to show in the tooltip */
  tooltipText?: string;
}

export const AdminBell: React.FC<AdminBellProps> = ({ unreadCount, onClick, tooltipText = 'Message received from a user' }) => {
  const [hasNew, setHasNew] = useState(false);

  // Update hasNew whenever unreadCount changes
  useEffect(() => {
    setHasNew(unreadCount > 0);
  }, [unreadCount]);

  // Real‑time subscription to messages table (admin side)
  useEffect(() => {
    const channel = supabase
      .channel('admin-bell-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        setHasNew(true);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="relative group overflow-visible" title="Refresh notifications">
      {/* Bell icon */}
      <button
        onClick={() => {
          onClick();
          setHasNew(false);
        }}
        className={`flex items-center gap-2 p-2 rounded-full bg-[#f0f3f8] hover:bg-[#e8ecf2] transition-colors ${hasNew ? 'animate-bell' : ''}`}
      >
        <Bell size={18} className={hasNew ? 'text-red-500' : 'text-[#1a2744]'} />
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Tooltip appears only when there are unread messages */}
      {hasNew && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-100 transition-opacity duration-200 animate-fade-in-down z-50">
          <div className="admin-bell-tooltip max-w-[240px] whitespace-normal break-words">
            {tooltipText}
            <Mail size={14} className="animate-envelope" />
          </div>
          <div className="admin-bell-tooltip-arrow w-2 h-2 bg-[rgba(255,255,255,0.9)] rotate-45 translate-y-1/2" />
        </div>
      )}
    </div>
  );
};

export default AdminBell;
