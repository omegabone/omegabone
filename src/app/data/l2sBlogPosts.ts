import type { BlogPost } from "./blogPosts";

const podcastImg = "https://images.unsplash.com/photo-1638734254932-657721b67e38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRyZXByZW5ldXIlMjBzcGVha2luZyUyMHBvZGNhc3QlMjBtaWNyb3Bob25lJTIwc3R1ZGlvfGVufDF8fHx8MTc3MjQ4MTMxN3ww&ixlib=rb-4.1.0&q=80&w=1080";
const coachImg = "https://images.unsplash.com/photo-1637065463674-4595b7f32adc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBjb2FjaCUyMHZpZGVvJTIwcmVjb3JkaW5nJTIwd2ViY2FtJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MjQ4MTMxOHww&ixlib=rb-4.1.0&q=80&w=1080";
const creatorImg = "https://images.unsplash.com/flagged/photo-1575290319880-014c6eba06b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwY3JlYXRvciUyMGZpbG1pbmclMjBzcGVha2luZyUyMGNhbWVyYSUyMGNvbmZpZGVudHxlbnwxfHx8fDE3NzI0ODEzMTh8MA&ixlib=rb-4.1.0&q=80&w=1080";
const stageImg = "https://images.unsplash.com/photo-1542764140-f38e04d3e0c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXlub3RlJTIwc3BlYWtlciUyMHN0YWdlJTIwYXVkaWVuY2UlMjBjb25maWRlbmNlfGVufDF8fHx8MTc3MjQ4MTMxOHww&ixlib=rb-4.1.0&q=80&w=1080";
const presenceImg = "https://images.unsplash.com/photo-1652265540589-46f91535337b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByZXNlbnRhdGlvbiUyMGNvbW11bmljYXRpb24lMjB2b2NhbCUyMHByZXNlbmNlfGVufDF8fHx8MTc3MjQ4MTMxOXww&ixlib=rb-4.1.0&q=80&w=1080";

export const l2sBlogPosts: BlogPost[] = [
  {
    slug: "voice-sabotaging-coaching-business",
    image: coachImg,
    category: "Online Coaching",
    date: "February 20, 2026",
    title: "How Your Voice Is Silently Sabotaging Your Coaching Business",
    excerpt: "You built an incredible framework. You have the results. But if your voice doesn't carry authority, clients don't convert — no matter how good the content is.",
    readTime: "6 min read",
    author: "Omega Bone",
    authorRole: "Vocal Coach & Communication Specialist",
    content: [
      {
        type: "paragraph",
        text: "I work with online coaches who are brilliant at what they do. They have frameworks, case studies, and transformation stories. They've invested in their offer, their funnel, their brand. And yet their discovery calls have a 30% close rate when it should be 70%. The content isn't the problem. The voice is.",
      },
      {
        type: "heading",
        text: "What a Weak Vocal Presence Actually Costs You",
      },
      {
        type: "paragraph",
        text: "When your voice lacks authority — when it's thin, rushed, or monotone — it sends an unconscious signal to potential clients: 'This person isn't certain.' And certainty is what people pay for. They're not just buying your framework. They're buying your conviction that it works. Your voice is the primary vehicle of that conviction.",
      },
      {
        type: "heading",
        text: "The Three Vocal Patterns That Kill Conversions",
      },
      {
        type: "list",
        items: [
          "Upward inflection at the end of statements (sounds like you're asking permission instead of leading)",
          "Rushed pacing (signals anxiety, not authority — listeners subconsciously feel it)",
          "Shallow breath support (leads to a voice that fades at the end of sentences, projecting uncertainty)",
        ],
      },
      {
        type: "heading",
        text: "What Vocal Training Actually Changes",
      },
      {
        type: "paragraph",
        text: "When coaches train their voice, they don't just sound different — they close differently. They handle objections with calm resonance instead of nervous over-explaining. They hold silence on a call without filling it. They deliver the price without their pitch going up. These are learned physical skills, not personality traits.",
      },
      {
        type: "tip",
        text: "Record your next discovery call and listen back purely for vocal patterns — not content. You'll likely hear the exact moments where your voice undermines the words you're saying.",
      },
      {
        type: "quote",
        text: "\"Your voice is the first thing a client decides to trust. Train it like the business asset it is.\"",
      },
    ],
  },
  {
    slug: "podcast-voice-listener-retention",
    image: podcastImg,
    category: "Content Creation",
    date: "February 5, 2026",
    title: "Your Podcast Voice Is Killing Your Listener Retention (Here's the Fix)",
    excerpt: "A great mic doesn't fix a flat delivery. If listeners are dropping off in the first 5 minutes, the problem isn't your content — it's vocal presence.",
    readTime: "7 min read",
    author: "Omega Bone",
    authorRole: "Vocal Coach & Communication Specialist",
    content: [
      {
        type: "paragraph",
        text: "Podcast analytics don't lie. If your average listen-through rate is below 60%, your content probably isn't the issue. Listeners decide whether to stay based on your voice in the first 90 seconds — and most podcasters never receive any coaching on how to make those 90 seconds hold attention.",
      },
      {
        type: "heading",
        text: "What Listeners Are Actually Responding To",
      },
      {
        type: "paragraph",
        text: "Retention isn't about having a deep radio voice. It's about variation, intention, and breath. A voice that moves — that speeds up with excitement, slows down for weight, pauses before the important line — signals to a listener's brain that there's a human behind the microphone who actually means what they're saying. Flat, even delivery reads as boredom, even when the content is exceptional.",
      },
      {
        type: "heading",
        text: "The 4 Vocal Variables That Drive Engagement",
      },
      {
        type: "list",
        items: [
          "Pace: Vary it intentionally. Slow down before key insights. Speed up to convey urgency.",
          "Volume: Drops in volume create intimacy and pull listeners in. Don't perform at the same level throughout.",
          "Pitch range: A narrow pitch range sounds monotone. Expand your range with vocal exercises.",
          "Pause: The 2-second pause before your most important point is more powerful than any emphasis word.",
        ],
      },
      {
        type: "heading",
        text: "Why Vocal Training Beats Editing",
      },
      {
        type: "paragraph",
        text: "Many creators try to fix this in post-production — adding music, cutting dead air, boosting EQ. These help. But they don't solve the underlying issue, which is that the voice itself lacks the range to hold attention naturally. Vocal training changes the source, not the edit. When your delivery is compelling, editing becomes easier and your audience grows faster.",
      },
      {
        type: "quote",
        text: "\"The best microphone in the world can't make a flat voice interesting. That's what training is for.\"",
      },
    ],
  },
  {
    slug: "entrepreneur-stage-presence",
    image: stageImg,
    category: "Entrepreneurs",
    date: "January 22, 2026",
    title: "Why Entrepreneurs Who Train Their Voice Close More Deals",
    excerpt: "The most important business skill nobody talks about: vocal presence. It's the invisible force behind every pitch, keynote, and sales conversation that works.",
    readTime: "5 min read",
    author: "Omega Bone",
    authorRole: "Vocal Coach & Communication Specialist",
    content: [
      {
        type: "paragraph",
        text: "I've sat in on hundreds of pitches over the years — investor decks, sales calls, keynotes, boardroom presentations. The differentiator between who gets the yes and who doesn't is rarely the idea. It's almost always the person delivering it, and specifically, the voice they deliver it with.",
      },
      {
        type: "heading",
        text: "What 'Commanding Presence' Actually Is",
      },
      {
        type: "paragraph",
        text: "People talk about stage presence as if it's a personality trait — something you either have or you don't. It isn't. It's a set of physical and vocal skills: how you breathe before you speak, how your voice resonates in your chest instead of your throat, how you vary your pace to signal confidence and control. Every single one of these can be trained.",
      },
      {
        type: "heading",
        text: "The Vocal Signals Investors and Clients Read Instantly",
      },
      {
        type: "list",
        items: [
          "Breath before speaking: A full breath before your opening line signals calm authority.",
          "Chest resonance: A voice that resonates low in the body sounds grounded, not anxious.",
          "Deliberate pacing: Slowing down — especially when you're nervous — signals certainty.",
          "Vocal stability on price: The moment you name your fee without your voice changing is the moment you own the sale.",
        ],
      },
      {
        type: "tip",
        text: "Before your next important pitch or sales call, do 5 minutes of vocal warm-up and diaphragmatic breathing. The physiological shift is measurable — and your voice will reflect it.",
      },
      {
        type: "quote",
        text: "\"Nobody buys from someone who sounds unsure. Train your voice and your close rate follows.\"",
      },
    ],
  },
  {
    slug: "vocal-presence-for-content-creators",
    image: creatorImg,
    category: "Content Creation",
    date: "January 8, 2026",
    title: "The One Skill Content Creators Overlook That Doubles Their Impact",
    excerpt: "You've optimised your thumbnails, your hooks, your titles. But the creators who build real audiences all have one thing in common: a voice people want to keep listening to.",
    readTime: "6 min read",
    author: "Omega Bone",
    authorRole: "Vocal Coach & Communication Specialist",
    content: [
      {
        type: "paragraph",
        text: "I've worked with YouTubers, course creators, and Instagram educators who've invested thousands in production quality — cameras, lighting, editing software. Their content is polished. But their audience growth plateaued because the thing that drives subscription and loyalty isn't production value. It's vocal connection.",
      },
      {
        type: "heading",
        text: "Why Some Creators Build Fandoms and Others Build Audiences",
      },
      {
        type: "paragraph",
        text: "A following watches your videos. A fandom plans their week around them. The difference is intimacy — and intimacy is built through the voice. Specifically, through a voice that sounds present, warm, and fully committed to the person listening. That quality isn't accidental and it isn't just 'personality'. It's a physical skill that can be developed.",
      },
      {
        type: "heading",
        text: "What Vocal Training Does for Your Content",
      },
      {
        type: "list",
        items: [
          "Increases watch time: A voice with range holds attention longer than a consistent, flat delivery.",
          "Builds trust faster: Warmth and breath in a voice signal safety — listeners relax and open up.",
          "Makes repurposing easier: When your audio is compelling, clips perform better across every platform.",
          "Reduces re-takes: Confident vocal delivery means fewer technical mistakes and less editing time.",
        ],
      },
      {
        type: "heading",
        text: "The Exercise That Changes Everything in 3 Weeks",
      },
      {
        type: "paragraph",
        text: "Read one page of text aloud every day — not your content, not your scripts. A novel, a poem, anything. Read it with full intention, as if someone you deeply respect is listening. Then record one video. Over three weeks, most creators notice a measurable shift in how their delivery feels — and their analytics start to reflect it.",
      },
      {
        type: "quote",
        text: "\"Your audience can't see your credentials in the first 10 seconds. They can only hear your voice. Make it worth staying for.\"",
      },
    ],
  },
  {
    slug: "communication-and-leadership",
    image: presenceImg,
    category: "Leadership",
    date: "December 18, 2025",
    title: "Leaders Who Train Their Voice Don't Just Communicate Better — They Lead Differently",
    excerpt: "Vocal presence is a leadership skill. The coaches, founders, and executives who master it don't just sound more authoritative — they create different outcomes.",
    readTime: "8 min read",
    author: "Omega Bone",
    authorRole: "Vocal Coach & Communication Specialist",
    content: [
      {
        type: "paragraph",
        text: "I've worked with leadership coaches who teach communication for a living — and who are communicating at maybe 60% of their potential. Not because they lack intelligence, insight, or experience. Because they've never been taught that the voice itself is a separate instrument that requires its own training.",
      },
      {
        type: "heading",
        text: "The Difference Between Information and Influence",
      },
      {
        type: "paragraph",
        text: "Most professional communication training focuses on what to say: structuring arguments, choosing words, managing objections. Almost none of it focuses on how the voice carries those words — and that's where the gap between informing and influencing lives. The same sentence can inspire action or be completely ignored, depending entirely on the vocal qualities behind it.",
      },
      {
        type: "heading",
        text: "What Changes When Leaders Train Their Voice",
      },
      {
        type: "list",
        items: [
          "Teams listen differently: a grounded, authoritative voice gets heard with less resistance",
          "Meetings run cleaner: vocal clarity reduces misunderstanding and the need for follow-up",
          "One-on-ones go deeper: warmth and breath in a voice create psychological safety faster",
          "Audiences remember more: emotional vocal delivery increases message retention by up to 40%",
        ],
      },
      {
        type: "heading",
        text: "Why Singing Is the Shortcut",
      },
      {
        type: "paragraph",
        text: "Singing isn't about performance. It's about expanding the full range of what your voice can do — its pitch range, its breath support, its resonance, its emotional expressiveness. When you train a voice through singing, you're essentially unlocking all the latent capacity that most people use only a fraction of when they speak. Leaders who commit to this process for 90 days consistently describe a shift that goes beyond sounding better: they feel more like themselves when they speak.",
      },
      {
        type: "quote",
        text: "\"Your voice is the most underutilised leadership asset you have. Every room you walk into is waiting to hear the full version of it.\"",
      },
    ],
  },
];
