// ─── SKILLS DATA ─────────────────────────────────────────────────────────────
export const skills = [
  // ─── LANGUAGES ───────────────────────────────
  { name: 'JavaScript', level: 92, category: 'Languages' },
  { name: 'TypeScript', level: 90, category: 'Languages' },
  { name: 'Python', level: 78, category: 'Languages' },
  { name: 'SQL', level: 60, category: 'Languages' },
  { name: 'Ruby', level: 70, category: 'Languages' },

  // ─── FRAMEWORKS & LIBRARIES ──────────────────
  { name: 'React', level: 85, category: 'Frameworks & Libraries' },
  { name: 'Svelte / kit', level: 92, category: 'Frameworks & Libraries' },
  { name: 'Ruby on Rails', level: 75, category: 'Frameworks & Libraries' },
  { name: 'Angular', level: 85, category: 'Frameworks & Libraries' },
  { name: 'Node.js', level: 78, category: 'Frameworks & Libraries' },

  // ─── AI Tools ─────────────────
  { name: 'Fine tuning', level: 78, category: 'AI/ML' },
  { name: 'RAG systems', level: 60, category: 'AI/ML' },
  { name: 'Model assesment', level: 80, category: 'AI/ML' },

  // // ─── APIS & INTEGRATION ──────────────────────
  // { name: 'REST APIs', level: 92, category: 'APIs & Integration' },
  // { name: 'Third-party Integrations', level: 88, category: 'APIs & Integration' },
  // { name: 'Webhooks', level: 70, category: 'APIs & Integration' },

  // // ─── DATABASES ───────────────────────────────
  // { name: 'PostgreSQL', level: 82, category: 'Databases' },
  // { name: 'MySQL', level: 75, category: 'Databases' },
  // { name: 'SQLite', level: 65, category: 'Databases' },
  // { name: 'Schema Design & Migrations', level: 75, category: 'Databases' },

  // // ─── TESTING & QUALITY ───────────────────────
  // { name: 'Jest', level: 70, category: 'Testing & Quality' },
  // { name: 'Cypress', level: 72, category: 'Testing & Quality' },
  // { name: 'End-to-End Testing', level: 70, category: 'Testing & Quality' },
  // { name: 'Code Reviews', level: 85, category: 'Testing & Quality' },

  // ─── DEVOPS & CLOUD ──────────────────────────
  { name: 'Docker', level: 72, category: 'DevOps & Cloud' },
  { name: 'CI/CD Pipelines', level: 75, category: 'DevOps & Cloud' },
  { name: 'Cloud Deployments', level: 78, category: 'DevOps & Cloud' },

  // ─── TOOLING ─────────────────────────────────
  { name: 'Git', level: 92, category: 'Tooling' },
  { name: 'npm / yarn / pnpm / bun', level: 88, category: 'Tooling' },
  { name: 'ESLint / Prettier', level: 80, category: 'Tooling' },

  // // ─── ARCHITECTURE & PRACTICES ─────────────────
  // { name: 'Component-driven Architecture', level: 90, category: 'Architecture & Practices' },
  // { name: 'Scalable Frontend Architecture', level: 85, category: 'Architecture & Practices' },
  // { name: 'Separation of Concerns', level: 88, category: 'Architecture & Practices' },
  // { name: 'Technical Decision Making', level: 85, category: 'Architecture & Practices' },

  // // ─── LEADERSHIP & COLLABORATION ───────────────
  // { name: 'Mentoring Developers', level: 85, category: 'Leadership & Collaboration' },
  // { name: 'Technical Communication', level: 90, category: 'Leadership & Collaboration' },
  // { name: 'Product & Stakeholder Collaboration', level: 80, category: 'Leadership & Collaboration' },
  // { name: 'Agile / Scrum Practices', level: 85, category: 'Leadership & Collaboration' },
];

// ─── WORK EXPERIENCE DATA ───────────────────────────────────────────────────
export const experiences = [
  {
    company: 'LaunchpadLab',
    position: 'Software Developer',
    location: 'Remote',
    startDate: '2022-06',
    endDate: null,
    current: true,
    description:
      'Full-stack software development for multiple clients across different industries, working on web, mobile, and AI-driven solutions.',
    responsibilities: [
      'Developed and maintained full-stack applications using Ruby on Rails and React for a consulting company',
      'Built and supported a large-scale Ruby on Rails and EmberJS application for a home warranty platform',
      'Designed, developed, and deployed three Ionic mobile applications to the App Store and Google Play Store',
      'Designed and implemented AI models using PyTorch for large-scale image analysis pipelines, reducing data waste by 30%',
      'Collaborated closely with product managers, designers, and stakeholders to deliver production-ready solutions'
    ],
    technologies: [
      'Ruby on Rails',
      'React',
      'EmberJS',
      'Ionic',
      'JavaScript',
      'TypeScript',
      'PostgreSQL',
      'Python',
      'PyTorch'
    ]
  },

  {
    company: 'GlobalLogic',
    position: 'Technical Lead',
    location: 'Remote',
    startDate: '2021-01',
    endDate: '2022-06',
    current: false,
    description:
      'Technical leadership role focused on frontend architecture, team coordination, and direct client communication for fintech products.',
    responsibilities: [
      'Led a cross-functional team of five engineers during the migration of fintech applications to a micro-frontend architecture',
      'Improved deployment speed and maintainability through architectural refactoring and modularization',
      'Presented technical roadmaps, progress updates, and architectural decisions directly to client stakeholders',
      'Conducted internal technical talks to share knowledge and improve engineering practices',
      'Developed proof-of-concept applications based on facial recognition technologies'
    ],
    technologies: [
      'Angular 9',
      'JavaScript',
      'Micro-Frontends',
      'Perforce'
    ]
  },
  {
    company: 'Grupo Assa',
    position: 'Frontend Developer (Project-based)',
    location: 'Remote',
    startDate: '2020-01',
    endDate: '2020-12',
    current: false,
    description:
      'Development of a public-facing sustainability report platform focused on performance, accessibility, and internationalization.',
    responsibilities: [
      'Developed a web-based sustainability report for Grupo Assa',
      'Implemented internationalization (i18n) support for multi-language content',
      'Collaborated with designers to integrate animations and interactive elements',
      'Ensured performance, responsiveness, and cross-browser compatibility'
    ],
    technologies: [
      'Angular 9',
      'SASS',
      'Bootstrap',
      'Firebase',
      'i18n',
      'Lottie Animations'
    ]
  },
  {
    company: 'GlobalLogic',
    position: 'Senior Web UI Developer',
    location: 'Remote',
    startDate: '2019-09',
    endDate: '2020-12',
    current: false,
    description:
      'Senior frontend role focused on building and maintaining fintech web applications and supporting team growth.',
    responsibilities: [
      'Developed Angular-based frontend applications for fintech clients',
      'Participated in technical interviews and onboarding of new team members',
      'Contributed to frontend architecture discussions and implementation decisions',
      'Worked closely with backend teams to integrate APIs and improve user experience'
    ],
    technologies: [
      'Angular 2',
      'JavaScript',
      'Perforce'
    ]
  },
  {
    company: 'Globant',
    position: 'Semi Senior Web UI Developer',
    location: 'Bahía Blanca, Argentina',
    startDate: '2019-01',
    endDate: '2019-9',
    current: false,
    description:
      'Frontend development across multiple projects, including migrations, greenfield development, and legacy system maintenance.',
    responsibilities: [
      'Led the migration of a fintech application from AngularJS to Angular 7',
      'Developed VueJS applications for an advertising company',
      'Designed frontend architecture for new projects',
      'Maintained and extended legacy AngularJS applications',
      'Managed and coordinated frontend development tasks within the team'
    ],
    technologies: [
      'AngularJS',
      'Angular 7',
      'VueJS',
      'JavaScript',
      'Git',
      'TFS'
    ]
  },
  {
    company: 'Globant',
    position: 'Junior Advanced Web UI Developer',
    location: 'Bahía Blanca, Argentina',
    startDate: '2018-01',
    endDate: '2019-01',
    current: false,
    description:
      'Early-career frontend development role focused on building enterprise web applications and strengthening engineering fundamentals.',
    responsibilities: [
      'Developed Angular-based applications for a cruise ship company',
      'Collaborated with senior developers to implement UI components and features',
      'Worked with agile teams using Jira for task tracking and delivery'
    ],
    technologies: [
      'Angular 4',
      'JavaScript',
      'Git',
      'Jira'
    ]
  }
];

// ─── PROJECTS DATA ──────────────────────────────────────────────────────────
export const projects = [
  {
    title: 'Triangulo',
    role: 'Co-Founder & Developer',
    description:
      'Billing platform designed to help freelancers manage invoicing and payments through a unified workflow.',
    longDescription:
      'Triangulo was a billing platform built for freelancers, focused on flexible invoicing flows and local payment integrations. The project explored multiple freelancer use cases, implemented MercadoPago payments, and maintained a scalable architecture despite limited early-stage tooling. The product was responsibly deprecated after failing to achieve product–market fit.',
    technologies: ['Angular 7', 'Node.js', 'MercadoPago API'],
    challenges: [
      'Designing a billing flow flexible enough to support different freelancer use cases',
      'Integrating MercadoPago reliably at a time when tooling and documentation were limited',
      'Maintaining a scalable architecture with very limited resources',
      'Deprecating the product responsibly while preserving technical and business learnings'
    ],
    learnings: [
      'Product–market fit matters more than technical execution',
      'Early architectural decisions should optimize for learning speed, not perfection',
      'Knowing when to sunset a product is as important as knowing how to build one'
    ],
    featured: false,
    status: 'deprecated',
    year: '2018'
  },
  {
    title: 'Jazmín de Rosas',
    role: 'Co-Founder & Developer',
    description:
      'Custom e-commerce solution for a makeup retailer built on top of Magento.',
    longDescription:
      'E-commerce platform developed for a retail-focused makeup brand. The project required working within Magento\'s rigid architecture while delivering custom payment behavior and aligning technical decisions with a non-technical business.',
    technologies: ['Magento', 'PHP', 'Custom Payment Integrations'],
    challenges: [
      'Working within Magento\'s rigid architecture while delivering custom functionality',
      'Balancing technical decisions with retail-driven business priorities',
      'Navigating a partnership exit without compromising the product or team'
    ],
    learnings: [
      'Technical decisions must align with business maturity and goals',
      'Clear communication is critical when working with non-technical stakeholders',
      'Exiting a partnership cleanly is a professional skill, not a failure'
    ],
    image: 'https://jazminderosas.com/media/wysiwyg/logo-jazmin.png',
    websiteUrl: 'https://jazminderosas.com/',
    featured: false,
    status: 'exited',
    year: '2019'
  },
  {
    title: 'Randall',
    role: 'Founder & Developer',
    description: 'WhatsApp-powered expense tracker for Argentina. Track income and expenses through natural language chat using Meta Business Cloud API.',
    longDescription: 'Expense tracking bot with WhatsApp webhook integration using Meta Business Cloud API. Features shared accounts, recurring transactions, AI-powered summaries, natural language parsing for Argentine Spanish, and real-time dashboard with transaction analytics.',
    image: 'https://image.thum.io/get/width/800/crop/600/https://randall.agency',
    technologies: ['React', 'TypeScript', 'Fastify', 'Prisma', 'PostgreSQL', 'WhatsApp API', 'Railway'],
    githubUrl: null,
    liveUrl: 'https://randall.agency',
    featured: true,
    status: 'in-progress',
    year: '2026'
  },
  {
    title: 'Talent.Arg',
    role: 'Co-Founder & Lead Developer',
    description:
      'Sports scholarship and talent scouting platform connecting Latin American athletes with U.S. educational institutions.',
    longDescription:
      'Talent.Arg is a scouting and scholarship platform designed to balance athlete profiles, recruiter workflows, and administrative processes. The platform integrates HubSpot as a CRM adapted to a non-standard sports scouting use case.',
    technologies: ['Svelte', 'Ruby on Rails', 'PostgreSQL', 'HubSpot'],
    challenges: [
      'Designing workflows that serve athletes, recruiters, and administrators simultaneously',
      'Adapting HubSpot CRM to a non-standard sports scouting domain',
      'Maintaining focus on core business while scaling partnerships'
    ],
    learnings: [
      'Not all domains fit standard SaaS patterns',
      'Strong partnerships can unlock progress faster than technical features',
      'Clear domain modeling is critical when multiple user roles coexist'
    ],
    image: 'https://image.thum.io/get/width/800/crop/600/https://talentarg.com',
    websiteUrl: 'https://talentarg.com',
    githubUrl: null,
    liveUrl: 'https://talentarg.com',
    featured: true,
    status: 'active',
    year: '2023'
  },
  {
    title: 'Veluto',
    role: 'Co-Founder',
    description:
      'Pistachio-based food brand exploring product development, branding, and distribution strategies.',
    longDescription:
      'Veluto is a food brand project focused on pistachio-based products. The initiative involved creating a brand from scratch and owning the entire process end-to-end, including branding, marketing, commercialization, and supplier management.',
    technologies: ['TiendaNube', 'Adobe Illustrator', 'Facebook Ads'],
    challenges: [
      'Entering a completely unfamiliar industry',
      'Building a brand identity from scratch',
      'Owning technical, branding, marketing, and commercial decisions simultaneously'
    ],
    learnings: [
      'Technology is only one part of building a real business',
      'Branding and perception directly affect product success',
      'End-to-end ownership builds better decision-making skills'
    ],
    image: 'https://image.thum.io/get/width/800/crop/600/https://veluto.mitiendanube.com',
    websiteUrl: 'https://veluto.com.ar',
    githubUrl: null,
    liveUrl: 'https://veluto.com.ar',
    featured: false,
    status: 'active',
    year: '2025'
  },
  {
    title: 'dermAI',
    role: 'Co-Founder & Lead Developer',
    description:
      'AI-powered melanoma detection application focused on medical imaging analysis.',
    longDescription:
      'dermAI is an AI-driven melanoma detection application built using deep learning models trained on medical imaging datasets. The project emphasizes model accuracy, ethical responsibility, and a clean separation between ML inference and frontend consumption.',
    technologies: [
      'Python',
      'PyTorch',
      'Hugging Face',
      'Ionic',
      'React',
      'Docker'
    ],
    challenges: [
      'Working with medical imaging datasets with quality and labeling limitations',
      'Handling class imbalance and avoiding overfitting in a high-risk medical domain',
      'Designing a clean separation between ML inference and frontend consumption',
      'Balancing ethical, technical, and usability considerations'
    ],
    learnings: [
      'In high-risk domains, correctness and ethics outweigh speed',
      'Model performance must be evaluated beyond raw accuracy',
      'Clear boundaries between ML and product layers improve long-term maintainability'
    ],
    image: 'https://image.thum.io/get/width/800/crop/600/https://dermai.com.ar',
    websiteUrl: 'https://dermai.com.ar',
    githubUrl: null,
    liveUrl: 'https://dermai.com.ar',
    featured: true,
    status: 'active',
    year: '2025'
  }
];

// ─── PUBLICATIONS DATA ──────────────────────────────────────────────────────
export const publications = [
  {
    title: 'Sample Article Title',
    description: 'A brief description of the article content, explaining what readers will learn and why it matters.',
    date: '2024-01-15',
    platform: 'Medium',
    url: 'https://medium.com/@yourprofile/article-slug',
    tags: ['JavaScript', 'Web Development', 'Tutorial'],
    readTime: '5 min read'
  },
  {
    title: 'Another Publication',
    description: 'This is another example publication. Replace these with your actual blog posts and articles.',
    date: '2024-02-20',
    platform: 'Medium',
    url: 'https://medium.com/@yourprofile/another-article',
    tags: ['TypeScript', 'Best Practices'],
    readTime: '8 min read'
  },
  {
    title: 'Technical Deep Dive',
    description: 'An in-depth exploration of a technical topic, showcasing your expertise and teaching abilities.',
    date: '2024-03-10',
    platform: 'Dev.to',
    url: 'https://dev.to/yourprofile/article',
    tags: ['React', 'Performance', 'Advanced'],
    readTime: '12 min read'
  }
];

// ─── STYLING CONSTANTS ──────────────────────────────────────────────────────
export const platformColors: Record<string, string> = {
  'Medium': 'bg-green-600',
  'Dev.to': 'bg-purple-600',
  'Personal Blog': 'bg-blue-600',
  'Other': 'bg-gray-600'
};

export const statusColors: Record<string, string> = {
  'completed': 'bg-primary',
  'in-progress': 'bg-secondary',
  'planned': 'border-primary'
};

export const statusLabels: Record<string, string> = {
  'completed': 'Completed',
  'in-progress': 'In Progress',
  'planned': 'Planned'
};
