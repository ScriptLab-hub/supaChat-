export interface Profile {
  id: string; // uuid
  full_name: string;
  avatar_url: string;
}

// types.ts

// types.ts

export interface Message {
  id: number;
  thread_id: number;
  sender_id: string;     // ✅ Supabase column for sender
  content: string;       // ✅ actual message text (Supabase column)
  created_at: string;    // ✅ ISO timestamp from Supabase
}



// Enriched thread object for UI display, matching the RPC return type
export interface Thread {
  id: number;
  otherUser: Profile;
  lastMessage: Message | null;
}
