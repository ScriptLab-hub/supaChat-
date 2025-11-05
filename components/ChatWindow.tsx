import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Thread, Message } from '../types';
import { User } from '@supabase/supabase-js';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { supabase } from '../supabaseClient';
import { formatTime } from "../utils/formatTime";


interface ChatWindowProps {
  thread: Thread;
  user: User;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ thread, user, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);


  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (!thread?.id) return;

    const loadMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', thread.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
      // Use auto scroll on initial load for instant positioning
      setTimeout(() => scrollToBottom('auto'), 0);
    };
    loadMessages();

    const channel = supabase
      .channel(`thread-${thread.id}`)
      .on<Message>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${thread.id}` },
        (payload) => {
          if (payload.new.sender_id !== user.id) {
            setIsTyping(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          }
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [thread?.id, user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !user || !thread) return;

    const { error } = await supabase.from('messages').insert([{ 
      thread_id: thread.id,
      sender_id: user.id,
      content: text 
    }]);

    if (error) {
      console.error("Error sending message:", error);
      alert("Could not send message.");
    } else {
      // Simulate typing indicator
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = window.setTimeout(() => setIsTyping(false), 3000);
    }
  }, [user, thread]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-100 dark:bg-zinc-900">
      <ChatHeader thread={thread} onBack={onBack} isTyping={isTyping} />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              <div className="flex flex-col h-full w-full overflow-y-auto chat-bg p-4">

              {messages.map((m) => (
  <MessageBubble
    key={m.id}
    text={m.content}
    outgoing={m.sender_id === user.id}
    time={formatTime(m.created_at)}
  />
))}
</div>


            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <MessageInput onSendMessage={handleSendMessage} user={user} />
    </div>
  );
};

export default ChatWindow;