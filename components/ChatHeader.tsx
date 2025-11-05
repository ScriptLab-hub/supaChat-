import React from 'react';
import { Thread } from '../types';

interface ChatHeaderProps {
  thread: Thread;
  onBack: () => void;
  isTyping?: boolean;
}

const BackArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);

const ChatHeader: React.FC<ChatHeaderProps> = ({ thread, onBack, isTyping }) => {
  return (
    <header className="relative flex items-center p-3 text-white bg-gradient-to-r from-emerald-500 to-teal-400 flex-shrink-0 z-10 shadow-lg animate-shimmer">
      <button onClick={onBack} className="md:hidden mr-3 text-white/80 hover:text-white transition-colors">
        <BackArrowIcon className="h-6 w-6" />
      </button>

      <img src={thread.otherUser.avatar_url} alt={thread.otherUser.full_name} className="h-10 w-10 rounded-full object-cover border-2 border-emerald-100/50" />
      <div className="ml-3 flex-1">
        <h2 className="text-lg font-semibold">{thread.otherUser.full_name}</h2>
        <div className="flex items-center space-x-1.5 h-4">
          {isTyping ? (
            <p className="text-sm text-emerald-100 italic animate-pulse">typing...</p>
          ) : (
            <>
              <span className="h-2 w-2 bg-green-300 rounded-full"></span>
              <p className="text-sm text-emerald-100">Online</p>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-white/80 hover:text-white transition-colors">
            <MenuIcon className="h-6 w-6"/>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-teal-300 to-emerald-300 animate-pulse"></div>
    </header>
  );
};

export default ChatHeader;