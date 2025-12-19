<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  // @ts-ignore
  import Circles from '$lib/components/Circles.svelte';
  import type { PageData } from './$types';
  import { t, currentLanguage } from '$lib/i18n/store';
  import { skills, experiences as experiencesData, projects as projectsData, statusColors } from '$lib/constants';
  import { type MediumArticle } from '$lib/services';
  import { generateRandomColors, getRandomBrandColor, getOppositeBrandColor } from '$lib/utils/colorRandomizer';

  export let data: PageData;

  const linkColors = {
    linkedin: getRandomBrandColor(),
    github: getRandomBrandColor(),
    contact: getRandomBrandColor()
  };

  const { mediumArticles } = data;

  // Merge translated content with static data
  $: experiences = experiencesData.map((exp, i) => ({
    ...exp,
    company: $t.experiences[i]?.company || exp.company,
    position: $t.experiences[i]?.position || exp.position,
    location: $t.experiences[i]?.location || exp.location,
    description: $t.experiences[i]?.description || exp.description,
    responsibilities: $t.experiences[i]?.responsibilities || exp.responsibilities
  }));

  $: projects = projectsData.map((proj, i) => ({
    ...proj,
    title: $t.projectsList[i]?.title || proj.title,
    description: $t.projectsList[i]?.description || proj.description,
    longDescription: $t.projectsList[i]?.longDescription || proj.longDescription
  }));

  let title = '';
  const TIME = 200;
  let visible = false;
  let nameScrollProgress = 0;

  function* iterateGreetings () {
    let greetings = [
      'Hola',
      'Hello',
      'Ciao',
      'Hallo',
      'Ahoj',
      'Salut',
      'Aloha',
      'こんにちは',
      'Привет',
      'Olá'
    ];
    for (let i = 0; i < greetings.length; i++) {
      yield greetings[i];
    }
  }

  let greeting = iterateGreetings();

  const writeTitles = () => {
    let { value, done } = greeting.next();
    title = '';
    if (!done) {
      // @ts-ignore
      value = value.split('');
      setTimeout(() => {
        // @ts-ignore
        value.forEach((letter, index) => {
          /* Iterate letters */
          setTimeout(() => {
            title += letter;
          }, TIME * (index + 1));
          /* End of word */
          // @ts-ignore
          if (index === value.length - 1) {
            // @ts-ignore
            setTimeout( writeTitles, 2 * TIME * (value.length + 1));
          }
        });
      // @ts-ignore
      }, TIME * value.length)
    } else {
      greeting = iterateGreetings();
      writeTitles();
    }
  }

  // Get current scroll position (cross-browser compatible)
  const getScrollPosition = (): number => {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  };

  // Custom smooth scroll with easing
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };

  const smoothScrollTo = (targetId: string, duration: number = 1000) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const startPosition = getScrollPosition();
    const targetPosition = target.getBoundingClientRect().top + startPosition;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const scrollDown = () => {
    smoothScrollTo('skills');
  };

  writeTitles();

  let categoryCharts: Record<string, Chart> = {};
  let expandedExperiences: Record<number, boolean> = {};
  let categoryTitleColors: Record<string, string> = {};
  let categoryHoverColors: Record<string, string> = {};

  // Random colors for various decorative elements
  const accentColors = {
    experienceCompany: getRandomBrandColor(),
    experienceBullet: getRandomBrandColor(),
    featuredStar: getRandomBrandColor(),
    publicationHover: getRandomBrandColor(),
    publicationTitle: getRandomBrandColor(),
    readMoreLink: getRandomBrandColor(),
  };

  const toggleExperience = (index: number) => {
    expandedExperiences[index] = !expandedExperiences[index];
  };

  onMount(() => {
    // Setup mini charts for each category
    const categories = Object.keys(skillsByCategory);

    categories.forEach(category => {
      const canvasId = `chart-${category.replace(/\s+/g, '-').toLowerCase()}`;
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const categorySkills = skillsByCategory[category];

          // Generate random colors for each bar
          const barColors = categorySkills.map(() => getRandomBrandColor());

          categoryCharts[category] = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: categorySkills.map(s => s.name),
              datasets: [{
                data: categorySkills.map(s => s.level),
                backgroundColor: barColors,
                borderColor: barColors,
                borderWidth: 1,
                borderRadius: 4,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'y',
              scales: {
                x: {
                  beginAtZero: true,
                  max: 100,
                  grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                  },
                  ticks: {
                    color: '#9ca3af',
                    font: { size: 10 }
                  }
                },
                y: {
                  grid: {
                    display: false
                  },
                  ticks: {
                    color: '#d1d5db',
                    font: { size: 11 }
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.parsed.x}%`;
                    }
                  }
                }
              }
            }
          });
        }
      }
    });

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor && anchor.hash) {
        const targetId = anchor.hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();
          smoothScrollTo(targetId);

          // Update URL without jumping
          history.pushState(null, '', anchor.hash);
        }
      }
    };

    requestAnimationFrame(() => {
      visible = true;
    });

    // Setup scroll listener for progressive name animation
    const nameElement = document.querySelector('.name-hover') as HTMLElement;

    const handleScroll = () => {
      if (!nameElement) return;

      const rect = nameElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate when element enters viewport (bottom of element reaches bottom of viewport)
      // to when it leaves viewport (top of element reaches top of viewport)
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      // const elementHeight = rect.height;

      // Start animation when element is at 80% of viewport height
      // Complete when element reaches 20% of viewport height
      const startTrigger = windowHeight * 0.8;
      const endTrigger = windowHeight * 0.2;

      let progress = 0;

      if (elementBottom <= startTrigger && elementTop >= endTrigger) {
        // Element is in the animation range
        const totalDistance = startTrigger - endTrigger;
        const currentDistance = startTrigger - elementBottom;
        progress = Math.max(0, Math.min(100, (currentDistance / totalDistance) * 100));
      } else if (elementTop < endTrigger) {
        // Element has passed the end trigger
        progress = 100;
      }

      nameScrollProgress = progress;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    document.addEventListener('click', handleAnchorClick);

    return () => {
      Object.values(categoryCharts).forEach(chart => chart.destroy());
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('scroll', handleScroll);
    };
  });

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  // Generate random colors for category titles and hover borders
  const categories = Object.keys(skillsByCategory);
  categoryTitleColors = generateRandomColors(categories);
  categoryHoverColors = generateRandomColors(categories);

  // Format date
  function formatDate(dateString: string | null): string {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  function formatPublicationDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Extract clean text from HTML description (SSR-safe)
  function getExcerpt(html: string, maxLength: number = 200): string {
    // Simple regex-based HTML tag removal for SSR compatibility
    const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Extract thumbnail from description or use default (SSR-safe)
  function getThumbnail(article: MediumArticle): string {
    if (article.thumbnail) return article.thumbnail;

    // Try to extract first image from description using regex
    const imgMatch = article.description.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : '/icons/logo.png';
  }

  // Calculate read time based on description length (SSR-safe)
  function calculateReadTime(description: string): string {
    const wordsPerMinute = 200;
    // Remove HTML tags using regex
    const text = description.replace(/<[^>]*>/g, '').trim();
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
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

<!-- Hero Section -->
<section id="inicio" class="main relative">
  <Circles />
  <h1 class="text-6xl md:text-8xl xl:text-12xl whitespace-nowrap titles"> { title.length ? title : '' } </h1>
  <button on:click={scrollDown} class="scroll-button btn btn-circle btn-outline absolute mx-auto bottom-3 h-16 w-16 text-center">
    <img src="/icons/arrow_down.svg" alt="arrow down">
  </button>
</section>

<!-- About me -->
<section id="about" class="about-section py-20 px-4 md:px-8 max-w-4xl mx-auto ">
  <h1 class="text-4xl md:text-6xl font-bold mb-12 section-title text-center about-title {visible ? 'visible' : ''}">{$t.about.title}</h1>
  <div class="about-content">
    <p class="intro name-hover" style="background-position: {nameScrollProgress}% 0%;"> {$t.about.name} </p>
    <p class="intro ">
      {$t.about.intro}
    </p>
    <p class="description">
      {$t.about.description}
    </p>
    <!-- Contact Button -->
    <a
      href="mailto:federicorudolf@gmail.com"
      class="contact-button px-6 py-3 rounded-lg font-semibold transition-all"
      style="--contact-color: {linkColors.contact}"
    >
      {$t.about.contactButton}
    </a>
  </div>
</section>

<!-- Skills Section -->
<section id="skills" class="skills-section min-h-screen py-20 px-4 md:px-8">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-4xl md:text-6xl font-bold mb-4 section-title text-center">{$t.skills.title}</h1>
    <p class="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
      {$t.skills.subtitle}
    </p>

    <!-- Skills Grid with Mini Charts -->
    <div class="skills-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
      {#each Object.entries(skillsByCategory) as [category, categorySkills]}
        <div class="category-card bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700" style="--hover-border-color: {categoryHoverColors[category]}">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2" style="color: {categoryTitleColors[category]}">
            <span class="w-1 h-6 rounded-full" style="background-color: {getOppositeBrandColor(categoryTitleColors[category])}"></span>
            {$t.skills.categories[category] || category}
          </h2>

          <!-- Mini Chart -->
          <div class="chart-wrapper mb-4" style="height: {categorySkills.length * 32}px; min-height: 120px; max-height: 300px;">
            <canvas id="chart-{category.replace(/\s+/g, '-').toLowerCase()}"></canvas>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Work Experience Section -->
<section id="trabajos" class="experience-section min-h-screen py-20 px-4 md:px-8">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-4xl md:text-6xl font-bold mb-4 section-title text-center">{$t.experience.title}</h1>
    <p class="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
      {$t.experience.subtitle}
    </p>

    <!-- Experience Grid -->
    <div class="experience-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each experiences as experience, index}
        <div class="experience-card bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden flex flex-col">
          <!-- Card Header -->
          <div class="p-6 pb-4">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h2 class="text-xl font-bold text-gray-200 mb-1">{experience.position}</h2>
                <h3 class="text-lg font-semibold" style="color: {accentColors.experienceCompany}">{experience.company}</h3>
              </div>
              {#if experience.current}
                <span class="current-badge red-decoration-500 px-2 py-1 rounded-full text-white text-xs font-semibold shrink-0">
                  {$t.experience.current}
                </span>
              {/if}
            </div>

            <!-- Meta Info -->
            <div class="flex flex-col gap-2 text-sm text-gray-400 mb-3">
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                  <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                </svg>
                {experience.location}
              </span>
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                </svg>
                {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
              </span>
              <span class="text-xs">{calculateDuration(experience.startDate, experience.endDate)}</span>
            </div>

            <!-- Description (always visible) -->
            <p class="text-gray-300 text-sm line-clamp-3">
              {experience.description}
            </p>
          </div>

          <!-- Expandable Content -->
          {#if expandedExperiences[index]}
            <div class="px-6 pb-4 space-y-4">
              <!-- Responsibilities -->
              <div>
                <h4 class="text-xs font-semibold text-gray-400 mb-2">{$t.experience.responsibilities}</h4>
                <ul class="list-none space-y-1.5">
                  {#each experience.responsibilities as responsibility}
                    <li class="text-gray-300 text-xs flex items-start gap-2">
                      <span class="mt-0.5 text-sm" style="color: {accentColors.experienceBullet}">▹</span>
                      <span>{responsibility}</span>
                    </li>
                  {/each}
                </ul>
              </div>

              <!-- Technologies -->
              <div>
                <h4 class="text-xs font-semibold text-gray-400 mb-2">{$t.experience.technologies}</h4>
                <div class="flex flex-wrap gap-1.5">
                  {#each experience.technologies as tech}
                    <span class="tech-badge bg-gray-700/50 px-2 py-1 rounded-full text-xs text-gray-300 border border-gray-600">
                      {tech}
                    </span>
                  {/each}
                </div>
              </div>
            </div>
          {/if}

          <!-- Expand/Collapse Button -->
          <button
            on:click={() => toggleExperience(index)}
            class="expand-button w-full py-3 px-6 bg-gray-700/30 hover:bg-gray-700/50 transition-colors flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-gray-200 border-t border-gray-700"
          >
            {#if expandedExperiences[index]}
              <span>{$t.experience.showLess}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
              </svg>
            {:else}
              <span>{$t.experience.showMore}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
              </svg>
            {/if}
          </button>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Projects Section -->
<section id="projects" class="projects-section min-h-screen py-20 px-4 md:px-8">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-4xl md:text-6xl font-bold mb-4 section-title text-center">{$t.projects.title}</h1>
    <p class="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
      {$t.projects.subtitle}
    </p>

    <!-- Featured Projects -->
    {#if projects.some(p => p.featured)}
      <div class="mb-16">
        <h2 class="text-2xl font-bold text-gray-200 mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" style="color: {accentColors.featuredStar}" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          </svg>
          {$t.projects.featured}
        </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {#each projects.filter(p => p.featured) as project}
            <article class="project-card featured bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden group">
              <!-- Project Image -->
              <div class="project-image-container relative h-56 bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden">
                {#if project.image}
                  <img
                    src={project.image}
                    alt={project.title}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    on:error={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div class="hidden absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="text-gray-600" viewBox="0 0 16 16">
                      <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z"/>
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                    </svg>
                  </div>
                {:else}
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="text-gray-600" viewBox="0 0 16 16">
                      <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z"/>
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                    </svg>
                  </div>
                {/if}
                <div class="absolute top-4 right-4">
                  <span class="status-badge {statusColors[project.status]} px-3 py-1 rounded-full text-white text-xs font-semibold">
                    {$t.projects.status[project.status]}
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
                      {$t.projects.code}
                    </a>
                  {/if}
                  {#if project.liveUrl}
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="project-link flex items-center gap-2 px-4 py-2 red-decoration-500 hover:red-decoration-500 rounded-lg text-white transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
                      </svg>
                      {$t.projects.liveDemo}
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
      <h2 class="text-2xl font-bold text-gray-200 mb-6">{$t.projects.allProjects}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each projects as project}
          <article class="project-card bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden flex flex-col">
            <!-- Project Image -->
            <div class="project-image-container-small relative h-40 bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden">
              {#if project.image}
                <img
                  src={project.image}
                  alt={project.title}
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  on:error={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div class="hidden absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="text-gray-600" viewBox="0 0 16 16">
                    <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z"/>
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                  </svg>
                </div>
              {:else}
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="text-gray-600" viewBox="0 0 16 16">
                    <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z"/>
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                  </svg>
                </div>
              {/if}
            </div>

            <!-- Project Content -->
            <div class="p-5 flex flex-col flex-1">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-bold text-gray-200 flex-1">{project.title}</h3>
                <span class="status-badge {statusColors[project.status]} px-2 py-1 rounded-full text-white text-xs font-semibold">
                  {$t.projects.status[project.status]}
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
                    {$t.projects.code}
                  </a>
                {/if}
                {#if project.liveUrl}
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link-small flex-1 flex items-center justify-center gap-2 px-3 py-2 red-decoration-500 hover:red-decoration-500 rounded-lg text-white transition-all text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                      <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                    </svg>
                    {$t.projects.demo}
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

<!-- Publications Section -->
<section id="posts" class="publications-section min-h-screen py-20 px-4 md:px-8">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-4xl md:text-6xl font-bold mb-4 section-title text-center">{$t.posts.title}</h1>
    <p class="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
      {$t.posts.subtitle}
    </p>

    <!-- Publications Grid -->
    {#if mediumArticles.length > 0}
      <div class="publications-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each mediumArticles as article}
          <article class="publication-card bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden flex flex-col group transition-all" style="--publication-hover-color: {accentColors.publicationHover}">
            <!-- Article Thumbnail -->
            <div class="article-thumbnail relative h-48 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
              <img
                src={getThumbnail(article)}
                alt={article.title}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                on:error={(e) => {
                  e.currentTarget.src = '/icons/logo.png';
                }}
              />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
            </div>

            <!-- Article Content -->
            <div class="p-5 flex flex-col flex-1">
              <!-- Header -->
              <div class="mb-3">
                <h2 class="text-xl font-bold text-gray-200 mb-2 line-clamp-2 transition-colors" style="--publication-title-color: {accentColors.publicationTitle}">
                  <a href={article.link} target="_blank" rel="noopener noreferrer" class="publication-title-link">
                    {article.title}
                  </a>
                </h2>
                <div class="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span class="platform-badge bg-primary px-2 py-1 rounded-full text-white font-semibold">
                    Medium
                  </span>
                  <span>{formatPublicationDate(article.pubDate)}</span>
                  <span>•</span>
                  <span>{calculateReadTime(article.description)}</span>
                </div>
              </div>

              <!-- Description -->
              <p class="text-gray-300 text-sm mb-4 flex-1 line-clamp-3">
                {getExcerpt(article.description, 150)}
              </p>

              <!-- Tags -->
              {#if article.categories && article.categories.length > 0}
                <div class="flex flex-wrap gap-1.5 mb-4">
                  {#each article.categories.slice(0, 3) as category}
                    <span class="tag bg-gray-700/50 px-2 py-1 rounded-full text-xs text-gray-400">
                      #{category}
                    </span>
                  {/each}
                  {#if article.categories.length > 3}
                    <span class="tag bg-gray-700/50 px-2 py-1 rounded-full text-xs text-gray-400">
                      +{article.categories.length - 3}
                    </span>
                  {/if}
                </div>
              {/if}

              <!-- Read More Link -->
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                class="read-more-link inline-flex items-center gap-2 transition-colors font-semibold text-sm mt-auto"
                style="color: {accentColors.readMoreLink}"
              >
                {$t.posts.readArticle}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
              </a>
            </div>
          </article>
        {/each}
      </div>
    {:else}
      <!-- Loading State -->
      <div class="empty-state text-center py-20">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="mx-auto mb-4 text-gray-600 animate-pulse" viewBox="0 0 16 16">
          <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
          <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
          <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
        </svg>
        <p class="text-gray-400 text-lg">{$t.posts.emptyState}</p>
      </div>
    {/if}
  </div>
</section>

<style>
  .main {
    background-color: transparent;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    min-height: 100vh;
  }

  .titles {
    z-index: 9;
    font-family: 'Helvetica Neue', sans-serif;
    font-size: 5rem;
    text-shadow: 2px 2px 2px var(--red);
    text-stroke: 1px var(--red);
    -webkit-text-stroke: 1px var(--red);
  }

  @media (min-width: 768px) {
    .titles {
      font-size: 6rem;
    }
  }

  @media (min-width: 1024px) {
    .titles {
      font-size: 8rem;
    }
  }

  @media (min-width: 1280px) {
    .titles {
      font-size: 10rem;
    }
  }

  .scroll-button {
    border: 1px solid var(--red);
    transition: all 500ms ease-in-out;
  }

  .scroll-button:hover {
    transform: scale(1.1) rotate(360deg);
    border: 1px solid #FFF;
  }

  .scroll-button:hover img {
    filter: brightness(0) invert(1);
  }

  /* About Section Styles */
  .about-section {
    padding-top: 40px;
    height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .about-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .contact-button {
    position: relative;
    border: 2px solid #FFF;
    color: #FFF;
    background: linear-gradient(
      to right,
      transparent 0%,
      transparent 50%,
      #E2211C 50%,
      #E2211C 100%
    );
    background-size: 200% 100%;
    background-position: 0% 0%;
    transition: background-position 0.6s ease-in-out;
    overflow: hidden;
    margin-top: 20px;
  }

  .contact-button:hover {
    background-position: 100% 0%;
    transform: scale(1.05);
  }

  .intro {
    font-size: clamp(1.4rem, 3vw, 2rem);
    line-height: 1.5;
    margin: 0 auto 2rem;
    max-width: 40ch;
    color: #E5E7EB;
    font-weight: 500;
  }

  .name-hover {
    background: linear-gradient(
      to right,
      #FFF 0%,
      #FFF 50%,
      #E2211C 50%,
      #E2211C 100%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: bold;
    -webkit-text-stroke: 1px var(--red);
    font-size: 3em;
  }

  .description {
    font-size: clamp(1.1rem, 2vw, 1.4rem);
    line-height: 1.6;
    margin: 0 auto;
    max-width: 50ch;
    color: #9CA3AF;
  }

  /* Skills Section Styles */
  .skills-section {
    padding-top: 80px;
  }

  .chart-wrapper {
    position: relative;
    overflow: hidden;
  }

  .category-card {
    transition: all 0.3s ease;
  }

  .category-card:hover {
    transform: translateY(-4px);
    border: 2px solid var(--hover-border-color);
    box-shadow: 0 8px 25px -5px rgba(255, 62, 0, 0.1);
  }

  /* Experience Section Styles */
  .experience-section {
    padding-top: 80px;
  }

  .experience-card {
    transition: all 0.3s ease;
  }

  .experience-card:hover {
    transform: translateY(-4px);
    border-color: var(--red);
    border: 2px;
    box-shadow: 0 8px 25px -5px rgba(255, 62, 0, 0.1);
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .expand-button {
    margin-top: auto;
  }

  .tech-badge {
    transition: all 0.3s ease;
  }

  .tech-badge:hover {
    background-color: var(--red);
    border-color: var(--red);
    color: var(--red);
  }

  /* Projects Section Styles */
  .projects-section {
    padding-top: 80px;
  }

  .project-card {
    transition: transform 0.3s ease, border-color 0.3s ease;
    position: relative;
    border: 3px solid transparent;
  }

  .project-card:hover {
    transform: translateY(-4px);
    border-color: var(--red);
  }

  .project-link, .project-link-small {
    transition: all 0.3s ease;
  }

  .tech-tag {
    transition: all 0.3s ease;
  }

  .tech-tag:hover {
    background-color: var(--red);
    border-color: var(--red);
    color: var(--red);
  }

  /* Publications Section Styles */
  .publications-section {
    padding-top: 80px;
  }

  .publication-card {
    transition: all 0.3s ease;
  }

  .publication-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px -5px var(--publication-hover-color);
    border-color: var(--publication-hover-color);
  }

  .publication-title-link:hover {
    color: var(--publication-title-color);
  }

  .article-thumbnail {
    transition: all 0.3s ease;
  }

  .article-thumbnail img {
    transition: transform 0.5s ease;
  }

  .read-more-link svg {
    transition: transform 0.3s ease;
  }

  .read-more-link:hover svg {
    transform: translateX(4px);
  }

  .tag {
    transition: all 0.3s ease;
  }

  .tag:hover {
    background-color: rgba(255, 62, 0, 0.2);
    color: var(--red);
  }

  .red-decoration {
    background-color: var(--red);
  }
</style>