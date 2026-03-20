export type ChannelType = 'public' | 'private' | 'dm';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  unreadCount: number;
  topic: string;
  members: string[];
}

export interface Reaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

export interface Message {
  id: string;
  channelId: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: number;
  reactions: Reaction[];
  threadCount: number;
  isPinned: boolean;
}

export interface ThreadMessage {
  id: string;
  parentId: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: number;
}

export interface TypingEvent {
  channelId: string;
  user: string;
}
