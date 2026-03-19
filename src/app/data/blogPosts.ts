export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'quote' | 'tip';
  text?: string;
  items?: string[];
}

export interface BlogPost {
  slug: string;
  image: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  readTime: string;
  author: string;
  authorRole: string;
  content: ContentBlock[];
}

const studioImg = "https://images.unsplash.com/photo-1561446289-4112a4f79116?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nZXIlMjBtaWNyb3Bob25lJTIwc3R1ZGlvJTIwcmVjb3JkaW5nfGVufDF8fHx8MTc3MTczNTI4NXww&ixlib=rb-4.1.0&q=80&w=1080";
const workshopImg = "https://images.unsplash.com/photo-1671129930758-5c978e578123?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHZvaWNlJTIwdHJhaW5pbmclMjB3b3Jrc2hvcCUyMGdyb3VwfGVufDF8fHx8MTc3MTczNTI4NXww&ixlib=rb-4.1.0&q=80&w=1080";
const performImg = "https://images.unsplash.com/photo-1645287024724-76945b77f462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNpbmdpbmclMjBwZXJmb3JtYW5jZSUyMHN0YWdlJTIwc3BvdGxpZ2h0fGVufDF8fHx8MTc3MTczNTI4Nnww&ixlib=rb-4.1.0&q=80&w=1080";
const signatureImg = "https://images.unsplash.com/photo-1650513737281-882e597ee5e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nZXIlMjB1bmlxdWUlMjB2b2ljZSUyMHN0dWRpbyUyMG1pY3JvcGhvbmUlMjBjbG9zZXxlbnwxfHx8fDE3NzI0NjI1MjB8MA&ixlib=rb-4.1.0&q=80&w=1080";
const highNotesImg = "https://images.unsplash.com/photo-1544704512-12bc4c1628ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2NhbGlzdCUyMGhpZ2glMjBub3RlcyUyMG9wZXJhJTIwcG93ZXJmdWwlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzI0NjI1MjB8MA&ixlib=rb-4.1.0&q=80&w=1080";

export const blogPosts: BlogPost[] = [
  {
    slug: "5-vocal-mistakes",
    image: studioImg,
    category: "Technique",
    date: "February 12, 2026",
    title: "The 5 Most Common Vocal Mistakes (And How to Fix Them Fast)",
    excerpt: "Most singers struggle with the same handful of issues. Here's what I see most often — and the exact exercises I use to fix them in sessions.",
    readTime: "6 min read",
    author: "Omega Bone",
    authorRole: "Vocal Coach & Music Educator",
    content: [
      {
        type: "paragraph",
        text: "After 30+ years coaching thousands of singers — from preschool through professional level — I've noticed that most vocal struggles trace back to the same five mistakes. The good news? Every single one is fixable, and usually faster than you'd expect.",
      },
      {
        type: "heading",
        text: "1. Singing From Your Throat Instead of Your Diaphragm",
      },
      {
        type: "paragraph",
        text: "This is the number-one mistake I see, and it causes everything from chronic vocal fatigue to pitch instability to a thin, breathy tone. When you push sound from your throat, you're asking a small group of muscles to do a job they were never designed for. Your diaphragm is your engine. Learning to engage it properly transforms everything — tone, power, stamina, and range.",
      },
      {
        type: "tip",
        text: "Place one hand on your belly button. Inhale deeply. If your shoulders rise first, you're chest-breathing. The goal is to feel your belly expand outward. Practice this breathing pattern for 5 minutes daily for two weeks, and your tone will begin to transform on its own.",
      },
      {
        type: "heading",
        text: "2. Tension in the Jaw and Neck",
      },
      {
        type: "paragraph",
        text: "Tension is the enemy of vocal freedom. Most singers carry enormous amounts of physical tension in their jaw, neck, and shoulders — often without realising it. This tension creates a bottleneck that prevents your voice from flowing naturally. The jaw should be relaxed and open when you sing, and the neck long and free.",
      },
      {
        type: "heading",
        text: "3. Inconsistent Breath Support",
      },
      {
        type: "paragraph",
        text: "Breath is the fuel of the voice. Without consistent, controlled support, your voice will tire quickly, pitch will be unreliable, and tone will be thin. Many singers breathe deeply at the start of a phrase, then let their air stream out too quickly — leaving them straining on the final notes. The fix is learning to manage breath flow as an active, conscious skill.",
      },
      {
        type: "heading",
        text: "4. Avoiding the Passaggio",
      },
      {
        type: "paragraph",
        text: "The passaggio — your vocal break — is the transition zone between chest voice and head voice. Most untrained singers either barrel through it with force (creating a harsh flip) or avoid high notes entirely. Smoothing this transition is one of the most transformative technical skills you can develop, and it unlocks an entirely new range of expression.",
      },
      {
        type: "heading",
        text: "5. Inconsistent Daily Practice",
      },
      {
        type: "paragraph",
        text: "You wouldn't expect to get physically fit by training once a week. Your voice works the same way. Consistent daily vocal exercise — even just 15–20 minutes — builds the muscle memory, flexibility, and strength that occasional practice can never achieve. Consistency is the quiet secret that separates singers who plateau from those who continuously grow.",
      },
      {
        type: "quote",
        text: "\"The voice is an instrument. Like any instrument, it requires daily attention — not because you have to, but because you want to grow.\"",
      },
    ],
  },
  {
    slug: "vocal-warmups",
    image: workshopImg,
    category: "Training",
    date: "January 28, 2026",
    title: "Why Vocal Warm-Ups Are More Important Than You Think",
    excerpt: "Skipping your warm-up doesn't just risk injury — it's actively limiting your performance ceiling. Here's the science, and my daily routine.",
    readTime: "4 min read",
    author: "Omega Bone",
    authorRole: "Vocal Coach & Music Educator",
    content: [
      {
        type: "paragraph",
        text: "I've had students who've been singing for years and never done a proper warm-up. They wonder why their voice feels tight in the mornings, why they crack on notes they could hit by afternoon, and why they feel vocally exhausted after every performance. The answer is almost always the same: they've been asking cold muscles to do a warm-muscles job.",
      },
      {
        type: "heading",
        text: "What Actually Happens When You Skip Your Warm-Up",
      },
      {
        type: "paragraph",
        text: "Your vocal folds are mucous-membrane-covered muscles. When they're cold, they're less pliable, less coordinated, and more vulnerable to strain and micro-tears. Pushing a cold voice into full performance mode is the equivalent of sprinting flat-out without stretching. You may get away with it for a while. But eventually, the cost arrives.",
      },
      {
        type: "heading",
        text: "The Purpose of a Warm-Up Is More Than Physical",
      },
      {
        type: "paragraph",
        text: "Beyond physical readiness, a proper warm-up primes muscle memory, engages your breath support system, and — crucially — gets your mind into a focused, performative state. The ritual of warming up signals to your nervous system that it's time to sing.",
      },
      {
        type: "heading",
        text: "My Daily 15-Minute Warm-Up Routine",
      },
      {
        type: "list",
        items: [
          "2 min: Humming softly on a comfortable pitch — just waking up the resonators",
          "3 min: Lip trills up and down a five-note scale — engaging breath without strain",
          "3 min: Sirens — sliding smoothly from your lowest to highest comfortable note and back",
          "3 min: Scales on 'mah' or 'may' — introducing vowel definition and articulation",
          "2 min: Arpeggios on 'gee' — gently stretching into the upper register",
          "2 min: Your first phrase from whatever you're working on",
        ],
      },
      {
        type: "heading",
        text: "What a Warm-Up Is NOT",
      },
      {
        type: "paragraph",
        text: "A warm-up is not your full practice session. It's not the time to push for high notes, belt, or work through difficult passages. It's preparation. The distinction matters because many singers think they're warming up when they're actually training — two very different demands on the voice.",
      },
      {
        type: "quote",
        text: "\"Treat your warm-up like a conversation with your voice: gentle, respectful, and curious. Ask it what it needs today — don't just demand what you want from it.\"",
      },
    ],
  },
  {
    slug: "stage-confidence",
    image: performImg,
    category: "Stage Confidence",
    date: "January 15, 2026",
    title: "How to Stop Shaking and Start Commanding the Stage",
    excerpt: "Performance anxiety is real. But there are proven, repeatable techniques that will transform your presence from nervous to magnetic.",
    readTime: "8 min read",
    author: "Omega Bone",
    authorRole: "Vocal Coach & Music Educator",
    content: [
      {
        type: "paragraph",
        text: "Every performer I've ever met — including world-class professionals — knows the feeling: heart pounding, hands trembling, voice threatening to disappear at exactly the wrong moment. Performance anxiety is universal. What separates performers who command a stage from those who merely survive it isn't the absence of nerves. It's what they've learned to do with them.",
      },
      {
        type: "heading",
        text: "Understand What's Actually Happening",
      },
      {
        type: "paragraph",
        text: "Performance anxiety is your nervous system responding to a perceived threat. The body cannot differentiate between 'lion approaching' and 'audience judging.' The response is identical: cortisol, adrenaline, heightened heart rate, shallow breathing. Knowing this is important — it means the response is automatic, not personal, and it can be redirected.",
      },
      {
        type: "heading",
        text: "The Breath Is Your Reset Button",
      },
      {
        type: "paragraph",
        text: "The fastest, most reliable way to interrupt the anxiety response is extended-exhale breathing. Inhale for 4 counts, hold for 4, exhale for 6–8 counts. Do this 3–5 times. The extended exhale activates the parasympathetic nervous system — your body's built-in calming mechanism. Learn it now, before you need it.",
      },
      {
        type: "heading",
        text: "Reframe Nervous Energy as Performance Fuel",
      },
      {
        type: "paragraph",
        text: "The physiological experience of excitement and nervousness are virtually identical. The only difference is the story you're telling yourself about the sensation. 'I'm terrified' versus 'I'm alive and ready.' Elite athletes call this controlled activation — deliberately reframing arousal as readiness. It takes practice, but it's a skill, not a personality trait.",
      },
      {
        type: "heading",
        text: "Preparation Is the Foundation of Confidence",
      },
      {
        type: "paragraph",
        text: "Most stage fright comes from not being prepared enough. When you know your material deeply — not just the notes and words, but the emotion, the intention, the arc from beginning to end — anxiety has far less power. You're not thinking 'what comes next?' You're already there, inside the song.",
      },
      {
        type: "tip",
        text: "Practice your performance, not just your songs. Sing standing up. Sing in front of a mirror. Record yourself on video and watch it back. Simulate the conditions of performance — including the vulnerability — so they become familiar rather than threatening.",
      },
      {
        type: "heading",
        text: "Build Exposure Gradually",
      },
      {
        type: "paragraph",
        text: "Confidence is built through repeated successful exposure. Start small: sing in front of one trusted person. Then three. Then a small group. Then a larger one. Each successful exposure recalibrates your nervous system's threat response. The stage gets smaller. The audience gets friendlier. Your voice gets freer.",
      },
      {
        type: "quote",
        text: "\"Nerves don't mean you're not ready. They mean you care enough to want to do it well. That's not a weakness. That's the whole point.\"",
      },
    ],
  },
  {
    slug: "signature-sound",
    image: signatureImg,
    category: "Identity",
    date: "January 5, 2026",
    title: "How to Find Your Signature Sound",
    excerpt: "Every voice is already unique. The work isn't to create a signature sound from scratch — it's to uncover and develop the one you already have.",
    readTime: "5 min read",
    author: "Omega Bone",
    authorRole: "Vocal Coach & Music Educator",
    content: [
      {
        type: "paragraph",
        text: "One of the most common things I hear from students when they first come to me: 'I don't think I have a special voice.' They listen to their favourite artists, compare themselves, and always come up short. But here's the truth: every voice is already unique. The work isn't to create a signature sound from scratch. It's to uncover the one you already have.",
      },
      {
        type: "heading",
        text: "Stop Comparing, Start Exploring",
      },
      {
        type: "paragraph",
        text: "Every great vocalist developed their signature sound through exploration — not imitation. When you spend energy copying someone else's voice, you're training their habits, not yours. Your voice has a particular timbre, a natural resonance, a distinctive colour that no one else on earth possesses. The question is whether you've done the work to know it yet.",
      },
      {
        type: "heading",
        text: "Your Speaking Voice Is Your Starting Point",
      },
      {
        type: "paragraph",
        text: "Most singers underestimate how much information their speaking voice contains. Your natural speaking resonance — where it sits in your body, how bright or dark it naturally falls — is the foundation of your singing voice. I often ask new students to read a passage aloud, close their eyes, and notice where they feel vibration. That feeling is where your signature lives.",
      },
      {
        type: "heading",
        text: "Study Artists You Love — Then Step Away",
      },
      {
        type: "list",
        items: [
          "Identify what specifically draws you to a singer — is it tone, rhythm, vulnerability, power?",
          "Learn to technically replicate those qualities as an exercise",
          "Then put that artist away for a month and sing only from your own instincts",
          "What remains after that process is genuinely yours",
        ],
      },
      {
        type: "heading",
        text: "Work From Your Comfortable Middle",
      },
      {
        type: "paragraph",
        text: "Many singers damage their natural sound by constantly pushing at the edges of their range. The richest, most expressive part of your voice — the part that is most distinctly you — lives in the comfortable middle. Spend time there. Explore it deeply. The extremes will develop naturally as your technique grows.",
      },
      {
        type: "quote",
        text: "\"Your signature sound isn't something you build. It's something you excavate.\"",
      },
    ],
  },
  {
    slug: "high-notes",
    image: highNotesImg,
    category: "Technique",
    date: "December 20, 2025",
    title: "The Truth About Singing High Notes Without Straining",
    excerpt: "Nothing causes more vocal damage than forcing high notes before you're technically ready. Here's what I tell every student who comes to me struggling with their upper register.",
    readTime: "7 min read",
    author: "Omega Bone",
    authorRole: "Vocal Coach & Music Educator",
    content: [
      {
        type: "paragraph",
        text: "Nothing causes more vocal damage — or more frustration — than trying to force high notes before you're technically ready. I've worked with students who'd been belting through the upper register for years, wondering why their voice always felt tired, why those notes were never quite clean, and why they seemed to be losing range over time. The answer is almost always the same.",
      },
      {
        type: "heading",
        text: "High Notes Are Not About Force",
      },
      {
        type: "paragraph",
        text: "The biggest myth in singing is that high notes require more effort, more push, more power. In reality, the highest, most spectacular notes are achieved through release — not force. As pitch rises, the vocal folds lengthen and thin. The air pressure must be consistent, not increased. The resonance shifts from chest to head. Force is the enemy of high notes.",
      },
      {
        type: "heading",
        text: "Navigating the Passaggio",
      },
      {
        type: "paragraph",
        text: "The passaggio is the gateway to your upper register. Singers who try to chest-voice through it produce a strained, tight, often flat tone. Learning to navigate it smoothly — allowing the voice to 'turn over' naturally into mixed or head voice — is the technical foundation of singing high notes cleanly. This isn't a shortcut. It's the only real path.",
      },
      {
        type: "heading",
        text: "The 'Hoo' Drill",
      },
      {
        type: "paragraph",
        text: "One of my favourite exercises: sing 'hoo hoo hoo' on an ascending scale, starting well below your break. The 'hoo' naturally encourages head resonance and the release of tension. Don't try to make it sound powerful. Make it sound free. The power comes later, once the pathway is clear and the coordination is established.",
      },
      {
        type: "tip",
        text: "Practice high notes in a very light, nearly falsetto quality first — not in performance mode. You're teaching your voice a new physical coordination. Let it be gentle until it becomes familiar, then gradually add support and presence.",
      },
      {
        type: "heading",
        text: "The Mindset Shift",
      },
      {
        type: "paragraph",
        text: "Most singers approach high notes with dread and force. The ones who sing them beautifully approach them with curiosity and release. 'How free can I make this note?' is a far more useful question than 'How powerful can I make this note?' Reframe your mental approach, and your physical approach will follow.",
      },
      {
        type: "quote",
        text: "\"High notes don't need more push. They need more space. The moment you stop trying to force them up, they lift themselves.\"",
      },
    ],
  },
];
