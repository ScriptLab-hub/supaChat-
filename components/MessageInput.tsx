import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { User } from "@supabase/supabase-js";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

// ------------------------
// Icon Components
// ------------------------
const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const EmojiIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AttachmentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

const Spinner: React.FC = () => (
  <svg className="animate-spin h-6 w-6 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// ------------------------
// Main Component
// ------------------------
interface MessageInputProps {
  onSendMessage: (text: string) => void;
  user: User;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, user }) => {
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // ------------------------
  // Submit Message
  // ------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText("");
      setShowEmojiPicker(false);
    }
  };

  // Handle Enter Key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // ------------------------
  // Emoji Picker
  // ------------------------
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputText((prev) => prev + emojiData.emoji);
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  // ------------------------
  // File Upload
  // ------------------------
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    try {
      const { error: uploadError } = await supabase.storage.from("supachat+").upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("supachat+").getPublicUrl(filePath);
      if (data.publicUrl) {
        onSendMessage(`[IMAGE]:${data.publicUrl}`);
      }
    } catch (error: any) {
      console.error("❌ File upload failed:", error.message);
      alert("File upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ------------------------
  // Close Emoji Picker When Clicking Outside
  // ------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ------------------------
  // JSX UI
  // ------------------------
  return (
    <div className="p-4 bg-gray-100 dark:bg-zinc-800/50 flex-shrink-0 relative">
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-full mb-2 right-4 z-10">
          <div className="bg-white dark:bg-zinc-700 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-600">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center space-x-2 bg-white dark:bg-zinc-700 shadow-md rounded-full p-2">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="p-2 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 rounded-full transition"
        >
          <EmojiIcon className="h-6 w-6" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
          autoComplete="off"
          disabled={isUploading}
        />

        {/* Hidden File Input */}
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />

        {/* Attachment */}
        <button
          type="button"
          onClick={handleAttachmentClick}
          disabled={isUploading}
          className="p-2 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 rounded-full transition disabled:opacity-50"
        >
          {isUploading ? <Spinner /> : <AttachmentIcon className="h-6 w-6" />}
        </button>

        {/* Send */}
        <button
          type="submit"
          className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-full p-3 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform active:scale-95 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none"
          disabled={!inputText.trim() || isUploading}
        >
          <SendIcon className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
