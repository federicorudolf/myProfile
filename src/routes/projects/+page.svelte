<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  // Projects data - add your actual projects here
  const projects = [

    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with real-time inventory management, payment processing, and order tracking. Built with modern technologies for optimal performance and user experience.',
      longDescription: 'Comprehensive e-commerce platform featuring user authentication, product catalog, shopping cart, payment integration with Stripe, order management, and an admin dashboard.',
      image: '/project-placeholder.jpg', // Replace with actual project image
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
      githubUrl: 'https://github.com/yourusername/ecommerce-platform',
      liveUrl: 'https://your-project-demo.com',
      featured: true,
      status: 'completed',
      year: '2024'
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, team collaboration features, and advanced filtering options.',
      longDescription: 'Full-featured task management solution with drag-and-drop interface, real-time collaboration, notifications, and integrations with popular tools.',
      image: '/project-placeholder.jpg',
      technologies: ['Vue.js', 'Firebase', 'Tailwind CSS', 'WebSockets'],
      githubUrl: 'https://github.com/yourusername/task-manager',
      liveUrl: 'https://task-app-demo.com',
      featured: true,
      status: 'in-progress',
      year: '2024'
    },
    {
      title: 'Weather Dashboard',
      description: 'A beautiful weather dashboard that provides real-time weather data, forecasts, and interactive maps using multiple weather APIs.',
      longDescription: 'Weather application with location-based forecasts, historical data, weather alerts, and customizable dashboard widgets.',
      image: '/project-placeholder.jpg',
      technologies: ['Svelte', 'TypeScript', 'Chart.js', 'OpenWeather API'],
      githubUrl: 'https://github.com/yourusername/weather-dashboard',
      liveUrl: 'https://weather-demo.com',
      featured: false,
      status: 'completed',
      year: '2023'
    },
    {
      title: 'Portfolio Generator',
      description: 'A tool that helps developers create beautiful portfolio websites using customizable templates and automatic deployment.',
      longDescription: 'Developer portfolio generator with multiple themes, markdown support, project showcase, blog integration, and one-click deployment.',
      image: '/project-placeholder.jpg',
      technologies: ['Next.js', 'MDX', 'Vercel', 'Prisma'],
      githubUrl: 'https://github.com/yourusername/portfolio-generator',
      liveUrl: null,
      featured: false,
      status: 'completed',
      year: '2023'
    }
  ];

  // Status colors
  const statusColors: Record<string, string> = {
    'completed': 'bg-green-600',
    'in-progress': 'bg-yellow-600',
    'planned': 'bg-blue-600'
  };

  const statusLabels: Record<string, string> = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'planned': 'Planned'
  };
</script>

<section class="projects-section min-h-screen py-20 px-4 md:px-8">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-4xl md:text-6xl font-bold mb-4 gradient-text text-center">Projects</h1>
    <p class="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
      A showcase of my personal projects, side hustles, and open-source contributions demonstrating my skills and passion for development.
    </p>

    <!-- Featured Projects -->
    {#if projects.some(p => p.featured)}
      <div class="mb-16">
        <h2 class="text-2xl font-bold text-gray-200 mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="text-orange-500" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          </svg>
          Featured Projects
        </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {#each projects.filter(p => p.featured) as project}
            <article class="project-card featured bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden group">
              <!-- Project Image -->
              <div class="project-image-container relative h-56 bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden">
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="text-gray-600" viewBox="0 0 16 16">
                    <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z"/>
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                  </svg>
                </div>
                <div class="absolute top-4 right-4">
                  <span class="status-badge {statusColors[project.status]} px-3 py-1 rounded-full text-white text-xs font-semibold">
                    {statusLabels[project.status]}
                  </span>
                </div>
              </div>

              <!-- Project Content -->
              <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                  <h3 class="text-2xl font-bold text-gray-200">{project.title}</h3>
                  <span class="text-gray-500 text-sm">{project.year}</span>
                </div>

                <p class="text-gray-300 mb-4">{project.description}</p>

                <!-- Technologies -->
                <div class="mb-4">
                  <div class="flex flex-wrap gap-2">
                    {#each project.technologies as tech}
                      <span class="tech-tag bg-gray-700/50 px-3 py-1 rounded-full text-xs text-gray-300 border border-gray-600">
                        {tech}
                      </span>
                    {/each}
                  </div>
                </div>

                <!-- Links -->
                <div class="flex gap-3">
                  {#if project.githubUrl}
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="project-link flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                      Code
                    </a>
                  {/if}
                  {#if project.liveUrl}
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="project-link flex items-center gap-2 px-4 py-2 red-decoration-600 hover:red-decoration-500 rounded-lg text-white transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
                      </svg>
                      Live Demo
                    </a>
                  {/if}
                </div>
              </div>
            </article>
          {/each}
        </div>
      </div>
    {/if}

    <!-- All Projects -->
    <div>
      <h2 class="text-2xl font-bold text-gray-200 mb-6">All Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each projects as project}
          <article class="project-card bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden flex flex-col">
            <!-- Project Image -->
            <div class="project-image-container-small relative h-40 bg-gradient-to-br from-gray-700 to-gray-900">
              <div class="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="text-gray-600" viewBox="0 0 16 16">
                  <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z"/>
                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                </svg>
              </div>
            </div>

            <!-- Project Content -->
            <div class="p-5 flex flex-col flex-1">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-bold text-gray-200 flex-1">{project.title}</h3>
                <span class="status-badge {statusColors[project.status]} px-2 py-1 rounded-full text-white text-xs font-semibold">
                  {statusLabels[project.status]}
                </span>
              </div>

              <p class="text-gray-300 text-sm mb-4 flex-1">{project.description}</p>

              <!-- Technologies -->
              <div class="mb-4">
                <div class="flex flex-wrap gap-1.5">
                  {#each project.technologies.slice(0, 3) as tech}
                    <span class="tech-tag bg-gray-700/50 px-2 py-0.5 rounded-full text-xs text-gray-400">
                      {tech}
                    </span>
                  {/each}
                  {#if project.technologies.length > 3}
                    <span class="tech-tag bg-gray-700/50 px-2 py-0.5 rounded-full text-xs text-gray-400">
                      +{project.technologies.length - 3}
                    </span>
                  {/if}
                </div>
              </div>

              <!-- Links -->
              <div class="flex gap-2 mt-auto">
                {#if project.githubUrl}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link-small flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-all text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                    Code
                  </a>
                {/if}
                {#if project.liveUrl}
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link-small flex-1 flex items-center justify-center gap-2 px-3 py-2 red-decoration-600 hover:red-decoration-500 rounded-lg text-white transition-all text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                      <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                    </svg>
                    Demo
                  </a>
                {/if}
              </div>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .projects-section {
    padding-top: 80px;
  }

  .project-card {
    transition: all 0.3s ease;
  }

  .project-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 62, 0, 0.5);
  }

  .project-link, .project-link-small {
    transition: all 0.3s ease;
  }

  .tech-tag {
    transition: all 0.3s ease;
  }

  .tech-tag:hover {
    background-color: rgba(255, 62, 0, 0.2);
    border-color: rgba(255, 62, 0, 0.5);
    color: rgba(255, 62, 0, 1);
  }
</style>
