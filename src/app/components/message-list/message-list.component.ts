import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatStoreService } from '../../services/chat-store.service';
import { Message } from '../../models';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, ScrollingModule, DatePipe],
  templateUrl: './message-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageListComponent {
  readonly messages$ = this.store.messages$;
  readonly selectedMessage$ = this.store.selectedMessage$;
  readonly emojiOptions = this.store.getEmojiOptions();

  private canLoadMore = false;

  constructor(private store: ChatStoreService, destroyRef: DestroyRef) {
    this.store.canLoadMore$
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((value) => (this.canLoadMore = value));
  }

  onScrolled(index: number): void {
    if (index < 3 && this.canLoadMore) {
      this.store.loadOlderMessages();
    }
  }

  selectMessage(message: Message): void {
    this.store.selectMessage(message.id);
  }

  togglePinned(message: Message): void {
    this.store.togglePinned(message.id);
  }

  toggleReaction(message: Message, emoji: string): void {
    this.store.toggleReaction(message.id, emoji);
  }

  trackById(_: number, message: Message): string {
    return message.id;
  }
}
