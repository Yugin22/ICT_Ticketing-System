import React from 'react';
import { Bell } from 'lucide-react';

interface TicketBellProps {
  /** Whether the ticket has a new unread message */
  hasNew: boolean;
  /** Click handler for navigating to ticket details */
  onClick?: () => void;
}

/**
 * Small bell icon displayed before each ticket ID in the admin recent operations table.
 * When `hasNew` is true it shakes (bellShake animation) and shows a red dot badge.
 */
export const TicketBell: React.FC<TicketBellProps> = ({ hasNew, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center mr-2 focus:outline-none"
    >
      <Bell
        size={16}
        className={hasNew ? 'animate-bell text-red-500' : 'text-[#1a2744]'}
      />
      {hasNew && (
        <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full border border-white" />
      )}
    </button>
  );
};

export default TicketBell;
