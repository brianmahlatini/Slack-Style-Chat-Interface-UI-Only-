import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ChatStoreService } from '../../services/chat-store.service';

@Component({
  selector: 'app-message-composer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './message-composer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComposerComponent {
  readonly message = new FormControl('', { nonNullable: true });

  constructor(private store: ChatStoreService) {}

  send(): void {
    const content = this.message.value.trim();
    if (!content) {
      return;
    }
    this.store.sendMessage(content);
    this.message.setValue('');
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}
