import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Channel, Message, Reaction, ThreadMessage, TypingEvent } from '../models';
import { MockWebSocketService } from './mock-websocket.service';

const BASE_CHANNELS: Channel[] = [
  {
    id: 'general',
    name: 'general',
    type: 'public',
    unreadCount: 2,
    topic: 'Company-wide chatter and alignment',
    members: ['Avery', 'Jordan', 'Riley', 'Morgan', 'Taylor']
  },
  {
    id: 'product',
    name: 'product',
    type: 'public',
    unreadCount: 0,
    topic: 'Roadmap, experiments, and discovery',
    members: ['Avery', 'Jordan', 'Riley']
  },
  {
    id: 'design',
    name: 'design',
    type: 'public',
    unreadCount: 5,
    topic: 'UX, brand, and visual systems',
    members: ['Morgan', 'Taylor']
  },
  {
    id: 'launch-war-room',
    name: 'launch-war-room',
    type: 'private',
    unreadCount: 1,
    topic: 'Release coordination',
    members: ['Avery', 'Taylor']
  },
  {
    id: 'dm-avery',
    name: 'Avery',
    type: 'dm',
    unreadCount: 0,
    topic: 'Direct messages',
    members: ['You', 'Avery']
  }
];

const EMOJI_OPTIONS = ['🔥', '✅', '🎯', '👀', '🫶'];

@Injectable({ providedIn: 'root' })
export class ChatStoreService {
  private channelsSubject = new BehaviorSubject<Channel[]>(BASE_CHANNELS);
  readonly channels$ = this.channelsSubject.asObservable();

  private activeChannelIdSubject = new BehaviorSubject<string>('general');
  readonly activeChannelId$ = this.activeChannelIdSubject.asObservable();

  private searchQuerySubject = new BehaviorSubject<string>('');
  readonly searchQuery$ = this.searchQuerySubject.asObservable();

  private selectedMessageIdSubject = new BehaviorSubject<string | null>(null);
  readonly selectedMessageId$ = this.selectedMessageIdSubject.asObservable();

  private typingUsersSubject = new BehaviorSubject<Record<string, string[]>>({});
  readonly typingUsers$ = this.typingUsersSubject.asObservable();

  private messagesUpdatedSubject = new BehaviorSubject<number>(0);
  private threadUpdatedSubject = new BehaviorSubject<number>(0);

  private messagesByChannel = new Map<string, Message[]>();
  private threadsByMessage = new Map<string, ThreadMessage[]>();
  private oldestTimestampByChannel = new Map<string, number>();
  private remainingPagesByChannel = new Map<string, number>();

  constructor(private socket: MockWebSocketService) {
    this.seedMessages();
    this.socket.connect(BASE_CHANNELS.map((c) => c.id));
    this.socket.message$.subscribe((message) => this.handleIncoming(message));
    this.socket.typing$.subscribe((event) => this.handleTyping(event));
  }

  readonly activeChannel$ = combineLatest([this.channels$, this.activeChannelId$]).pipe(
    map(([channels, activeId]) => channels.find((c) => c.id === activeId) ?? channels[0])
  );

  readonly messages$ = combineLatest([
    this.activeChannelId$,
    this.searchQuery$,
    this.messagesUpdatedSubject
  ]).pipe(
    map(([channelId, query]) => {
      const messages = this.messagesByChannel.get(channelId) ?? [];
      if (!query.trim()) {
        return messages;
      }
      const needle = query.toLowerCase();
      return messages.filter((msg) =>
        [msg.content, msg.author].some((text) => text.toLowerCase().includes(needle))
      );
    })
  );

  readonly pinnedMessages$ = combineLatest([
    this.activeChannelId$,
    this.messagesUpdatedSubject
  ]).pipe(
    map(([channelId]) => {
      const messages = this.messagesByChannel.get(channelId) ?? [];
      return messages.filter((msg) => msg.isPinned);
    })
  );

  readonly threadMessages$ = combineLatest([
    this.activeChannelId$,
    this.selectedMessageId$,
    this.threadUpdatedSubject
  ]).pipe(
    map(([_, messageId]) => (messageId ? this.threadsByMessage.get(messageId) ?? [] : []))
  );

  readonly selectedMessage$ = combineLatest([
    this.activeChannelId$,
    this.selectedMessageId$,
    this.messagesUpdatedSubject
  ]).pipe(
    map(([channelId, messageId]) => {
      const messages = this.messagesByChannel.get(channelId) ?? [];
      return messages.find((msg) => msg.id === messageId) ?? null;
    })
  );

  readonly canLoadMore$ = this.activeChannelId$.pipe(
    map((channelId) => (this.remainingPagesByChannel.get(channelId) ?? 0) > 0)
  );

  setActiveChannel(channelId: string): void {
    this.activeChannelIdSubject.next(channelId);
    this.selectedMessageIdSubject.next(null);
    const channels = this.channelsSubject.value.map((channel) =>
      channel.id === channelId ? { ...channel, unreadCount: 0 } : channel
    );
    this.channelsSubject.next(channels);
  }

  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  selectMessage(messageId: string | null): void {
    this.selectedMessageIdSubject.next(messageId);
  }

  sendMessage(content: string): void {
    const channelId = this.activeChannelIdSubject.value;
    const message: Message = {
      id: crypto.randomUUID(),
      channelId,
      author: 'You',
      avatar: '🧑‍💻',
      content,
      timestamp: Date.now(),
      reactions: [],
      threadCount: 0,
      isPinned: false
    };
    this.insertMessage(channelId, message, 'append');
  }

  togglePinned(messageId: string): void {
    const channelId = this.activeChannelIdSubject.value;
    const messages = this.messagesByChannel.get(channelId) ?? [];
    const updated = messages.map((msg) =>
      msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
    );
    this.messagesByChannel.set(channelId, updated);
    this.bumpMessages();
  }

  toggleReaction(messageId: string, emoji: string): void {
    const channelId = this.activeChannelIdSubject.value;
    const messages = this.messagesByChannel.get(channelId) ?? [];
    const updated = messages.map((msg) => {
      if (msg.id !== messageId) {
        return msg;
      }
      const existing = msg.reactions.find((r) => r.emoji === emoji);
      let reactions: Reaction[];
      if (existing) {
        reactions = msg.reactions.map((r) =>
          r.emoji === emoji ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted } : r
        );
      } else {
        reactions = [...msg.reactions, { emoji, count: 1, reacted: true }];
      }
      return { ...msg, reactions };
    });
    this.messagesByChannel.set(channelId, updated);
    this.bumpMessages();
  }

  loadOlderMessages(): void {
    const channelId = this.activeChannelIdSubject.value;
    const remaining = this.remainingPagesByChannel.get(channelId) ?? 0;
    if (remaining <= 0) {
      return;
    }
    const oldest = this.oldestTimestampByChannel.get(channelId) ?? Date.now();
    const olderMessages = this.generateMessages(channelId, oldest - 60_000, 12, -1);
    this.insertMessages(channelId, olderMessages, 'prepend');
    this.oldestTimestampByChannel.set(channelId, olderMessages[0].timestamp);
    this.remainingPagesByChannel.set(channelId, remaining - 1);
  }

  addThreadReply(content: string): void {
    const messageId = this.selectedMessageIdSubject.value;
    if (!messageId) {
      return;
    }
    const thread = this.threadsByMessage.get(messageId) ?? [];
    const reply: ThreadMessage = {
      id: crypto.randomUUID(),
      parentId: messageId,
      author: 'You',
      avatar: '🧑‍💻',
      content,
      timestamp: Date.now()
    };
    this.threadsByMessage.set(messageId, [...thread, reply]);
    this.threadUpdatedSubject.next(this.threadUpdatedSubject.value + 1);
    const channelId = this.activeChannelIdSubject.value;
    const messages = this.messagesByChannel.get(channelId) ?? [];
    const updated = messages.map((msg) =>
      msg.id === messageId ? { ...msg, threadCount: Math.max(1, msg.threadCount + 1) } : msg
    );
    this.messagesByChannel.set(channelId, updated);
    this.bumpMessages();
  }

  getEmojiOptions(): string[] {
    return EMOJI_OPTIONS;
  }

  private seedMessages(): void {
    BASE_CHANNELS.forEach((channel) => {
      const baseTime = Date.now() - 1000 * 60 * 60;
      const messages = this.generateMessages(channel.id, baseTime, 24, 1);
      this.messagesByChannel.set(channel.id, messages);
      this.oldestTimestampByChannel.set(channel.id, messages[0].timestamp);
      this.remainingPagesByChannel.set(channel.id, 3);
      messages.forEach((message) => {
        if (message.threadCount > 0) {
          this.threadsByMessage.set(
            message.id,
            this.generateThreadMessages(message.id, message.threadCount, message.timestamp + 60_000)
          );
        }
      });
    });
    this.bumpMessages();
  }

  private generateMessages(channelId: string, startTime: number, count: number, direction: 1 | -1): Message[] {
    const authors = [
      { name: 'Avery', avatar: '🦊' },
      { name: 'Jordan', avatar: '🧠' },
      { name: 'Riley', avatar: '🎧' },
      { name: 'Morgan', avatar: '🛰️' },
      { name: 'Taylor', avatar: '🧩' }
    ];
    const baseLines = [
      'Syncing on the weekly priorities now.',
      'Can we tighten the loading skeleton in the thread panel?',
      'Pinned the launch checklist for faster access.',
      'Testing emoji reactions feels smooth.',
      'Let us align on the new onboarding copy.'
    ];
    const items: Message[] = [];
    for (let i = 0; i < count; i += 1) {
      const author = authors[(i + channelId.length) % authors.length];
      const content = baseLines[(i + channelId.length) % baseLines.length];
      const timestamp = startTime + direction * i * 2 * 60 * 1000;
      items.push({
        id: crypto.randomUUID(),
        channelId,
        author: author.name,
        avatar: author.avatar,
        content,
        timestamp,
        reactions: [],
        threadCount: Math.random() > 0.6 ? Math.ceil(Math.random() * 3) : 0,
        isPinned: Math.random() > 0.9
      });
    }
    return direction === 1 ? items : items.reverse();
  }

  private generateThreadMessages(parentId: string, count: number, startTime: number): ThreadMessage[] {
    const authors = [
      { name: 'Jordan', avatar: '🧠' },
      { name: 'Riley', avatar: '🎧' },
      { name: 'Morgan', avatar: '🛰️' }
    ];
    const replies = [
      'Pulling a quick clip to share.',
      'Agree — we should prioritize that.',
      'I can grab the notes and summarize.'
    ];
    return Array.from({ length: count }).map((_, index) => {
      const author = authors[index % authors.length];
      return {
        id: crypto.randomUUID(),
        parentId,
        author: author.name,
        avatar: author.avatar,
        content: replies[index % replies.length],
        timestamp: startTime + index * 120_000
      };
    });
  }

  private insertMessage(channelId: string, message: Message, position: 'append' | 'prepend'): void {
    this.insertMessages(channelId, [message], position);
  }

  private insertMessages(channelId: string, messages: Message[], position: 'append' | 'prepend'): void {
    const current = this.messagesByChannel.get(channelId) ?? [];
    const updated = position === 'append' ? [...current, ...messages] : [...messages, ...current];
    this.messagesByChannel.set(channelId, updated);
    this.bumpMessages();
  }

  private handleIncoming(message: Message): void {
    this.insertMessage(message.channelId, message, 'append');
    this.bumpUnread(message.channelId);
  }

  private bumpMessages(): void {
    this.messagesUpdatedSubject.next(this.messagesUpdatedSubject.value + 1);
  }

  private handleTyping(event: TypingEvent): void {
    const current = this.typingUsersSubject.value;
    const channelTyping = new Set(current[event.channelId] ?? []);
    channelTyping.add(event.user);
    this.typingUsersSubject.next({
      ...current,
      [event.channelId]: Array.from(channelTyping).slice(0, 3)
    });
    setTimeout(() => {
      const updated = this.typingUsersSubject.value;
      const after = (updated[event.channelId] ?? []).filter((user) => user !== event.user);
      this.typingUsersSubject.next({ ...updated, [event.channelId]: after });
    }, 2500);
  }

  private bumpUnread(channelId: string): void {
    const channels = this.channelsSubject.value.map((channel) => {
      if (channel.id !== channelId) {
        return channel;
      }
      if (channelId === this.activeChannelIdSubject.value) {
        return channel;
      }
      return { ...channel, unreadCount: channel.unreadCount + 1 };
    });
    this.channelsSubject.next(channels);
  }
}
