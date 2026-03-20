import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ChatStoreService } from '../../services/chat-store.service';

@Component({
  selector: 'app-pinned-bar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './pinned-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PinnedBarComponent {
  readonly pinnedMessages$ = this.store.pinnedMessages$;

  constructor(private store: ChatStoreService) {}
}
