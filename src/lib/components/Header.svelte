<script lang="ts">
	import { page } from '$app/stores';
  export let lang;
  import { isMobile } from '$lib/helpers';

  const headerItems = [
    'inicio',
    'skills',
    'trabajos',
    'posts',
  ];

  const changeLanguage = () => {
    console.log(lang);
  }

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
    <div class="flex flex-row justify-content-center items-center gap-2 flex-1">
      <img src="/icons/btc.svg" width="25px" alt="">
      <span class="ps-2 header__menu__item leading-6 text-gray-500"> $ { $page.data.btcPrice }</span>
    </div>

    <a href="/" class="header__menu__homeButton mx-auto">
      <img class="hidden" src="/icons/logo.png" width="25px" alt="">
    </a>

    <ul class="header__menu flex flex-row justify-center gap-5 align-items-center flex-1">
      {#each headerItems as headerItem}
        <li class="header__menu__item">
          <a href="/{headerItem}"> { headerItem } </a>
        </li>
      {/each}
      <li class="header__menu__item">
        <button on:click={changeLanguage}>
          {lang}
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
    text-transform: capitalize;
    margin: 0 0.5em 0 0.5em;
  }
  .header__menu__item:hover {
    color: var(--mainColor);
    cursor: pointer;
  }
  .header__menu__homeButton {
    width: 30px;
    height: 30px;
    background-image: url(/icons/logo.png);
    background-size: cover;
    background-position: center;
    border-radius: 50%;
  }
</style>