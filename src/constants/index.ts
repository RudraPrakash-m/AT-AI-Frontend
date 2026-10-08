export const STORAGE_KEYS = {
  AUTH_TOKEN: 'at_ai_auth_token',
  USER_DATA: 'at_ai_user_data',
  THEME_MODE: 'at_ai_theme_mode',
  CONVERSATIONS: 'at_ai_conversations_cache',
  MESSAGES: 'at_ai_messages_cache',
  SETTINGS: 'at_ai_user_settings',
  ACTIVE_MODEL: 'at_ai_active_model',
} as const;

export const AVAILABLE_MODELS = [
  {
    id: 'llama3.2',
    name: 'Llama 3.2 (3B Local)',
    provider: 'Local Ollama',
    description: 'Ultra-fast Meta Llama 3.2 lightweight model running locally on your hardware',
    badge: 'Installed',
    isPro: false,
    contextWindow: '128k',
  },
  {
    id: 'qwen3:4b',
    name: 'Qwen 3 (4B Local)',
    provider: 'Local Ollama',
    description: 'High-performance Alibaba Qwen 3 model specialized for coding, reasoning, and math',
    badge: 'Installed',
    isPro: false,
    contextWindow: '128k',
  },
  {
    id: 'llama3.2-vision',
    name: 'Llama 3.2 Vision (Ollama)',
    provider: 'Ollama Vision',
    description: 'Multimodal vision model for analyzing images, diagrams, and screenshots',
    badge: 'Vision',
    isPro: false,
    contextWindow: '128k',
  },
] as const;

export const SUGGESTED_PROMPT_CATEGORIES = [
  {
    id: 'coding',
    title: 'Code & Architecture',
    icon: 'code',
    prompts: [
      {
        title: 'Explain React Server Components',
        description: 'How RSC differs from SSR and client-side rendering with diagrams',
        prompt: 'Explain React Server Components (RSC). Detail the core differences between Client Components, SSR, and Server Components with architectural diagrams in markdown.',
      },
      {
        title: 'Design a Distributed Rate Limiter',
        description: 'Redis token-bucket algorithm with concurrency handling',
        prompt: 'Design a distributed rate limiter using Redis and the Token Bucket algorithm. Provide TypeScript implementation with edge-case handling for clock drifts.',
      },
      {
        title: 'Debug React 19 Hydration Mismatch',
        description: 'Step-by-step resolution of SSR timestamp mismatches',
        prompt: 'How do I detect, debug, and eliminate hydration mismatch errors in Next.js / React 19 applications when dealing with browser-specific timestamps?',
      },
    ],
  },
  {
    id: 'writing',
    title: 'Analysis & Strategy',
    icon: 'edit',
    prompts: [
      {
        title: 'Draft Product Requirements Document (PRD)',
        description: 'Structured PRD for an AI chat workspace with metrics',
        prompt: 'Draft an exhaustive Product Requirements Document (PRD) for a real-time collaborative AI workspace, including North Star metrics, user stories, and API contracts.',
      },
      {
        title: 'Review System Security Posture',
        description: 'OWASP Top 10 API Security Checklist',
        prompt: 'Generate an actionable security checklist for an enterprise SaaS API adhering to OWASP API Security Top 10 standards.',
      },
    ],
  },
  {
    id: 'productivity',
    title: 'Research & Brainstorming',
    icon: 'sparkles',
    prompts: [
      {
        title: 'Explain Quantum Computing Basics',
        description: 'Superposition and Entanglement without overly dense jargon',
        prompt: 'Explain Quantum Computing fundamentals — specifically Superposition, Qubits, and Entanglement — using intuitive physical analogies.',
      },
      {
        title: 'Formulate a 30-Day Engineering Onboarding Plan',
        description: 'Structured ramp-up for senior staff engineers',
        prompt: 'Create a high-impact 30-60-90 day onboarding framework for a newly hired Staff Software Engineer entering a high-growth tech organization.',
      },
    ],
  },
];
