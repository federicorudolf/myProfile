<script lang="ts">
	import { page } from '$app/stores';
  import { isMobile } from '$lib/helpers';
  import { currentLanguage, toggleLanguage, t } from '$lib/i18n/store';
  import { generateRandomColorsWithExtras } from '$lib/utils/colorRandomizer';

  const headerItems = [
    'inicio',
    'skills',
    'trabajos',
    'projects',
    'posts'
  ] as const;

  type HeaderItem = typeof headerItems[number];

  const changeLanguage = () => {
    toggleLanguage();
  }

  // Generate random hover colors for header items
  const headerItemHoverColors = generateRandomColorsWithExtras(headerItems, ['language']);

  // Get current scroll position (cross-browser compatible)
  const getScrollPosition = (): number => {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  };

  // Smooth scroll function with easing
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

  const handleNavClick = (e: MouseEvent, targetId: string) => {
    e.preventDefault();
    smoothScrollTo(targetId);
    history.pushState(null, '', `#${targetId}`);
  };

</script>

<header class="header flex flex-row justify-between items-center content-center text-gray-400">
  {#if $isMobile}
    <button class="menu__button">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      </svg>
    </button>
    <a href="/" class="header__menu__homeButton mx-auto">
      <img class="hidden" src="/icons/logo.png" width="25px" alt="">
    </a>
  {:else}
    <div class="flex flex-row justify-start items-center gap-2 flex-1">
      <img src="/icons/btc.svg" width="35px" alt="">
      <span class="ps-2 header__menu__item leading-6 text-gray-500"> $ { $page.data.btcPrice }</span>
    </div>

    <a href="/" class="header__menu__homeButton mx-auto">
      <img class="hidden" src="/icons/logo.png" width="35px" alt="">
    </a>

    <ul class="header__menu flex flex-row justify-end gap-5 align-items-center flex-1">
      {#each headerItems as headerItem}
        <li class="header__menu__item" style="--item-hover-color: {headerItemHoverColors[headerItem]}">
          <a href="#{headerItem}" on:click={(e) => handleNavClick(e, headerItem)}> { $t.nav[headerItem as keyof typeof $t.nav] } </a>
        </li>
      {/each}
      <li class="header__menu__item" style="--item-hover-color: {headerItemHoverColors['language']}">
        <button on:click={changeLanguage} class="language-toggle">
          {$currentLanguage.toUpperCase()}
        </button>
      </li>
    </ul>

  {/if}

</header>

<style>
  .header {
    z-index: 9;
    position: fixed;
    top: 0;
    backdrop-filter: blur(2px);
    border-bottom: 1px white;
    box-shadow: 0 2px 15px -5px rgba(var(--egg), 0.2);
    -webkit-box-shadow: 0 2px 15px -5px rgba(var(--egg), 0.2);
    -moz-box-shadow: 0 2px 15px -5px rgba(var(--egg), 0.2);
    width: 100%;
    height: 60px;
    padding: 0 2em 0 2em;
  }
  .header__menu {
    padding: 0;
    margin: 0;
    list-style: none;
    font-family: var(--mainFont);
  }
  .header__menu__item {
    margin: 0 0.5em 0 0.5em;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  .header__menu__item:hover {
    color: var(--item-hover-color);
    cursor: pointer;
    transform: scale(1.1);
  }
  .header__menu__homeButton {
    width: 35px;
    height: 35px;
    background-image: url(/icons/logo.png);
    background-size: cover;
    background-position: center;
    border-radius: 50%;
    transition: all 300ms ease-in-out;
  }

  .header__menu__homeButton:hover {
    transform: scale(1.2);
  }
</style>