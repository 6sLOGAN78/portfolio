export const profile = {
  name: 'Ayush Maurya',
  handle: '6sLOGAN78',
  email: 'mauryaayush8114@gmail.com',
  github: 'https://github.com/6sLOGAN78',
  linkedin: 'https://www.linkedin.com/in/ayush-maurya-5a8308339',
  substack: 'https://thelearningcurvenjack.substack.com',
};

export interface Project {
  name: string;
  kind: string;
  year: string;
  blurb: string;
  points: string[];
  metric: string;
  stack: string[];
  repo: string;
  live?: string;
}

const gh = (r: string) => `https://github.com/6sLOGAN78/${r}`;

export const projects: Project[] = [
  {
    name: 'sipSup',
    kind: 'Agent loop & execution harness',
    year: '2026',
    blurb:
      'A personal AI assistant that behaves the same wherever you reach it: terminal, web, voice, Telegram or Discord.',
    points: [
      'Three persistent memory layers (semantic, episodic, procedural) over SQLite session state, so long tasks keep their context.',
      'Streaming, tool-call traces, token accounting and deterministic stop conditions make failures visible.',
      'Judge-based evaluation catches incomplete answers before the user does.',
    ],
    metric: '5 channels · 3 memory layers',
    stack: ['Python', 'Go', 'TypeScript', 'SQLite', 'Tool calling'],
    repo: gh('sipSup'),
  },
  {
    name: 'Flux',
    kind: 'Real-time link attribution platform',
    year: '2026',
    blurb:
      'Link shortening and campaign attribution split into two planes, so analytics can never block the click path.',
    points: [
      'A durable control plane for campaigns and a latency-sensitive redirect plane for users.',
      'First-click and last-click attribution over Kafka events, with ClickHouse for time-series analytics.',
      'Idempotent APIs, RBAC, expiring links, QR codes and zero-downtime migrations.',
    ],
    metric: 'Sub-20 ms cache-hit redirects',
    stack: ['Go', 'Kafka', 'ClickHouse', 'Redis', 'PostgreSQL', 'React'],
    repo: gh('Flux'),
  },
  {
    name: 'devRAG',
    kind: 'Multi-tenant RAG platform',
    year: '2026',
    blurb:
      'Private repositories and documents made searchable, with answers that cite their sources and never cross tenants.',
    points: [
      'A Go gateway takes the concurrent traffic while a Python engine does parsing, embedding and reranking.',
      'Sparse BM25 and dense vector retrieval, fused and reranked by a cross-encoder.',
      'Layout-aware ingestion with PyMuPDF, PaddleOCR and YOLOv8.',
    ],
    metric: 'Hybrid retrieval · tenant isolation',
    stack: ['Go', 'Python', 'FastAPI', 'React', 'PostgreSQL', 'Vector search'],
    repo: gh('devRAG'),
  },
  {
    name: 'Aegis',
    kind: 'Zero-trust access gateway',
    year: '2026',
    blurb:
      'Every request is authenticated, checked against a signed policy snapshot and audited before it reaches a backend.',
    points: [
      'A Go reverse proxy with an embedded OPA/Rego policy engine.',
      'A control plane streams signed configuration over mutually authenticated gRPC.',
      'Redis-backed revocation and quarantine, plus a write-ahead audit spool.',
    ],
    metric: 'Revocation in under 5 s',
    stack: ['Go', 'OPA/Rego', 'gRPC', 'mTLS', 'Redis', 'Kubernetes'],
    repo: gh('Aegis'),
  },
  {
    name: 'Sentinel',
    kind: 'Distributed security-event platform',
    year: '2026',
    blurb:
      'Authenticated event ingestion, durable delivery and deterministic detection rules for security investigation.',
    points: [
      'Scoped event batches flow through Kafka into ClickHouse with at-least-once delivery.',
      'Four deterministic event-time rules produce detections and workflow rows.',
      'Tenant-scoped lookups keep one team’s events out of another’s view.',
    ],
    metric: 'At-least-once · deduplicated',
    stack: ['Go', 'Kafka', 'ClickHouse', 'PostgreSQL', 'Docker'],
    repo: gh('Sentinel'),
  },
  {
    name: 'Feather',
    kind: 'AI mobile image editor',
    year: '2025',
    blurb:
      'Prompt-guided photo editing and style transfer on a phone. Built for the Adobe problem statement at Inter IIT Tech Meet 14.0.',
    points: [
      'An infinite canvas on expo-gl with live zoom, pan and filters.',
      'Cloud SDXL for heavy edits and an on-device Llama 3.2 path for offline suggestions.',
      'Gemini-powered ghost-text autocomplete for prompts.',
    ],
    metric: '8th place · Inter IIT Tech Meet 14.0',
    stack: ['React Native', 'Expo', 'FastAPI', 'SDXL', 'Gemini', 'ExecuTorch'],
    repo: gh('feather'),
  },
  {
    name: 'ICU Sentinel',
    kind: 'Edge-AI telemetry & triage',
    year: '2026',
    blurb:
      'Predicts hypoxia and tachycardia minutes before threshold alarms, from vitals streamed off Silicon Labs EFR32 boards.',
    points: [
      '1D temporal CNNs slide across 600-second vital waveforms.',
      'A 71-dimensional stacking meta-network weighs telemetry against 65 pre-operative features.',
      'Team Trinetra, Silicon Labs IoT Challenge 2026.',
    ],
    metric: 'Global Top 20 · Silicon Labs',
    stack: ['C', 'EFR32', 'ESP32', 'PyTorch', 'TCN'],
    repo: gh('SiLabs'),
  },
  {
    name: 'Nexus Loop',
    kind: 'Quality control for deployed agents',
    year: '2026',
    blurb:
      'Finds knowledge gaps, broken tool contracts and prompt regressions in agent logs, and tells real regressions from noise.',
    points: [
      'Fixed windows, peer controls and Welch t-tests separate regressions from traffic-mix drift.',
      'Golden baselines are frozen before any fix, then replayed deterministically.',
      'Refuses to report a metric the telemetry cannot support.',
    ],
    metric: 'Deterministic replay harness',
    stack: ['Python', 'Statistics', 'Replay', 'Evaluation'],
    repo: gh('nexus-loop'),
  },
  {
    name: 'RedrobRanker',
    kind: 'Candidate ranking engine',
    year: '2026',
    blurb:
      'An eleven-stage ranking pipeline that orders a hundred thousand profiles against a job description, on CPU, with reasons.',
    points: [
      'Weighted BM25 and FAISS retrieval feed a neural cross-encoder.',
      'Behavioural signals adjust scores in real time.',
      'A local Qwen2.5 model writes a grounded rationale for each ranking.',
    ],
    metric: '100K profiles in under 5 min, no GPU',
    stack: ['Python', 'FAISS', 'BM25', 'Cross-encoder', 'Qwen2.5'],
    repo: gh('RedrobRanker'),
  },
  {
    name: 'show-its-work',
    kind: 'KPI diagnosis engine',
    year: '2026',
    blurb:
      'Diagnoses revenue drops and proposes actions. Every number comes from deterministic code; the LLM only explains.',
    points: [
      'Deterministic computation with a language layer on top.',
      'Each conclusion is traceable to the query that produced it.',
    ],
    metric: 'The LLM never computes a number',
    stack: ['Python', 'Analytics', 'LLM'],
    repo: gh('show-its-work'),
    live: 'https://show-its-work.vercel.app',
  },
  {
    name: 'NetSure',
    kind: 'Network intrusion detection',
    year: '2026',
    blurb:
      'A reproducible ML pipeline that classifies anomalous network traffic on CICIDS2017.',
    points: [
      'DVC orchestrates ingestion, validation, transformation and training.',
      'XGBoost tuned three ways: random search, Optuna TPE and simulated annealing.',
      'Experiments tracked in MLflow, shipped in Docker.',
    ],
    metric: 'DVC · MLflow · Optuna',
    stack: ['Python', 'XGBoost', 'DVC', 'MLflow', 'Docker'],
    repo: gh('NetSure'),
  },
];

export const journey = [
  {
    tag: 'Robotics',
    title: 'DD Robocon',
    result: 'National Finalist ×2',
    text: 'Two seasons building autonomous robots for India’s national robotics contest: real-time computer vision, CNN pipelines and control systems that have to work on the arena floor.',
  },
  {
    tag: 'Generative AI',
    title: 'Inter IIT Tech Meet 14.0',
    result: '8th place',
    text: 'Represented IIT Patna on the Adobe GenAI problem statement. We built Feather, a mobile editor with diffusion-based editing and SDXL style transfer.',
  },
  {
    tag: 'Edge AI',
    title: 'Silicon Labs IoT Challenge 2026',
    result: 'Global Top 20',
    text: 'Team Trinetra’s ICU anomaly detection system, running on EFR32 microcontrollers and predicting patient decompensation before the alarms fire.',
  },
  {
    tag: 'Community',
    title: 'NJACK ML Club, IIT Patna',
    result: 'Coordinator',
    text: 'I coordinate the machine learning wing of IIT Patna’s computing club. Three workshops and more than a hundred students trained so far.',
  },
];

export const magazine = [
  {
    title: 'Not Just Another cKlassifier: NJAcK',
    by: 'Parth Tomar',
    date: 'Oct 2026',
    url: 'https://thelearningcurvenjack.substack.com/p/not-just-another-cklassifier-njack',
  },
  {
    title: 'Coding After Opus 4.8: What is Even the Point?',
    by: 'AdiOS',
    date: 'Sep 2026',
    url: 'https://thelearningcurvenjack.substack.com/p/coding-after-opus-48-what-is-even',
  },
  {
    title: 'Zero-Shot Reality',
    by: 'myok',
    date: 'Aug 2026',
    url: 'https://thelearningcurvenjack.substack.com/p/zero-shot-reality',
  },
  {
    title: 'Gboard: Cleaning up your keyboard crimes since 2017',
    by: 'Ayaan Mustafa',
    date: 'Aug 2026',
    url: 'https://thelearningcurvenjack.substack.com/p/gboard-cleaning-up-your-keyboard',
  },
];

export const stack = [
  {
    title: 'The Theoretical',
    note: 'Models and the maths under them',
    items: ['PyTorch', 'TensorFlow', 'OpenCV', 'Transformers', 'Diffusion', 'RAG', 'LangGraph', 'DSPy', 'CUDA'],
  },
  {
    title: 'The Tactical',
    note: 'Languages and data stores',
    items: ['Python', 'Go', 'C++', 'TypeScript', 'Rust', 'PostgreSQL', 'Redis', 'ClickHouse', 'Kafka', 'SQLite'],
  },
  {
    title: 'The Orchestration',
    note: 'Shipping and keeping it up',
    items: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'GitHub Actions', 'MLflow', 'DVC', 'Nginx', 'gRPC'],
  },
];

export const marquee = [
  'AI/ML Systems',
  'Backend Infrastructure',
  'Agent Harnesses',
  'Distributed Systems',
  'Robotics',
  'Retrieval',
  'Edge AI',
  'Computer Vision',
];
