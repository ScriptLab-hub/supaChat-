import React from 'react';
import { Thread } from '../types';

interface ChatListProps {
  threads: Thread[];
  loading: boolean;
  selectedThreadId: number | null;
  onSelectThread: (id: number) => void;
  onNewChat: () => void;
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const NewChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const ThreadItem: React.FC<{ thread: Thread; isSelected: boolean; onSelect: () => void; }> = ({ thread, isSelected, onSelect }) => {
  const lastMessageText = thread.lastMessage?.content ?? 'No messages yet.';
  
  const getTimeDisplay = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString();
  }
  
  const lastMessageTime = getTimeDisplay(thread.lastMessage?.created_at);
  
  return (
    <li
      onClick={onSelect}
      className={`flex items-center p-3 cursor-pointer transition-all duration-200 rounded-xl mx-2 my-1 border shadow-sm ${
        isSelected 
        ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700 shadow-md' 
        : 'border-transparent hover:bg-emerald-50 dark:hover:bg-zinc-700/50 hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-md'
      }`}
    >
      <div className="relative flex-shrink-0">
        <img src={thread.otherUser.avatar_url} alt={thread.otherUser.full_name} className="h-12 w-12 rounded-full object-cover border-2 border-emerald-400 p-0.5" />
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-zinc-800"></span>
      </div>
      <div className="flex-1 ml-4 overflow-hidden">
        <div className="flex justify-between items-baseline">
          <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{thread.otherUser.full_name}</p>
          <p className={`text-xs text-emerald-600 dark:text-emerald-400 font-medium flex-shrink-0`}>
            {lastMessageTime}
          </p>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate w-full">{lastMessageText}</p>
        </div>
      </div>
    </li>
  );
};

const ChatList: React.FC<ChatListProps> = ({ threads, loading, selectedThreadId, onSelectThread, onNewChat }) => {
  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700">
      <header className="p-4 border-b border-gray-200 dark:border-zinc-700 flex-shrink-0 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">SupaChat+</h1>
        <button onClick={onNewChat} className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors p-1 rounded-full hover:bg-emerald-100 dark:hover:bg-zinc-700" aria-label="Start new chat">
            <NewChatIcon className="h-6 w-6"/>
        </button>
      </header>
      
      <div className="p-3">
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search classmates..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
            <div className="p-4 text-center text-gray-500">Loading chats...</div>
        ) : threads.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No chats yet. Start one!</div>
        ) : (
          <ul>
            {threads.map(thread => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isSelected={thread.id === selectedThreadId}
                onSelect={() => onSelectThread(thread.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatList;