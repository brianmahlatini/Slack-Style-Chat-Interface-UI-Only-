import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, map } from 'rxjs';
import { ChatStoreService } from '../../services/chat-store.service';

@Component({
  selector: 'app-typing-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typing-indicator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypingIndicatorComponent {
  readonly typing$ = combineLatest([
    this.store.activeChannelId$,
    this.store.typingUsers$
  ]).pipe(
    map(([channelId, typingMap]) => typingMap[channelId] ?? [])
  );

  constructor(private store: ChatStoreService) {}
}
