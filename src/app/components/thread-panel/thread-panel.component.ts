import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatStoreService } from '../../services/chat-store.service';

@Component({
  selector: 'app-thread-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './thread-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThreadPanelComponent {
  readonly selectedMessage$ = this.store.selectedMessage$;
  readonly threadMessages$ = this.store.threadMessages$;
  readonly reply = new FormControl('', { nonNullable: true });

  constructor(private store: ChatStoreService, destroyRef: DestroyRef) {
    this.selectedMessage$
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((message) => {
        if (!message) {
          this.reply.setValue('');
        }
      });
  }

  send(): void {
    const value = this.reply.value.trim();
    if (!value) {
      return;
    }
    this.store.addThreadReply(value);
    this.reply.setValue('');
  }

  close(): void {
    this.store.selectMessage(null);
  }
}
