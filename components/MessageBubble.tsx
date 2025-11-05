// components/MessageBubble.tsx
import React from "react";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  text: string;
  outgoing?: boolean;
  time?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  outgoing = false,
  time,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`w-full flex ${outgoing ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`relative px-3 py-2 rounded-2xl text-sm leading-snug 
          max-w-[75%] break-words
          ${
            outgoing
              ? "bg-emerald-500 text-white rounded-br-sm"
              : "bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-gray-100 rounded-bl-sm"
          }`}
      >
        {/* Message text */}
        <p className="whitespace-pre-wrap pr-10">{text}</p>

        {/* Timestamp inside bubble bottom-right */}
        {time && (
          <span
            className={`absolute bottom-1 right-2 text-[10px] ${
              outgoing ? "text-white/80" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {time}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
