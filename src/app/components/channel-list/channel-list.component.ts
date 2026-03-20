import { ChangeDetectionStrategy, Component, DestroyRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatStoreService } from '../../services/chat-store.service';
import { Channel } from '../../models';

@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    tabindex: '0',
    class: 'outline-none'
  }
})
export class ChannelListComponent {
  channels: Channel[] = [];
  focusedIndex = 0;

  readonly channels$ = this.store.channels$;
  readonly activeChannelId$ = this.store.activeChannelId$;

  constructor(private store: ChatStoreService, private router: Router, destroyRef: DestroyRef) {
    this.channels$
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((channels) => (this.channels = channels));
  }

  selectChannel(channel: Channel, index: number): void {
    this.focusedIndex = index;
    this.store.setActiveChannel(channel.id);
    this.router.navigate(['/channel', channel.id]);
  }

  trackById(_: number, channel: Channel): string {
    return channel.id;
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
      return;
    }
    event.preventDefault();
    if (!this.channels.length) {
      return;
    }
    if (event.key === 'ArrowDown') {
      this.focusedIndex = Math.min(this.channels.length - 1, this.focusedIndex + 1);
      return;
    }
    if (event.key === 'ArrowUp') {
      this.focusedIndex = Math.max(0, this.focusedIndex - 1);
      return;
    }
    const channel = this.channels[this.focusedIndex];
    if (channel) {
      this.selectChannel(channel, this.focusedIndex);
    }
  }
}
