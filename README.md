# Slack-Style Chat Interface (UI Only)

This repository is a senior-level Angular UI build that emulates real-time collaboration patterns found in Slack-style products. The focus is on interaction design, strong visual hierarchy, and performant rendering for message-heavy timelines — while staying UI-only (no backend).

What this project is about

Building a cohesive chat UI with rich interaction patterns and stateful UX.
Proving real-time UI behaviors using RxJS and a mock WebSocket stream.
Showcasing performance-first rendering with virtual scrolling and OnPush change detection.
Delivering a responsive, production-ready layout using Tailwind.

What you get out of the box

Workspace sidebar + channel list with unread counts.
Threaded messages with dedicated thread panel.
Emoji reactions and pinned messages.
Typing indicators and message search.
Virtual scrolling and infinite loading.
Keyboard navigation for channel list.

What This Proves

You can build real-time UI patterns with Angular.
You understand scalable component composition and state flow.
You can optimize rendering performance for large timelines.
You can ship responsive, polished UI-only experiences.

Tech Stack

Angular 17 (standalone components)
RxJS
Tailwind CSS
Angular Router
Angular CDK (Virtual Scroll)
Mock WebSocket service

Project Structure
Key folders

src/app/components/ — UI building blocks
src/app/services/ — RxJS store and mock WebSocket
src/app/ui/ — Reserved for shared UI primitives
src/assets/ — Static assets

Full Tree (All Folders)
```
Slack-Style Chat Interface (UI Only)
  .angular
    cache
      17.3.17
        slack-style-chat-ui
        vite
          deps
          deps_temp_52eb5551
  dist
    slack-style-chat-ui
      browser
  node_modules
    .bin
    @alloc
      quick-lru
    @ampproject
      remapping
        dist
          types
    @angular
      animations
        browser
          testing
        esm2022
          browser
            src
              dsl
                style_normalization
              render
                web_animations
            testing
              src
          src
            players
        fesm2022
          browser
      cdk
        a11y
        accordion
        bidi
        clipboard
        coercion
        collections
        dialog
        drag-drop
        esm2022
          a11y
            aria-describer
            focus-monitor
            focus-trap
            high-contrast-mode
            input-modality
            interactivity-checker
            key-manager
            live-announcer
          accordion
          bidi
          clipboard
          coercion
          collections
          dialog
          drag-drop
            directives
            dom
            sorting
          keycodes
          layout
          listbox
          menu
          observers
            private
          overlay
            dispatchers
            position
            scroll
          platform
            features
          portal
          scrolling
          stepper
          table
          testing
            selenium-webdriver
            testbed
              fake-events
          text-field
          tree
            control
        fesm2022
          observers
          testing
        keycodes
        layout
        listbox
        menu
        observers
          private
        overlay
        platform
        portal
        schematics
          ng-add
          ng-generate
            drag-drop
              files
                __path__
                  __name@dasherize@if-flat__
          ng-update
            data
            html-parsing
            migrations
            typescript
          update-tool
            utils
          utils
            ast
        scrolling
        stepper
        table
        testing
          selenium-webdriver
          testbed
        text-field
        tree
      cli
        bin
        lib
          cli
          config
        src
          analytics
          command-builder
            utilities
          commands
            add
            analytics
              info
              settings
            build
            cache
              clean
              info
              settings
            completion
            config
            deploy
            doc
            e2e
            extract-i18n
            generate
            lint
            make-this-awesome
            new
            run
            serve
            test
            update
              schematic
            version
          utilities
      common
        esm2022
          http
            src
            testing
              src
          src
            directives
              ng_optimized_image
                image_loaders
            i18n
            location
            navigation
            pipes
          testing
            src
              navigation
          upgrade
            src
        fesm2022
          http
        http
          testing
        locales
          extra
          global
        testing
        upgrade
      compiler
        esm2022
          src
            compiler_util
            expression_parser
            i18n
              serializers
            ml_parser
            output
            render3
              partial
              view
                i18n
            schema
            template
              pipeline
                ir
                  src
                    ops
                src
                  phases
                  util
                switch
            template_parser
        fesm2022
      compiler-cli
        bundles
          linker
            babel
          ngcc
          private
          src
            bin
        linker
          babel
            src
              ast
          src
            ast
              typescript
            file_linker
              emit_scopes
              partial_linkers
        ngcc
        private
        src
          bin
          ngtsc
            annotations
              common
                src
              component
                src
              directive
                src
              ng_module
                src
              src
            core
              api
                src
              src
            cycles
              src
            diagnostics
              src
            docs
              src
            entry_point
              src
            file_system
              src
            imports
              src
            incremental
              semantic_graph
                src
              src
            indexer
              src
            logging
              src
            metadata
              src
            partial_evaluator
              src
            perf
              src
            program_driver
              src
            reflection
              src
            resource
              src
            scope
              src
            shims
              src
            sourcemaps
              src
            transform
              src
            translator
              src
                api
                import_manager
            typecheck
              api
              diagnostics
                src
              extended
                api
                checks
                  interpolated_signal_not_invoked
                  invalid_banana_in_box
                  missing_control_flow_directive
                  missing_ngforof_let
                  nullish_coalescing_not_nullable
                  optional_chain_not_nullable
                  skip_hydration_not_static
                  suffix_not_supported
                  text_attribute_not_binding
                src
              src
              template_semantics
                api
                src
            util
              src
            xi18n
              src
          transformers
            jit_transforms
              initializer_api_transforms
      core
        node
          testing
        node_modules
          rxjs
            ajax
            dist
              bundles
              cjs
                ajax
                fetch
                internal
                  ajax
                  observable
                    dom
                  operators
                  scheduled
                  scheduler
                  symbol
                  testing
                  util
                operators
                testing
                webSocket
              esm
                ajax
                fetch
                internal
                  ajax
                  observable
                    dom
                  operators
                  scheduled
                  scheduler
                  symbol
                  testing
                  util
                operators
                testing
                webSocket
              esm5
                ajax
                fetch
                internal
                  ajax
                  observable
                    dom
                  operators
                  scheduled
                  scheduler
                  symbol
                  testing
                  util
                operators
                testing
                webSocket
              types
                ajax
                fetch
                internal
                  ajax
                  observable
                    dom
                  operators
                  scheduled
                  scheduler
                  symbol
                  testing
                  util
                operators
                testing
                webSocket
            fetch
            operators
            src
              ajax
              fetch
              internal
                ajax
                observable
                  dom
                operators
                scheduled
                scheduler
                symbol
                testing
                util
              operators
              testing
              webSocket
            testing
            webSocket
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

Components (Current)

UI

Sidebar
Channel List
Message List
Pinned Bar
Search Bar
Thread Panel
Message Composer
Typing Indicator

Advanced

Virtual scrolling
Infinite loading
Keyboard navigation
Typing indicators
Emoji reactions

Getting Started
Install dependencies:

npm install

Run the app:

npm start

Build for production:

npm run build

Docker
Build and run:

docker build -t slack-ui .
docker run -p 8080:80 slack-ui

Notes
All data is mocked locally through the store and a WebSocket simulator.
This is UI-only by design (no backend).

# Slack-Style-Chat-Interface-UI-Only-

