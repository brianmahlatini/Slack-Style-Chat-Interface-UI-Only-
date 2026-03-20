import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatStoreService } from './services/chat-store.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChannelListComponent } from './components/channel-list/channel-list.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PinnedBarComponent } from './components/pinned-bar/pinned-bar.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageComposerComponent } from './components/message-composer/message-composer.component';
import { TypingIndicatorComponent } from './components/typing-indicator/typing-indicator.component';
import { ThreadPanelComponent } from './components/thread-panel/thread-panel.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ChannelListComponent,
    SearchBarComponent,
    PinnedBarComponent,
    MessageListComponent,
    MessageComposerComponent,
    TypingIndicatorComponent,
    ThreadPanelComponent
  ],
  templateUrl: './shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  readonly activeChannel$ = this.store.activeChannel$;

  constructor(private store: ChatStoreService, route: ActivatedRoute, destroyRef: DestroyRef) {
    route.paramMap
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((params) => {
        const channelId = params.get('id');
        if (channelId) {
          this.store.setActiveChannel(channelId);
        }
      });
  }
}
