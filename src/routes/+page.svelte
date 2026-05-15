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

  console.log(projects, projectsData)

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

  let visibleExperiences: boolean[] = experiencesData.map(() => false);
  let visibleProjects: boolean[] = projectsData.map(() => false);
  let visibleSkillCards: Record<string, boolean> = {};
  let skillsVisible = false;
  let experienceRefs: (HTMLElement | null)[] = [];
  let projectRefs: (HTMLElement | null)[] = [];
  let skillCardRefs: Record<string, HTMLElement | null> = {};
  let skillCounters: Record<string, number[]> = {};

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

  function handleProjectTilt(e: MouseEvent, card: HTMLElement) {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
  }

  function resetProjectTilt(card: HTMLElement) {
    card.style.transform = '';
  }

  function animateCounter(el: HTMLElement, target: number, duration: number = 1200) {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = progress < 0.5 ? 4 * progress * progress * progress : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
      el.textContent = Math.round(ease * target) + '%';
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

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

    // Experience observers
    const expObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const i = experienceRefs.indexOf(entry.target as HTMLElement);
          if (i !== -1) {
            setTimeout(() => {
              visibleExperiences[i] = true;
              visibleExperiences = [...visibleExperiences];
            }, i * 120);
          }
        }
      });
    }, { threshold: 0.15 });

    // Project observers
    const projObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const i = projectRefs.indexOf(entry.target as HTMLElement);
          if (i !== -1) {
            setTimeout(() => {
              visibleProjects[i] = true;
              visibleProjects = [...visibleProjects];
            }, i * 80);
          }
        }
      });
    }, { threshold: 0.1 });

    // Skills section observer
    const skillsSectionEl = document.getElementById('skills');
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsVisible) {
          skillsVisible = true;
          // Animate counters
          categories.forEach((category, ci) => {
            const catSkills = skillsByCategory[category];
            catSkills.forEach((skill, si) => {
              const el = document.getElementById(`counter-${category.replace(/\s+/g, '-').toLowerCase()}-${si}`);
              if (el) setTimeout(() => animateCounter(el, skill.level, 1200), ci * 150 + si * 80);
            });
          });
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      experienceRefs.forEach(el => el && expObserver.observe(el));
      projectRefs.forEach(el => el && projObserver.observe(el));
      if (skillsSectionEl) skillsObserver.observe(skillsSectionEl);
    }, 100);

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
      expObserver.disconnect();
      projObserver.disconnect();
      skillsObserver.disconnect();
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

  const maxMonths = (() => {
    return Math.max(...experiencesData.map(exp => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    }));
  })();

  function durationPercent(exp: typeof experiencesData[0]): number {
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return Math.round((months / maxMonths) * 100);
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
      {#each Object.entries(skillsByCategory) as [category, categorySkills], ci}
        <div
          class="category-card bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 relative overflow-hidden skill-card-entrance {skillsVisible ? 'skill-entrance-visible' : ''}"
          style="--hover-border-color: {categoryHoverColors[category]}; --entrance-delay: {ci * 100}ms"
          on:mousemove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
            e.currentTarget.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
          }}
        >
          <!-- Cursor glow -->
          <div class="cursor-glow"></div>

          <h2 class="text-xl font-bold mb-5 flex items-center gap-2 relative z-10" style="color: {categoryTitleColors[category]}">
            <span class="w-1 h-6 rounded-full shrink-0" style="background-color: {getOppositeBrandColor(categoryTitleColors[category])}"></span>
            {$t.skills.categories[category] || category}
          </h2>

          <!-- Custom skill bars -->
          <div class="space-y-3 mb-4 relative z-10">
            {#each categorySkills as skill, si}
              <div class="skill-row">
                <div class="flex justify-between mb-1">
                  <span class="text-sm text-gray-300">{skill.name}</span>
                  <span
                    id="counter-{category.replace(/\s+/g, '-').toLowerCase()}-{si}"
                    class="text-xs text-gray-400 font-mono"
                  >0%</span>
                </div>
                <div class="skill-track">
                  <div
                    class="skill-fill {skillsVisible ? 'skill-fill-animate' : ''}"
                    style="--level: {skill.level}%; background: {categoryTitleColors[category]}; --bar-delay: {ci * 150 + si * 80}ms"
                  ></div>
                </div>
              </div>
            {/each}
          </div>

          <!-- Mini chart (keep for visual richness, below bars) -->
          <div class="chart-wrapper relative z-10" style="height: {Math.max(80, categorySkills.length * 22)}px; min-height: 80px; max-height: 200px; opacity: 0.5; margin-top: 8px;">
            <canvas id="chart-{category.replace(/\s+/g, '-').toLowerCase()}"></canvas>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Work Experience Section -->
<section id="trabajos" class="experience-section min-h-screen py-20 px-4 md:px-8">
  <div class="max-w-5xl mx-auto">
    <h1 class="text-4xl md:text-6xl font-bold mb-4 section-title text-center">{$t.experience.title}</h1>
    <p class="text-gray-400 text-center mb-20 max-w-2xl mx-auto">{$t.experience.subtitle}</p>

    <!-- Timeline -->
    <div class="timeline-container relative">
      <!-- Vertical line -->
      <div class="timeline-line"></div>

      {#each experiences as experience, index}
        <div
          class="timeline-item {index % 2 === 0 ? 'tl-left' : 'tl-right'} {visibleExperiences[index] ? 'tl-visible' : ''}"
          bind:this={experienceRefs[index]}
        >
          <!-- Dot -->
          <div class="timeline-dot" style="background: {accentColors.experienceCompany}">
            <div class="dot-ring" style="border-color: {accentColors.experienceCompany}"></div>
          </div>

          <!-- Card -->
          <div class="exp-card" style="--accent: {accentColors.experienceCompany}">
            <!-- Accent stripe -->
            <div class="exp-stripe" style="background: {accentColors.experienceCompany}"></div>

            <div class="p-6 pb-4">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <h2 class="text-lg font-bold text-white mb-0.5">{experience.position}</h2>
                  <h3 class="text-base font-semibold" style="color: {accentColors.experienceCompany}">{experience.company}</h3>
                </div>
                {#if experience.current}
                  <span class="current-badge shrink-0 text-white text-xs font-semibold px-2 py-1 rounded-full" style="background: {accentColors.experienceCompany}">
                    {$t.experience.current}
                  </span>
                {/if}
              </div>

              <div class="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 16 16"><path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/><path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
                  {experience.location}
                </span>
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>
                  {formatDate(experience.startDate)} — {formatDate(experience.endDate)}
                </span>
                <span class="text-gray-500">{calculateDuration(experience.startDate, experience.endDate)}</span>
              </div>

              <p class="text-gray-300 text-sm leading-relaxed">{experience.description}</p>

              <!-- Duration bar -->
              <div class="duration-track mt-4">
                <div
                  class="duration-fill {visibleExperiences[index] ? 'dur-animate' : ''}"
                  style="--dur-width: {durationPercent(experience)}%; background: {accentColors.experienceCompany}; transition-delay: {index * 120 + 300}ms"
                ></div>
              </div>
            </div>

            <!-- Expandable content -->
            <div class="expandable" style="max-height: {expandedExperiences[index] ? '600px' : '0'}">
              <div class="px-6 pb-4 space-y-4">
                <div>
                  <h4 class="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{$t.experience.responsibilities}</h4>
                  <ul class="space-y-1.5">
                    {#each experience.responsibilities as responsibility}
                      <li class="text-gray-300 text-xs flex items-start gap-2">
                        <span class="mt-0.5 shrink-0" style="color: {accentColors.experienceCompany}">▹</span>
                        <span>{responsibility}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
                <div>
                  <h4 class="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{$t.experience.technologies}</h4>
                  <div class="flex flex-wrap gap-1.5">
                    {#each experience.technologies as tech, ti}
                      <span
                        class="tech-badge-exp text-xs px-2 py-0.5 rounded-full border"
                        style="border-color: {accentColors.experienceCompany}33; color: {accentColors.experienceCompany}; animation-delay: {ti * 40}ms"
                      >{tech}</span>
                    {/each}
                  </div>
                </div>
              </div>
            </div>

            <!-- Expand toggle -->
            <button
              on:click={() => toggleExperience(index)}
              class="expand-btn w-full py-3 px-6 flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-200 border-t border-gray-700/50 transition-colors"
            >
              {expandedExperiences[index] ? $t.experience.showLess : $t.experience.showMore}
              <svg
                xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"
                class="expand-chevron {expandedExperiences[index] ? 'chevron-up' : ''}"
              >
                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
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
          {#each projects.filter(p => p.featured) as project, fi}
            <article
              class="project-card featured bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden group"
              on:mousemove={(e) => handleProjectTilt(e, e.currentTarget)}
              on:mouseleave={(e) => resetProjectTilt(e.currentTarget)}
              style="transition: transform 0.15s ease, border-color 0.3s ease;"
            >
              <!-- Image with overlay -->
              <div class="project-image-container relative h-56 bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden">
                {#if project.image}
                  <img
                    src={project.image}
                    alt={project.title}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    on:error={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                {/if}

                <!-- Status badge -->
                <div class="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                  {#if project.status === 'active' || project.status === 'in-progress'}
                    <span class="active-dot"></span>
                  {/if}
                  <span class="{statusColors[project.status]} px-3 py-1 rounded-full text-white text-xs font-semibold">
                    {$t.projects.status[project.status]}
                  </span>
                </div>

                <!-- Hover overlay -->
                <div class="proj-overlay absolute inset-0 flex flex-col justify-end p-5">
                  <p class="text-gray-200 text-sm leading-relaxed mb-3 line-clamp-4">{project.longDescription}</p>
                  <div class="flex gap-2">
                    {#if project.githubUrl}
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-200 text-xs transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                        Code
                      </a>
                    {/if}
                    {#if project.liveUrl}
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs transition-colors"
                        style="background: var(--red)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/><path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/></svg>
                        Live Demo
                      </a>
                    {/if}
                  </div>
                </div>
              </div>

              <!-- Static card content (always visible) -->
              <div class="p-6">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="text-xl font-bold text-gray-200">{project.title}</h3>
                  <span class="text-gray-500 text-sm font-mono">{project.year}</span>
                </div>
                <p class="text-gray-400 text-sm mb-4">{project.description}</p>
                <div class="flex flex-wrap gap-1.5">
                  {#each project.technologies as tech}
                    <span class="tech-tag bg-gray-700/50 px-2 py-0.5 rounded-full text-xs text-gray-400 border border-gray-600/50">{tech}</span>
                  {/each}
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
        {#each projects as project, pi}
          <article
            class="project-card bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden flex flex-col {visibleProjects[pi] ? 'proj-visible' : ''}"
            style="--stagger: {pi * 80}ms"
            bind:this={projectRefs[pi]}
          >
            <!-- Image -->
            <div class="project-image-container-small relative h-40 bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden">
              {#if project.image}
                <img src={project.image} alt={project.title}
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  on:error={(e) => { e.currentTarget.style.display='none'; }} />
              {/if}
              <!-- Status -->
              <div class="absolute top-3 right-3 flex items-center gap-1">
                {#if project.status === 'active' || project.status === 'in-progress'}
                  <span class="active-dot"></span>
                {/if}
                <span class="{statusColors[project.status]} px-2 py-0.5 rounded-full text-white text-xs font-semibold">
                  {$t.projects.status[project.status]}
                </span>
              </div>
            </div>

            <div class="p-5 flex flex-col flex-1">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-bold text-gray-200 flex-1">{project.title}</h3>
                <span class="text-gray-500 text-xs font-mono ml-2">{project.year}</span>
              </div>
              <p class="text-gray-400 text-sm mb-4 flex-1">{project.description}</p>
              <div class="flex flex-wrap gap-1.5 mb-4">
                {#each project.technologies.slice(0, 3) as tech, ti}
                  <span class="tech-tag-sm bg-gray-700/50 px-2 py-0.5 rounded-full text-xs text-gray-400" style="animation-delay: {ti * 50}ms">{tech}</span>
                {/each}
                {#if project.technologies.length > 3}
                  <span class="bg-gray-700/50 px-2 py-0.5 rounded-full text-xs text-gray-500">+{project.technologies.length - 3}</span>
                {/if}
              </div>
              <div class="flex gap-2 mt-auto">
                {#if project.githubUrl}
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-all text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                    Code
                  </a>
                {/if}
                {#if project.liveUrl}
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-white transition-all text-xs"
                    style="background: var(--red)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/><path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/></svg>
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
  /* ── Hero ──────────────────────────────────────────── */
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
  @media (min-width: 768px)  { .titles { font-size: 6rem; } }
  @media (min-width: 1024px) { .titles { font-size: 8rem; } }
  @media (min-width: 1280px) { .titles { font-size: 10rem; } }

  .scroll-button {
    border: 1px solid var(--red);
    transition: all 500ms ease-in-out;
  }
  .scroll-button:hover {
    transform: scale(1.1) rotate(360deg);
    border: 1px solid #FFF;
  }
  .scroll-button:hover img { filter: brightness(0) invert(1); }

  /* ── About ─────────────────────────────────────────── */
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
    background: linear-gradient(to right, transparent 0%, transparent 50%, #E2211C 50%, #E2211C 100%);
    background-size: 200% 100%;
    background-position: 0% 0%;
    transition: background-position 0.6s ease-in-out;
    overflow: hidden;
    margin-top: 20px;
  }
  .contact-button:hover { background-position: 100% 0%; transform: scale(1.05); }
  .intro {
    font-size: clamp(1.4rem, 3vw, 2rem);
    line-height: 1.5;
    margin: 0 auto 2rem;
    max-width: 40ch;
    color: #E5E7EB;
    font-weight: 500;
  }
  .name-hover {
    background: linear-gradient(to right, #FFF 0%, #FFF 50%, #E2211C 50%, #E2211C 100%);
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

  /* ── Experience Timeline ────────────────────────────── */
  .experience-section { padding-top: 80px; }

  .timeline-container { padding: 0 1rem; }

  .timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(237,27,46,0.3) 10%, rgba(237,27,46,0.3) 90%, transparent);
    transform: translateX(-50%);
  }

  @media (max-width: 767px) {
    .timeline-line { left: 16px; }
  }

  .timeline-item {
    position: relative;
    width: calc(50% - 2.5rem);
    margin-bottom: 3rem;
    opacity: 0;
    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .tl-left  { transform: translateX(-48px); }
  .tl-right { transform: translateX(48px); margin-left: auto; }
  .tl-visible { opacity: 1; transform: translateX(0) !important; }

  @media (max-width: 767px) {
    .timeline-item, .tl-left, .tl-right {
      width: calc(100% - 3rem);
      margin-left: 3rem !important;
      transform: translateX(30px);
    }
    .tl-visible { transform: translateX(0) !important; }
  }

  /* Dot */
  .timeline-dot {
    position: absolute;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    top: 22px;
    z-index: 2;
  }
  .tl-left  .timeline-dot { right: -2.85rem; }
  .tl-right .timeline-dot { left: -2.85rem; }
  @media (max-width: 767px) {
    .timeline-dot { left: -2.85rem !important; right: auto !important; }
  }

  .dot-ring {
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    border: 2px solid;
    animation: dotPulse 2.2s ease-out infinite;
  }
  @keyframes dotPulse {
    0%   { opacity: 0.9; transform: scale(1); }
    100% { opacity: 0; transform: scale(2.8); }
  }

  /* Card */
  .exp-card {
    background: rgba(31, 34, 41, 0.6);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.07);
    overflow: hidden;
    position: relative;
    transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  }
  .exp-card:hover {
    border-color: var(--accent, var(--red));
    box-shadow: 0 8px 32px -8px color-mix(in srgb, var(--accent, var(--red)) 30%, transparent);
    transform: translateY(-3px);
  }
  .exp-stripe {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 3px;
  }

  /* Duration bar */
  .duration-track {
    height: 3px;
    background: rgba(255,255,255,0.06);
    border-radius: 9999px;
    overflow: hidden;
  }
  .duration-fill {
    height: 100%;
    border-radius: 9999px;
    width: 0;
    transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .dur-animate { width: var(--dur-width); }

  /* Expandable */
  .expandable {
    overflow: hidden;
    transition: max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .tech-badge-exp {
    background: rgba(255,255,255,0.04);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .tech-badge-exp:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }

  .expand-btn { background: rgba(255,255,255,0.02); transition: background 0.2s ease; }
  .expand-btn:hover { background: rgba(255,255,255,0.05); }

  .expand-chevron { transition: transform 0.3s ease; }
  .chevron-up { transform: rotate(180deg); }

  /* ── Skills ─────────────────────────────────────────── */
  .skills-section { padding-top: 80px; }

  .skill-card-entrance {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--entrance-delay, 0ms),
                transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--entrance-delay, 0ms),
                border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .skill-entrance-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .category-card {
    position: relative;
    transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  }
  .category-card:hover {
    transform: translateY(-4px);
    border: 1px solid var(--hover-border-color);
    box-shadow: 0 8px 25px -5px rgba(255, 62, 0, 0.1);
  }

  /* Cursor glow */
  .cursor-glow {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(255,62,0,0.07) 0%,
      transparent 55%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  .category-card:hover .cursor-glow { opacity: 1; }

  /* Skill bars */
  .skill-track {
    height: 5px;
    background: rgba(255,255,255,0.07);
    border-radius: 9999px;
    overflow: hidden;
  }
  .skill-fill {
    height: 100%;
    border-radius: 9999px;
    width: 0;
    transition: width 1.1s cubic-bezier(0.16, 1, 0.3, 1) var(--bar-delay, 0ms);
    box-shadow: 0 0 8px currentColor;
  }
  .skill-fill-animate { width: var(--level); }

  .chart-wrapper {
    position: relative;
    overflow: hidden;
  }

  /* ── Projects ────────────────────────────────────────── */
  .projects-section { padding-top: 80px; }

  /* Entrance animation */
  .project-card {
    opacity: 0;
    transform: translateY(36px);
    transition:
      opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0ms),
      transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0ms),
      border-color 0.3s ease,
      box-shadow 0.3s ease;
  }
  .proj-visible { opacity: 1; transform: translateY(0); }

  .project-card:hover {
    border-color: var(--red);
    box-shadow: 0 8px 28px -8px rgba(237,27,46,0.25);
  }

  /* Featured card tilt handled inline */
  .project-card.featured {
    transform-style: preserve-3d;
    will-change: transform;
    opacity: 1; /* featured cards always visible */
    transform: none;
  }

  /* Glassmorphism overlay */
  .proj-overlay {
    background: linear-gradient(to top, rgba(20,22,28,0.97) 0%, rgba(20,22,28,0.7) 60%, transparent 100%);
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.35s ease, transform 0.35s ease;
    pointer-events: none;
  }
  .group:hover .proj-overlay {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  /* Active dot */
  .active-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    background: #22c55e;
    border-radius: 50%;
    animation: activeBlink 1.6s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes activeBlink {
    0%, 100% { opacity: 1; box-shadow: 0 0 4px #22c55e; }
    50% { opacity: 0.25; box-shadow: none; }
  }

  /* Tech tags */
  .tech-tag, .tech-tag-sm {
    transition: all 0.2s ease;
  }
  .tech-tag:hover, .tech-tag-sm:hover {
    background-color: rgba(237,27,46,0.15);
    border-color: rgba(237,27,46,0.4);
    color: #fff;
    transform: translateY(-2px);
  }

  /* ── Publications (unchanged) ────────────────────────── */
  .publications-section { padding-top: 80px; }
  .publication-card {
    transition: all 0.3s ease;
  }
  .publication-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px -5px var(--publication-hover-color);
    border-color: var(--publication-hover-color);
  }
  .publication-title-link:hover { color: var(--publication-title-color); }
  .article-thumbnail { transition: all 0.3s ease; }
  .article-thumbnail img { transition: transform 0.5s ease; }
  .read-more-link svg { transition: transform 0.3s ease; }
  .read-more-link:hover svg { transform: translateX(4px); }
  .tag { transition: all 0.3s ease; }
  .tag:hover { background-color: rgba(255,62,0,0.2); color: var(--red); }

  /* ── Utilities ───────────────────────────────────────── */
  .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
  .red-decoration { background-color: var(--red); }
</style>