  # omega-bone

  This is a code bundle for omega-bone. The original project is available at https://www.figma.com/design/I5V9i7drJ3FCziHPcPHmDh/omega-bone.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Making clips from lessons

  Double-click **`MAKE CLIPS.command`**.

  It pulls lessons down from a YouTube link (or uses ones you already have),
  finds the clips worth posting, opens a page where you trim them by clicking
  words and approve the keepers, renders those, and leaves the finished files in
  `clips-ready/`.

  It asks where to keep your lessons the first time and remembers.

  The three tools behind it, if you want to run a step on its own:
  `tools/clip-extractor` picks the clips, `tools/clip-review` is the review page,
  `tools/clip-renderer` renders them. Each has its own README.
