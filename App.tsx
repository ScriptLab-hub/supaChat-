import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import NewChatModal from "./components/NewChatModal";
import Auth from "./components/Auth";
import { useAuth } from "./components/AuthContext";
import { supabase, credentialsProvided } from "./supabaseClient";
import DarkModeToggle from "./components/DarkModeToggle";
import Header from "./components/Header";

const App: React.FC = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // 📡 Fetch Threads
  const fetchThreads = useCallback(async () => {
    if (!user) return;
    setLoadingThreads(true);

    const { data, error } = await supabase.rpc("get_threads_for_user");
    if (error) console.error("Error fetching threads:", error.message);

    setThreads(
      (data || []).map((t: any) => ({
        id: t.id,
        otherUser: t.other_user,
        lastMessage: t.last_message,
      }))
    );

    setLoadingThreads(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchThreads();
  }, [user, fetchThreads]);

  const handleSelectThread = (id: number) => setSelectedThreadId(id);
  const handleBackToList = () => setSelectedThreadId(null);
  const handleNewChat = () => setIsNewChatModalOpen(true);
  const handleNewChatCreated = (threadId: number) => {
    fetchThreads().then(() => {
      setSelectedThreadId(threadId);
      setIsNewChatModalOpen(false);
    });
  };

  // ❌ Missing Supabase Keys Screen
  if (!credentialsProvided) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-zinc-900 text-center">
        <div className="p-8 bg-white dark:bg-zinc-800 rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">⚙️ Configuration Required</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Your Supabase credentials are missing. Please open
            <code className="mx-1 bg-gray-200 dark:bg-zinc-700 rounded px-2 py-1 text-sm">supabaseClient.ts</code>
            and add your project URL and anon key.
          </p>
        </div>
      </div>
    );
  }

  // 🔐 Auth Screen
  if (!user) {
    return <Auth />;
  }

  // 🧱 Layout
  const selectedThread = threads.find((t) => t.id === selectedThreadId);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50 dark:bg-zinc-900 text-gray-800 dark:text-gray-100">
      {/* Left Sidebar (Chat List) */}
      <motion.div
        className={`${
          selectedThreadId ? "hidden md:flex" : "flex"
        } flex-col w-full md:w-[360px] border-r border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800`}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-zinc-700 bg-gradient-to-r from-emerald-500 to-teal-400 text-white">
          <h1 className="text-lg font-semibold">💬 SupaChat+</h1>
            <DarkModeToggle />

          <button
            onClick={handleNewChat}
            className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md text-sm font-medium"
          >
            New Chat
          </button>
        </div>
        <ChatList
          threads={threads}
          loading={loadingThreads}
          selectedThreadId={selectedThreadId}
          onSelectThread={handleSelectThread}
          onNewChat={handleNewChat}
        />

        <div className="flex flex-col h-screen bg-gray-50 dark:bg-zinc-900">
      <Header />
      {/* The rest of your chat UI */}
    </div>
      </motion.div>

      {/* Right Chat Window */}
      <motion.div
        className={`flex-grow flex-col ${
          selectedThreadId ? "flex" : "hidden md:flex"
        }`}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {selectedThread ? (
          <ChatWindow
            thread={selectedThread}
            user={user}
            onBack={handleBackToList}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-zinc-900 text-gray-500">
            <svg
              className="w-24 h-24 text-emerald-400 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h8a2 2 0 012 2v2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.5 8.5c.33.33.5.83.5 1.33s-.17 1-.5 1.33c-.33.33-.83.5-1.33.5s-1-.17-1.33-.5c-.33-.33-.5-.83-.5-1.33s.17-1 .5-1.33c.33-.33.83-.5 1.33-.5s1 .17 1.33.5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 12a8 8 0 11-8 8"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              👋 Welcome to SupaChat+
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Select a chat or start a new conversation.
            </p>
          </div>
        )}
      </motion.div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onThreadSelected={handleNewChatCreated}
      />
    </div>
  );
};

export default App;
