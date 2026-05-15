<script lang="ts">
  import { onMount } from 'svelte';
  // @ts-ignore
  import Circles from '$lib/components/Circles.svelte';
  import type { PageData } from './$types';
  import { t, currentLanguage } from '$lib/i18n/store';
  import { skills, experiences as experiencesData, projects as projectsData } from '$lib/constants';
  import { type MediumArticle } from '$lib/services';
  import { getRandomBrandColor } from '$lib/utils/colorRandomizer';

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

  $: featuredProject = projects.find(p => p.featured);
  $: secondaryProjects = projects.filter(p => p !== featuredProject);

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

  // Random colors for decorative elements
  const accentColors = {
    experienceCompany: getRandomBrandColor(),
    publicationHover: getRandomBrandColor(),
  };

  onMount(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor && anchor.hash) {
        const targetId = anchor.hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();
          smoothScrollTo(targetId);
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

      const elementTop = rect.top;
      const elementBottom = rect.bottom;

      const startTrigger = windowHeight * 0.8;
      const endTrigger = windowHeight * 0.2;

      let progress = 0;

      if (elementBottom <= startTrigger && elementTop >= endTrigger) {
        const totalDistance = startTrigger - endTrigger;
        const currentDistance = startTrigger - elementBottom;
        progress = Math.max(0, Math.min(100, (currentDistance / totalDistance) * 100));
      } else if (elementTop < endTrigger) {
        progress = 100;
      }

      nameScrollProgress = progress;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('scroll', handleScroll);
    };
  });

  // Group skills by category with weighted levels
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  // Weight: level >= 80 → 3, 60-79 → 2, <60 → 1
  function skillWeight(level: number): 1 | 2 | 3 {
    if (level >= 80) return 3;
    if (level >= 60) return 2;
    return 1;
  }

  // Format date (locale-aware)
  function formatDate(dateString: string | null): string {
    if (!dateString) return $t.experience.current;
    const date = new Date(dateString);
    const locale = $currentLanguage === 'es' ? 'es-AR' : 'en-US';
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'short' });
  }

  function formatPublicationDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Extract clean text from HTML description (SSR-safe)
  function getExcerpt(html: string, maxLength: number = 200): string {
    const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Extract thumbnail from description or use default (SSR-safe)
  function getThumbnail(article: MediumArticle): string {
    if (article.thumbnail) return article.thumbnail;
    const imgMatch = article.description.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : '/icons/logo.png';
  }

  // Calculate read time based on description length (SSR-safe)
  function calculateReadTime(description: string): string {
    const wordsPerMinute = 200;
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

  // Extract pull quote from article description
  function getPullQuote(html: string): string {
    const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    const sentence = text.split(/[.!?]/)[0];
    return sentence.length > 20 ? sentence + '.' : text.substring(0, 120) + '\u2026';
  }

  // Timeline helpers for experience section
  const TIMELINE_START = 2018;
  const TIMELINE_END = 2026;
  function yearToPct(dateStr: string): number {
    const [y, m] = dateStr.split('-').map(Number);
    return ((y - TIMELINE_START) + (m - 1) / 12) / (TIMELINE_END - TIMELINE_START);
  }

  // Card rotations
  const CARD_ROTATIONS = [-0.6, 0.3, -0.4, 0.5, -0.3, 0.6, -0.2, 0.4];
  const TICKET_ROTATIONS = [-1.5, 1, -0.5, 1.5, -1, 0.8];
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
<section id="skills" style="background: #F8C6A0; color: #1C1A2E; padding: 120px 64px 140px; position: relative; overflow: hidden;">
  <!-- Halftone overlay -->
  <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;mix-blend-mode:multiply;" aria-hidden="true">
    <defs>
      <pattern id="ht-skills" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.7" fill="#E0524A" opacity="0.18"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ht-skills)"/>
  </svg>

  <!-- Decorative blob -->
  <svg style="position:absolute;top:-120px;right:-120px;width:540px;height:540px;z-index:0;pointer-events:none;" viewBox="0 0 320 320" aria-hidden="true">
    <path d="M163,28 C220,28 280,80 280,142 C280,214 220,278 152,278 C84,278 28,224 32,156 C36,90 90,28 163,28 Z" fill="#E0524A" opacity="0.28"/>
  </svg>

  <div style="position:relative;z-index:1;max-width:1152px;margin:0 auto;">
    <!-- Eyebrow -->
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:28px;">
      <span style="background:#1C1A2E;color:white;padding:4px 10px;border-radius:999px;font-family:var(--font-mono);font-size:11px;letter-spacing:1.2px;">{$t.skills.eyebrow}</span>
      <span style="flex:1;height:1px;background:#1C1A2E;opacity:0.3;"></span>
      <span style="font-family:var(--font-mono);font-size:10px;color:#1C1A2E;opacity:0.6;letter-spacing:1.4px;">{$t.skills.palette}</span>
    </div>

    <!-- Big heading -->
    <h2 style="font-family:var(--font-display);font-weight:400;font-size:clamp(72px,10vw,160px);line-height:0.88;letter-spacing:-3px;margin:0 0 32px;color:#1C1A2E;">
      <span style="position:relative;display:inline-block;">
        <span style="position:absolute;left:3px;top:2px;color:#E0524A;mix-blend-mode:multiply;opacity:0.8;pointer-events:none;" aria-hidden="true">{$t.skills.headingLine1}</span>
        <span style="position:relative;">{$t.skills.headingLine1}</span>
      </span><br/>
      <span style="position:relative;display:inline-block;font-style:italic;">
        <span style="position:absolute;left:3px;top:2px;color:#E0524A;mix-blend-mode:multiply;opacity:0.8;pointer-events:none;font-style:italic;" aria-hidden="true">{$t.skills.headingItalic}</span>
        <span style="position:relative;">{$t.skills.headingItalic}</span>
      </span> {$t.skills.headingRest}
    </h2>
    <p style="font-family:var(--font-body);font-size:17px;line-height:1.5;max-width:520px;color:#1C1A2E;opacity:0.75;margin:0 0 56px;">
      {$t.skills.headingSubtitle}
    </p>

    <!-- Chip cloud grid -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
      {#each Object.entries(skillsByCategory) as [category, categorySkills], i}
        <div style="background:#FFF5E6;color:#1C1A2E;padding:20px 22px 22px;border-radius:4px;box-shadow:4px 4px 0 #1C1A2E;border:1.5px solid #1C1A2E;transform:rotate({CARD_ROTATIONS[i] || 0}deg);position:relative;overflow:hidden;">
          <!-- mini halftone inside card -->
          <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;mix-blend-mode:multiply;" aria-hidden="true">
            <defs>
              <pattern id="ht-card-{i}" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.1" fill="#E0524A" opacity="0.08"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ht-card-{i})"/>
          </svg>
          <div style="position:relative;z-index:1;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px;">
              <h3 style="font-family:var(--font-display);font-size:28px;font-weight:400;margin:0;letter-spacing:-0.3px;">{category}</h3>
              <span style="font-family:var(--font-mono);font-size:10px;opacity:0.5;">nº{String(i+1).padStart(2,'0')}</span>
            </div>
            <div style="display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px;">
              {#each categorySkills as skill}
                {@const w = skillWeight(skill.level)}
                <span style="
                  font-family:{w === 3 ? 'var(--font-display)' : 'var(--font-body)'};
                  font-weight:{w === 3 ? 400 : 500};
                  font-style:{w === 2 ? 'italic' : 'normal'};
                  font-size:{w === 3 ? '26px' : w === 2 ? '18px' : '15px'};
                  line-height:1.1;
                  color:{w === 3 ? '#1C1A2E' : 'rgba(28,26,46,0.65)'};
                ">{skill.name}</span>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Experience Section -->
<section id="trabajos" style="background:#B8DCC9;color:#1C1A2E;padding:120px 64px 140px;position:relative;overflow:hidden;">
  <!-- Halftone overlay -->
  <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;mix-blend-mode:multiply;" aria-hidden="true">
    <defs>
      <pattern id="ht-exp" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
        <circle cx="2.5" cy="2.5" r="1.4" fill="#1F5D6B" opacity="0.18"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ht-exp)"/>
  </svg>

  <div style="position:relative;z-index:1;max-width:1152px;margin:0 auto;">
    <!-- Eyebrow -->
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:28px;">
      <span style="background:#1C1A2E;color:white;padding:4px 10px;border-radius:999px;font-family:var(--font-mono);font-size:11px;letter-spacing:1.2px;">{$t.experience.eyebrow}</span>
      <span style="flex:1;height:1px;background:#1C1A2E;opacity:0.3;"></span>
      <span style="font-family:var(--font-mono);font-size:10px;color:#1C1A2E;opacity:0.6;letter-spacing:1.4px;">{$t.experience.palette}</span>
    </div>

    <!-- Big heading -->
    <h2 style="font-family:var(--font-display);font-weight:400;font-size:clamp(64px,10vw,160px);line-height:0.88;letter-spacing:-3px;margin:0 0 56px;color:#1C1A2E;">
      {$t.experience.headingLine1} <span style="position:relative;display:inline-block;font-style:italic;">
        <span style="position:absolute;left:3px;top:2px;color:#1F5D6B;mix-blend-mode:multiply;opacity:0.8;pointer-events:none;font-style:italic;" aria-hidden="true">{$t.experience.headingItalic1}</span>
        <span style="position:relative;">{$t.experience.headingItalic1}</span>
      </span>,<br/>
      {$t.experience.headingLine2} <span style="position:relative;display:inline-block;font-style:italic;">
        <span style="position:absolute;left:3px;top:2px;color:#1F5D6B;mix-blend-mode:multiply;opacity:0.8;pointer-events:none;font-style:italic;" aria-hidden="true">{$t.experience.headingItalic2}</span>
        <span style="position:relative;">{$t.experience.headingItalic2}</span>
      </span>.
    </h2>

    <!-- Stats row -->
    <div style="display:flex;gap:48px;margin-bottom:56px;flex-wrap:wrap;">
      {#each [{label:$t.experience.statYears,value:'8'},{label:$t.experience.statCompanies,value:String(new Set(experiences.map(e=>e.company)).size)},{label:$t.experience.statRemote,value:$t.experience.remoteValue}] as stat}
        <div>
          <div style="font-family:var(--font-mono);font-size:11px;color:#1C1A2E;opacity:0.6;letter-spacing:1.4px;text-transform:uppercase;">{stat.label}</div>
          <div style="font-family:var(--font-display);font-size:72px;color:#1F5D6B;line-height:1;margin-top:2px;">{stat.value}</div>
        </div>
      {/each}
    </div>

    <!-- Timeline rail -->
    <div style="position:relative;min-height:360px;margin-bottom:80px;">
      <!-- Track -->
      <div style="position:absolute;top:180px;left:0;right:0;height:6px;background:#1C1A2E;border-radius:3px;"></div>
      <!-- Year ticks -->
      {#each [2018,2019,2020,2021,2022,2023,2024,2025,2026] as yr, yi}
        {@const xPct = (yi / 8) * 100}
        <div style="position:absolute;left:{xPct}%;top:186px;transform:translateX(-50%);">
          <div style="width:2px;height:10px;background:#1C1A2E;margin:0 auto;"></div>
          <div style="font-family:var(--font-mono);font-size:11px;color:#1C1A2E;margin-top:4px;font-weight:600;white-space:nowrap;">{yr}</div>
        </div>
      {/each}
      <!-- Job tickets -->
      {#each experiences as exp, i}
        {@const sx = yearToPct(exp.startDate) * 100}
        {@const ex = yearToPct(exp.endDate || '2026-05') * 100}
        {@const mx = (sx + ex) / 2}
        {@const above = i % 2 === 0}
        <!-- Duration bar segment -->
        <div style="position:absolute;top:174px;left:{sx}%;width:{Math.max(ex-sx,2)}%;height:18px;background:{i===0?'#1F5D6B':'#EAF7EE'};border:2px solid #1C1A2E;border-radius:4px;"></div>
        <!-- Connector -->
        <div style="position:absolute;left:{mx}%;top:{above?100:192}px;width:2px;height:80px;background:#1C1A2E;transform:translateX(-50%);"></div>
        <!-- Ticket -->
        <div style="position:absolute;left:{mx}%;top:{above?0:240}px;transform:translateX(-50%) rotate({TICKET_ROTATIONS[i]||0}deg);background:{i===0?'#1F5D6B':'#EAF7EE'};border:2px solid #1C1A2E;padding:8px 12px;box-shadow:3px 3px 0 #1C1A2E;white-space:nowrap;max-width:180px;z-index:2;">
          <div style="font-family:var(--font-display);font-size:16px;font-weight:400;line-height:1;color:{i===0?'#FFF8EE':'#1C1A2E'};">{exp.company}</div>
          <div style="font-family:var(--font-mono);font-size:10px;margin-top:2px;opacity:0.7;color:{i===0?'#FFF8EE':'#1C1A2E'};">{exp.location} · {calculateDuration(exp.startDate, exp.endDate)}</div>
        </div>
      {/each}
    </div>

    <!-- Detail cards grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      {#each experiences as exp, i}
        <article style="background:{i===0?'#1F5D6B':'#EAF7EE'};color:{i===0?'#FFF8EE':'#1C1A2E'};border:2px solid #1C1A2E;padding:20px 24px;box-shadow:5px 5px 0 #1C1A2E;position:relative;overflow:hidden;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
            <span style="font-family:var(--font-mono);font-size:11px;letter-spacing:1px;opacity:0.8;">{formatDate(exp.startDate)} — {formatDate(exp.endDate)}</span>
            {#if !exp.endDate || exp.current}
              <span style="background:{i===0?'#FFF8EE':'#1F5D6B'};color:{i===0?'#1F5D6B':'#FFF8EE'};padding:2px 8px;border-radius:999px;font-family:var(--font-mono);font-size:10px;font-weight:600;">{$t.experience.now}</span>
            {/if}
          </div>
          <h3 style="font-family:var(--font-display);font-weight:400;font-size:30px;margin:0;letter-spacing:-0.5px;line-height:1.05;">{exp.position}</h3>
          <div style="font-family:var(--font-body);font-weight:600;font-size:14px;margin-top:4px;opacity:0.9;">{exp.company} · {exp.location}</div>
          <p style="font-family:var(--font-body);font-size:14px;line-height:1.45;margin:12px 0 0;opacity:0.85;">{exp.responsibilities[0]}</p>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:14px;">
            {#each exp.technologies.slice(0,5) as tech}
              <span style="font-family:var(--font-mono);font-size:10px;padding:2px 6px;border:1.5px solid {i===0?'#FFF8EE':'#1C1A2E'};border-radius:3px;">{tech}</span>
            {/each}
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<!-- Projects Section -->
<section id="projects" style="background:#D6C9E2;color:#1C1A2E;padding:120px 64px 140px;position:relative;overflow:hidden;">
  <!-- Halftone overlay -->
  <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;mix-blend-mode:multiply;" aria-hidden="true">
    <defs>
      <pattern id="ht-proj" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
        <circle cx="2.5" cy="2.5" r="1.4" fill="#5D3FD3" opacity="0.14"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ht-proj)"/>
  </svg>

  <div style="position:relative;z-index:1;max-width:1152px;margin:0 auto;">
    <!-- Eyebrow -->
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:28px;">
      <span style="background:#1C1A2E;color:white;padding:4px 10px;border-radius:999px;font-family:var(--font-mono);font-size:11px;letter-spacing:1.2px;">{$t.projects.eyebrow}</span>
      <span style="flex:1;height:1px;background:#1C1A2E;opacity:0.3;"></span>
      <span style="font-family:var(--font-mono);font-size:10px;color:#1C1A2E;opacity:0.6;letter-spacing:1.4px;">{$t.projects.palette}</span>
    </div>

    <!-- Big heading -->
    <h2 style="font-family:var(--font-display);font-weight:400;font-size:clamp(64px,10vw,160px);line-height:0.88;letter-spacing:-3px;margin:0 0 56px;color:#1C1A2E;">
      <span style="position:relative;display:inline-block;">
        <span style="position:absolute;left:3px;top:2px;color:#5D3FD3;mix-blend-mode:multiply;opacity:0.8;pointer-events:none;" aria-hidden="true">{$t.projects.headingWord1}</span>
        <span style="position:relative;">{$t.projects.headingWord1}</span>
      </span>
      <span style="position:relative;display:inline-block;font-style:italic;">
        <span style="position:absolute;left:3px;top:2px;color:#5D3FD3;mix-blend-mode:multiply;opacity:0.8;pointer-events:none;font-style:italic;" aria-hidden="true">{$t.projects.headingItalic}</span>
        <span style="position:relative;">{$t.projects.headingItalic}</span>
      </span><br/>
      {$t.projects.headingWord2} <span style="position:relative;display:inline-block;">
        <span style="position:absolute;left:3px;top:2px;color:#5D3FD3;mix-blend-mode:multiply;opacity:0.8;pointer-events:none;" aria-hidden="true">{$t.projects.headingItalic2}</span>
        <span style="position:relative;">{$t.projects.headingItalic2}</span>
      </span>.
    </h2>

    <!-- Featured project -->
    {#if featuredProject}
      <div style="background:#FFF8EA;border:2px solid #1C1A2E;padding:20px;box-shadow:10px 10px 0 #1C1A2E;display:grid;grid-template-columns:1.5fr 1fr;gap:28px;margin-bottom:56px;align-items:start;">
        <!-- Browser mock -->
        <div style="border:2px solid #1C1A2E;border-radius:4px;overflow:hidden;">
          <!-- Browser chrome -->
          <div style="background:#1C1A2E;padding:8px 12px;display:flex;align-items:center;gap:8px;">
            <span style="width:10px;height:10px;border-radius:50%;background:#E0524A;display:inline-block;"></span>
            <span style="width:10px;height:10px;border-radius:50%;background:#FBE5A0;display:inline-block;"></span>
            <span style="width:10px;height:10px;border-radius:50%;background:#B8DCC9;display:inline-block;"></span>
            <span style="flex:1;background:rgba(255,255,255,0.1);border-radius:3px;padding:3px 8px;font-family:var(--font-mono);font-size:10px;color:rgba(255,255,255,0.7);margin-left:8px;">{featuredProject.liveUrl || featuredProject.title}</span>
          </div>
          <!-- Screenshot area with halftone + riso name -->
          <div style="height:320px;background:#FFF8EA;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;">
            <svg style="position:absolute;inset:0;width:100%;height:100%;" aria-hidden="true">
              <defs>
                <pattern id="ht-feat" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="1.6" fill="#5D3FD3" opacity="0.35"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ht-feat)"/>
            </svg>
            {#if featuredProject.image}
              <img src={featuredProject.image} alt={featuredProject.title} style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;opacity:0.7;"
                on:error={(e) => { e.currentTarget.style.display='none'; }}/>
            {/if}
            <div style="position:relative;text-align:center;padding:24px;">
              <div style="position:relative;display:inline-block;">
                <div style="position:absolute;top:3px;left:4px;color:#5D3FD3;mix-blend-mode:multiply;font-family:var(--font-display);font-size:clamp(36px,5vw,72px);line-height:0.9;letter-spacing:-1.5px;">{featuredProject.title}</div>
                <div style="position:relative;color:#1C1A2E;font-family:var(--font-display);font-size:clamp(36px,5vw,72px);line-height:0.9;letter-spacing:-1.5px;">{featuredProject.title}</div>
              </div>
              {#if featuredProject.liveUrl}
                <div style="margin-top:14px;font-family:var(--font-mono);font-size:11px;background:#1C1A2E;color:#FFF8EA;padding:4px 10px;border-radius:999px;display:inline-block;">↗ {featuredProject.liveUrl.replace('https://','')}</div>
              {/if}
            </div>
          </div>
        </div>
        <!-- Detail -->
        <div style="padding:8px 4px;">
          <span style="font-family:var(--font-mono);font-size:11px;color:#FFF8EA;background:#5D3FD3;padding:4px 10px;border-radius:999px;letter-spacing:1.2px;">{$t.projects.featuredBadge}</span>
          <h3 style="font-family:var(--font-display);font-weight:400;font-size:clamp(32px,4vw,56px);margin:14px 0 8px;letter-spacing:-1px;line-height:1;color:#1C1A2E;">{featuredProject.title}</h3>
          <div style="font-family:var(--font-mono);font-size:11px;color:#1C1A2E;opacity:0.6;margin-bottom:14px;">{featuredProject.year} · {featuredProject.status.toUpperCase()}</div>
          <p style="font-family:var(--font-display);font-style:italic;font-size:22px;line-height:1.25;margin:0 0 12px;color:#1C1A2E;">{featuredProject.description}</p>
          <p style="font-family:var(--font-body);font-size:14.5px;line-height:1.5;color:#1C1A2E;opacity:0.8;margin:0 0 18px;">{featuredProject.longDescription}</p>
          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:18px;">
            {#each featuredProject.technologies as tech}
              <span style="font-family:var(--font-mono);font-size:11px;padding:3px 8px;border:1.5px solid #1C1A2E;border-radius:3px;background:#FFF8EA;">{tech}</span>
            {/each}
          </div>
          {#if featuredProject.liveUrl}
            <a href={featuredProject.liveUrl} target="_blank" rel="noopener noreferrer" style="display:inline-block;font-family:var(--font-mono);font-size:11px;background:#1C1A2E;color:#FFF8EA;padding:8px 16px;border-radius:3px;text-decoration:none;letter-spacing:1px;">{$t.projects.visitSite}</a>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Secondary grid -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
      {#each secondaryProjects as proj, i}
        <article style="background:#FFF8EA;border:2px solid #1C1A2E;box-shadow:5px 5px 0 #1C1A2E;padding:14px;transform:rotate({CARD_ROTATIONS[i]||0}deg);">
          <!-- Mini browser mock -->
          <div style="border:1.5px solid #1C1A2E;border-radius:3px;overflow:hidden;margin-bottom:14px;">
            <div style="background:#1C1A2E;padding:5px 8px;display:flex;align-items:center;gap:5px;">
              <span style="width:7px;height:7px;border-radius:50%;background:#E0524A;display:inline-block;"></span>
              <span style="width:7px;height:7px;border-radius:50%;background:#FBE5A0;display:inline-block;"></span>
              <span style="width:7px;height:7px;border-radius:50%;background:#B8DCC9;display:inline-block;"></span>
              <span style="flex:1;background:rgba(255,255,255,0.1);border-radius:2px;padding:2px 6px;font-family:var(--font-mono);font-size:9px;color:rgba(255,255,255,0.6);margin-left:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{proj.liveUrl ? proj.liveUrl.replace('https://','') : proj.title}</span>
            </div>
            <div style="height:160px;background:#FFF0F5;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;">
              <svg style="position:absolute;inset:0;width:100%;height:100%;" aria-hidden="true">
                <defs>
                  <pattern id="ht-p{i}" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                    <circle cx="3" cy="3" r="1.6" fill="#5D3FD3" opacity="0.25"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ht-p{i})"/>
              </svg>
              {#if proj.image}
                <img src={proj.image} alt={proj.title} style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;opacity:0.65;"
                  on:error={(e) => { e.currentTarget.style.display='none'; }}/>
              {/if}
              <div style="position:relative;text-align:center;padding:12px;">
                <div style="position:relative;display:inline-block;">
                  <div style="position:absolute;top:2px;left:3px;color:#5D3FD3;mix-blend-mode:multiply;font-family:var(--font-display);font-size:clamp(24px,3vw,40px);line-height:0.9;letter-spacing:-1px;">{proj.title}</div>
                  <div style="position:relative;color:#1C1A2E;font-family:var(--font-display);font-size:clamp(24px,3vw,40px);line-height:0.9;letter-spacing:-1px;">{proj.title}</div>
                </div>
              </div>
            </div>
          </div>
          <div style="padding:0 6px 6px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
              <h4 style="font-family:var(--font-display);font-weight:400;font-size:24px;margin:0;letter-spacing:-0.5px;color:#1C1A2E;">{proj.title}</h4>
              <span style="font-family:var(--font-mono);font-size:10px;opacity:0.5;color:#1C1A2E;">{proj.year}</span>
            </div>
            <p style="font-family:var(--font-body);font-size:12.5px;color:#1C1A2E;opacity:0.75;margin:0 0 8px;line-height:1.4;">{proj.description}</p>
            <div style="display:flex;flex-wrap:wrap;gap:3px;">
              {#each proj.technologies.slice(0,3) as tech}
                <span style="font-family:var(--font-mono);font-size:10px;padding:1.5px 6px;border:1px solid #1C1A2E;border-radius:3px;color:#1C1A2E;">{tech}</span>
              {/each}
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<!-- Publications Section -->
<section id="posts" style="background:#FBE5A0;color:#1C1A2E;padding:120px 64px 80px;position:relative;overflow:hidden;">
  <!-- Halftone overlay -->
  <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;mix-blend-mode:multiply;" aria-hidden="true">
    <defs>
      <pattern id="ht-pub" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.7" fill="#B5532A" opacity="0.14"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ht-pub)"/>
  </svg>

  <div style="position:relative;z-index:1;max-width:1152px;margin:0 auto;">
    <!-- Eyebrow -->
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:28px;">
      <span style="background:#1C1A2E;color:white;padding:4px 10px;border-radius:999px;font-family:var(--font-mono);font-size:11px;letter-spacing:1.2px;">{$t.posts.eyebrow}</span>
      <span style="flex:1;height:1px;background:#1C1A2E;opacity:0.3;"></span>
      <span style="font-family:var(--font-mono);font-size:10px;color:#1C1A2E;opacity:0.6;letter-spacing:1.4px;">{$t.posts.palette}</span>
    </div>

    <!-- Big heading -->
    <h2 style="font-family:var(--font-display);font-weight:400;font-size:clamp(64px,10vw,160px);line-height:0.88;letter-spacing:-3px;margin:0 0 56px;color:#1C1A2E;">
      <span style="position:relative;display:inline-block;">
        <span style="position:absolute;left:3px;top:2px;color:#B5532A;mix-blend-mode:multiply;opacity:0.8;pointer-events:none;" aria-hidden="true">{$t.posts.headingLine1}</span>
        <span style="position:relative;">{$t.posts.headingLine1}</span>
      </span>
      <span style="position:relative;display:inline-block;font-style:italic;">
        <span style="position:absolute;left:3px;top:2px;color:#B5532A;mix-blend-mode:multiply;opacity:0.8;pointer-events:none;font-style:italic;" aria-hidden="true">{$t.posts.headingItalic}</span>
        <span style="position:relative;">{$t.posts.headingItalic}</span>
      </span>.
    </h2>

    {#if mediumArticles.length > 0}
      <!-- Featured pull quote -->
      <div style="background:#FFF8EA;border:2.5px solid #1C1A2E;padding:48px 56px;margin-bottom:40px;box-shadow:8px 8px 0 #1C1A2E;position:relative;overflow:hidden;">
        <span style="position:absolute;top:-50px;left:20px;font-family:var(--font-display);font-size:280px;color:#B5532A;opacity:0.25;line-height:1;font-style:italic;">"</span>
        <div style="position:relative;display:grid;grid-template-columns:1fr 200px;gap:40px;align-items:center;">
          <p style="font-family:var(--font-display);font-style:italic;font-size:clamp(24px,3vw,44px);line-height:1.15;margin:0;letter-spacing:-0.6px;color:#1C1A2E;">{getPullQuote(mediumArticles[0].description)}</p>
          <div style="border-left:2px solid #1C1A2E;padding-left:20px;">
            <div style="font-family:var(--font-mono);font-size:10px;color:#1C1A2E;opacity:0.6;letter-spacing:1.2px;">{formatPublicationDate(mediumArticles[0].pubDate).toUpperCase()} · {calculateReadTime(mediumArticles[0].description)}</div>
            <div style="font-family:var(--font-display);font-size:22px;font-weight:400;margin-top:6px;line-height:1.1;color:#1C1A2E;">{mediumArticles[0].title}</div>
            <a href={mediumArticles[0].link} target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:14px;font-family:var(--font-mono);font-size:11px;background:#1C1A2E;color:#FFF8EA;padding:6px 12px;border-radius:3px;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">{$t.posts.readOnMedium}</a>
          </div>
        </div>
      </div>

      <!-- Secondary grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
        {#each mediumArticles.slice(1) as article, i}
          <article style="background:#FFF8EA;border:2px solid #1C1A2E;box-shadow:4px 4px 0 #1C1A2E;padding:24px 28px;position:relative;overflow:hidden;transform:rotate({[-0.3,0.4,-0.2,0.3,-0.4][i]||0}deg);">
            <span style="position:absolute;top:8px;right:20px;font-family:var(--font-display);font-size:96px;color:#B5532A;opacity:0.4;line-height:1;font-style:italic;">"</span>
            <div style="font-family:var(--font-mono);font-size:10px;color:#1C1A2E;opacity:0.6;letter-spacing:1.2px;margin-bottom:14px;">{formatPublicationDate(article.pubDate).toUpperCase()} · {calculateReadTime(article.description)}</div>
            <p style="font-family:var(--font-display);font-style:italic;font-size:22px;line-height:1.3;margin:0 0 18px;letter-spacing:-0.2px;color:#1C1A2E;max-width:85%;position:relative;">{getPullQuote(article.description)}</p>
            <div style="border-top:1.5px dashed #1C1A2E;padding-top:12px;">
              <div style="font-family:var(--font-body);font-size:14px;font-weight:600;color:#1C1A2E;">{article.title}</div>
              <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:6px;">
                <span style="font-family:var(--font-mono);font-size:10px;opacity:0.6;color:#1C1A2E;">{article.categories?.slice(0,3).map(c => '#'+c).join(' ')}</span>
                <a href={article.link} target="_blank" rel="noopener noreferrer" style="font-family:var(--font-mono);font-size:10px;color:#B5532A;text-decoration:none;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #B5532A;">{$t.posts.readLink}</a>
              </div>
            </div>
          </article>
        {/each}
      </div>
    {:else}
      <div style="text-align:center;padding:80px 0;font-family:var(--font-body);font-size:18px;color:#1C1A2E;opacity:0.5;">{$t.posts.emptyState}</div>
    {/if}

    <!-- Footer -->
    <div style="margin-top:100px;padding-top:24px;border-top:2px solid #1C1A2E;display:flex;justify-content:space-between;align-items:baseline;">
      <div style="font-family:var(--font-display);font-weight:400;font-size:40px;font-style:italic;letter-spacing:-0.6px;color:#1C1A2E;">{$t.footer.name}</div>
      <div style="font-family:var(--font-mono);font-size:11px;color:#1C1A2E;opacity:0.7;letter-spacing:0.6px;">{$t.footer.copy}</div>
    </div>
  </div>
</section>

<style>
  /* ── Hero ── */
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

  /* ── About ── */
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

  /* ── Responsive adjustments for riso sections ── */
  @media (max-width: 768px) {
    section[id="skills"],
    section[id="trabajos"],
    section[id="projects"],
    section[id="posts"] {
      padding: 80px 24px 100px !important;
    }
  }
</style>