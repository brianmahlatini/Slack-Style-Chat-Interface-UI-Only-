# Slack-Style Chat Interface (UI Only)

This repository is a senior-level Angular UI build that recreates the interaction model of a Slack-style product. It is **UI-only** by design: all data is mocked locally, and real-time behavior is simulated with RxJS and a mock WebSocket service. The goal is to demonstrate production-quality UI composition, strong state flow, and performance-conscious rendering in Angular.

## What This Project Is About

- Building a cohesive chat workspace with channels, threads, and reactions.
- Demonstrating real-time UI updates using RxJS streams.
- Proving performance techniques such as virtual scrolling and OnPush change detection.
- Delivering a fully responsive layout that works across desktop and tablet sizes.

## What You Get Out of the Box

- Workspace sidebar and channel list with unread counts.
- Threaded messages with a dedicated thread panel.
- Emoji reactions and pinned messages.
- Typing indicators and message search.
- Virtual scrolling and infinite loading.
- Keyboard navigation for channel selection.

## Tech Stack

- Angular 17 (standalone components)
- RxJS
- Tailwind CSS
- Angular Router
- Angular CDK (Virtual Scroll)
- Mock WebSocket service

## Project Structure

```
Slack-Style Chat Interface (UI Only)
  src
    app
      components
        channel-list
        message-composer
        message-list
        pinned-bar
        search-bar
        sidebar
        thread-panel
        typing-indicator
      services
      ui
    assets
```

## Key Areas Explained

- **Channel List**: Displays channels, topics, and unread counts with keyboard navigation support.
- **Message List**: Virtualized timeline for performance, with reactions, pinned state, and thread entry points.
- **Thread Panel**: Focused conversation view for replies to a specific message.
- **Pinned Bar**: Highlights critical messages inside the channel.
- **Composer**: Responsive input with keyboard-friendly sending behavior.
- **Typing Indicator**: Live presence feedback driven by the mock WebSocket stream.

## Running Locally

1. `npm install`
2. `npm start`
3. Open `http://localhost:4200`

## Production Build

- `npm run build`
- Output folder: `dist/slack-style-chat-ui`

## Docker (Optional)

1. `docker build -t slack-ui .`
2. `docker run -p 8080:80 slack-ui`
3. Open `http://localhost:8080`

## Notes

- This project intentionally has **no backend**. All data is mocked.
- The UI is optimized for performance with virtualization and OnPush change detection.
