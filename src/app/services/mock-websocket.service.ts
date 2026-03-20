import { Injectable } from '@angular/core';
import { Observable, Subject, interval, merge, timer } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { TypingEvent, Message } from '../models';

@Injectable({ providedIn: 'root' })
export class MockWebSocketService {
  private messageSubject = new Subject<Message>();
  private typingSubject = new Subject<TypingEvent>();

  readonly message$: Observable<Message> = this.messageSubject.asObservable();
  readonly typing$: Observable<TypingEvent> = this.typingSubject.asObservable();

  connect(channelIds: string[]): void {
    const authors = [
      { name: 'Avery', avatar: '🦊' },
      { name: 'Jordan', avatar: '🧠' },
      { name: 'Riley', avatar: '🎧' },
      { name: 'Morgan', avatar: '🛰️' },
      { name: 'Taylor', avatar: '🧩' }
    ];

    const sampleLines = [
      'Heads up: design review moved to 3pm.',
      'Just pushed the performance tweaks, FPS is smoother now.',
      'Anyone else seeing the badge count drift?',
      'Great work on the typing indicator, feels alive.',
      'We should pin the release checklist in here.'
    ];

    interval(9000)
      .pipe(share())
      .subscribe(() => {
        const channelId = channelIds[Math.floor(Math.random() * channelIds.length)];
        const author = authors[Math.floor(Math.random() * authors.length)];
        const content = sampleLines[Math.floor(Math.random() * sampleLines.length)];
        this.messageSubject.next({
          id: crypto.randomUUID(),
          channelId,
          author: author.name,
          avatar: author.avatar,
          content,
          timestamp: Date.now(),
          reactions: [],
          threadCount: Math.random() > 0.7 ? 1 : 0,
          isPinned: false
        });
      });

    merge(
      interval(5000).pipe(map(() => true)),
      timer(2500, 7000).pipe(map(() => false))
    ).subscribe((isTyping) => {
      if (!isTyping) {
        return;
      }
      const channelId = channelIds[Math.floor(Math.random() * channelIds.length)];
      const author = authors[Math.floor(Math.random() * authors.length)];
      this.typingSubject.next({ channelId, user: author.name });
    });
  }
}
