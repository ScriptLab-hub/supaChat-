import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { Profile } from '../types';
import { useAuth } from './AuthContext';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThreadSelected: (threadId: number) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose, onThreadSelected }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset state when modal is closed
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults([]);
      setLoading(false);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    // Debounced search
    const handler = setTimeout(() => {
      if (searchTerm.trim().length > 2) {
        performSearch(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const performSearch = async (query: string) => {
    if (!user) return;
    setLoading(true);
    setError('');
    
    // Search for profiles by full_name, excluding the current user
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('full_name', `%${query}%`)
      .not('id', 'eq', user.id)
      .limit(10);
      
    if (error) {
      console.error("Error searching users:", error);
      setError('Failed to search for users.');
    } else {
      setSearchResults(data || []);
    }
    setLoading(false);
  };

  const handleUserSelect = async (selectedUser: Profile) => {
    if (!user) return;
    
    // Check if a thread already exists between the two users
    // FIX: Corrected the .or() syntax to the valid format for Supabase v2 client.
    // The previous syntax was causing a malformed request.
    const { data: existingThread, error: findError } = await supabase
      .from('threads')
      .select('id')
      .or(`and(user1.eq.${user.id},user2.eq.${selectedUser.id}),and(user1.eq.${selectedUser.id},user2.eq.${user.id})`)
      .maybeSingle();

    if (findError) {
      // FIX: Improved error logging to show the actual error message.
      console.error("Error finding thread:", findError.message);
      alert("Could not start chat.");
      return;
    }

    if (existingThread) {
      // If thread exists, select it
      onThreadSelected(existingThread.id);
    } else {
      // If not, create a new thread
      const { data: newThread, error: createError } = await supabase
        .from('threads')
        .insert({ user1: user.id, user2: selectedUser.id })
        .select('id')
        .single();
        
      if (createError) {
        console.error("Error creating thread:", createError.message);
        alert("Could not create chat.");
      } else if (newThread) {
        onThreadSelected(newThread.id);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Start a New Chat</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Search for someone to start a conversation with.</p>
              
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="w-full mt-4 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
              />
            </div>
            
            <div className="max-h-64 overflow-y-auto border-t border-gray-200 dark:border-zinc-700">
              {loading && <p className="p-4 text-center text-gray-500">Searching...</p>}
              {error && <p className="p-4 text-center text-red-500">{error}</p>}
              {!loading && searchResults.length === 0 && searchTerm.length > 2 && (
                <p className="p-4 text-center text-gray-500">No users found.</p>
              )}
              <ul>
                {searchResults.map(profile => (
                  <li key={profile.id} onClick={() => handleUserSelect(profile)} className="flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700/50 transition-colors">
                    <img src={profile.avatar_url} alt={profile.full_name} className="h-10 w-10 rounded-full object-cover" />
                    <span className="ml-3 font-medium text-gray-800 dark:text-gray-200">{profile.full_name}</span>
                  </li>
                ))}
              </ul>
            </div>
             <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-200 dark:border-zinc-700 rounded-b-lg text-right">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:bg-zinc-700 dark:text-gray-300 dark:border-zinc-600 dark:hover:bg-zinc-600"
                >
                    Cancel
                </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewChatModal;