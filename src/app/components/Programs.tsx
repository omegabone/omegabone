import { ArrowRight, Star, Mic, Music, Video, Users } from "lucide-react";

const programs = [
  {
    icon: <Mic size={28} />,
    tag: "Most Popular",
    tagColor: "bg-[#1a56db] text-white",
    title: "Voice Mastery Bootcamp",
    subtitle: "8-Week Intensive",
    price: "$297",
    originalPrice: "$497",
    description:
      "The most comprehensive vocal training program I've ever created. From breath control to stage presence — this changes everything.",
    features: [
      "40+ video lessons (HD)",
      "Weekly live coaching calls",
      "Personalized feedback on recordings",
      "Lifetime access + updates",
      "Private community access",
    ],
    cta: "Enroll Now",
    highlight: true,
  },
  {
    icon: <Music size={28} />,
    tag: "Beginner Friendly",
    tagColor: "bg-[#e8f0fe] text-[#1a56db]",
    title: "Foundations of Singing",
    subtitle: "Self-Paced Course",
    price: "$97",
    originalPrice: "$197",
    description:
      "Built for absolute beginners. Learn proper technique, pitch accuracy, and breath support in a fun, judgment-free environment.",
    features: [
      "25+ step-by-step lessons",
      "Daily vocal warm-up routines",
      "Pitch training exercises",
      "3 months email support",
      "Progress tracking dashboard",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    icon: <Video size={28} />,
    tag: "1-on-1 Coaching",
    tagColor: "bg-black text-white",
    title: "Elite Private Sessions",
    subtitle: "Personalized Coaching",
    price: "$250",
    originalPrice: null,
    description:
      "One-on-one 60-minute sessions tailored entirely to your voice, your goals, and your timeline. Limited spots available.",
    features: [
      "60-min video session",
      "Custom training plan",
      "Recording & playback analysis",
      "Session notes & action plan",
      "Follow-up support (48hr)",
    ],
    cta: "Book a Session",
    highlight: false,
  },
  {
    icon: <Users size={28} />,
    tag: "Group Experience",
    tagColor: "bg-[#e8f0fe] text-[#1a56db]",
    title: "Live Group Workshops",
    subtitle: "Monthly Live Events",
    price: "$49",
    originalPrice: "$79",
    description:
      "Interactive group workshops where you'll perform, get live feedback, and connect with a global community of singers.",
    features: [
      "Live 2-hour workshop",
      "Small groups (max 20)",
      "Real-time feedback",
      "Replay recording included",
      "Monthly themes & challenges",
    ],
    cta: "Reserve Spot",
    highlight: false,
  },
];

export function Programs() {
  return (
    null
  );
}
