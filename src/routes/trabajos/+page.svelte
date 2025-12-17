<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  // Work experience data
  const experiences = [
    {
      company: 'Tech Company Inc.',
      position: 'Senior Full Stack Developer',
      location: 'Remote',
      startDate: '2022-06',
      endDate: null, // null means current position
      current: true,
      description: 'Leading the development of scalable web applications using modern JavaScript frameworks. Collaborating with cross-functional teams to deliver high-quality software solutions.',
      responsibilities: [
        'Architected and developed multiple full-stack applications using React, Node.js, and PostgreSQL',
        'Mentored junior developers and conducted code reviews',
        'Improved application performance by 40% through optimization techniques',
        'Implemented CI/CD pipelines and automated testing workflows'
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker']
    },
    {
      company: 'Startup Solutions',
      position: 'Full Stack Developer',
      location: 'San Francisco, CA',
      startDate: '2020-03',
      endDate: '2022-05',
      current: false,
      description: 'Developed and maintained web applications for various clients, focusing on user experience and performance.',
      responsibilities: [
        'Built responsive web applications using Vue.js and Express.js',
        'Collaborated with designers to implement pixel-perfect UI components',
        'Integrated third-party APIs and payment gateways',
        'Participated in agile development processes and sprint planning'
      ],
      technologies: ['Vue.js', 'JavaScript', 'Express.js', 'MongoDB', 'Firebase']
    },
    {
      company: 'Digital Agency XYZ',
      position: 'Frontend Developer',
      location: 'New York, NY',
      startDate: '2018-01',
      endDate: '2020-02',
      current: false,
      description: 'Created engaging user interfaces and interactive experiences for client projects across various industries.',
      responsibilities: [
        'Developed responsive websites using HTML, CSS, and JavaScript',
        'Worked closely with UX designers to implement design systems',
        'Optimized website performance and accessibility',
        'Maintained and updated existing client websites'
      ],
      technologies: ['HTML/CSS', 'JavaScript', 'jQuery', 'Sass', 'Webpack']
    }
  ];

  // Format date
  function formatDate(dateString: string | null): string {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  // Calculate duration
  function calculateDuration(startDate: string, endDate: string | null): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  }
</script>

<section class="experience-section min-h-screen py-20 px-4 md:px-8">
  <div class="max-w-5xl mx-auto">
    <h1 class="text-4xl md:text-6xl font-bold mb-4 gradient-text text-center">Work Experience</h1>
    <p class="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
      A timeline of my professional journey, showcasing the roles I've held and the impact I've made.
    </p>

    <!-- Timeline -->
    <div class="timeline relative">
      <!-- Vertical line -->
      <div class="timeline-line absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-gray-700 to-gray-800"></div>

      {#each experiences as experience, index}
        <div class="timeline-item mb-12 relative {index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:ml-auto'}">
          <!-- Timeline dot -->
          <div class="timeline-dot absolute left-8 md:left-1/2 w-4 h-4 {experience.current ? 'red-decoration-500 animate-pulse' : 'bg-gray-600'} rounded-full border-4 border-gray-900 -ml-2 z-10"></div>

          <!-- Content card -->
          <div class="experience-card bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 ml-16 md:ml-0 {index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}">
            <!-- Header -->
            <div class="mb-4">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <h2 class="text-2xl font-bold text-gray-200">{experience.position}</h2>
                  <h3 class="text-xl text-orange-500 font-semibold">{experience.company}</h3>
                </div>
                {#if experience.current}
                  <span class="current-badge red-decoration-500 px-3 py-1 rounded-full text-white text-xs font-semibold">
                    Current
                  </span>
                {/if}
              </div>
              <div class="flex flex-wrap gap-3 text-sm text-gray-400 mb-2">
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                  </svg>
                  {experience.location}
                </span>
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                  </svg>
                  {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                </span>
                <span>• {calculateDuration(experience.startDate, experience.endDate)}</span>
              </div>
            </div>

            <!-- Description -->
            <p class="text-gray-300 mb-4">
              {experience.description}
            </p>

            <!-- Responsibilities -->
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-gray-400 mb-2">Key Responsibilities:</h4>
              <ul class="list-none space-y-2">
                {#each experience.responsibilities as responsibility}
                  <li class="text-gray-300 text-sm flex items-start gap-2">
                    <span class="text-orange-500 mt-1">▹</span>
                    <span>{responsibility}</span>
                  </li>
                {/each}
              </ul>
            </div>

            <!-- Technologies -->
            <div>
              <h4 class="text-sm font-semibold text-gray-400 mb-2">Technologies:</h4>
              <div class="flex flex-wrap gap-2">
                {#each experience.technologies as tech}
                  <span class="tech-badge bg-gray-700/50 px-3 py-1 rounded-full text-xs text-gray-300 border border-gray-600">
                    {tech}
                  </span>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .experience-section {
    padding-top: 80px;
  }

  .experience-card {
    transition: all 0.3s ease;
  }

  .experience-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 62, 0, 0.5);
  }

  .tech-badge {
    transition: all 0.3s ease;
  }

  .tech-badge:hover {
    background-color: rgba(255, 62, 0, 0.2);
    border-color: rgba(255, 62, 0, 0.5);
    color: rgba(255, 62, 0, 1);
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Responsive timeline adjustments */
  @media (max-width: 768px) {
    .timeline-line {
      left: 2rem;
    }

    .timeline-dot {
      left: 2rem !important;
    }
  }
</style>
