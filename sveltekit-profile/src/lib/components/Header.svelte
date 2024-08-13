<script lang="ts">
  export let lang;
  import { btcPrice, isMobile } from '$lib/helpers';

  const headerItems = [
    'inicio',
    'skills',
    'trabajos',
    'certificados',
    `${lang}`
  ]; 

</script>

<header class="header flex flex-row justify-between items-center content-center">
  <a href="/" class="header__menu__homeButton">
    <img src="/icons/logo.png" width="25px" alt="">
  </a>

  {#if !$isMobile}
    <button class="menu__button">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      </svg>
    </button>
  {/if}

  <div class="d-flex flex-row justify-content-center align-items-center">
    <img src="/icons/btc.svg" width="25px" alt="">
    <span class="ps-2 header__menu__item"> $ { Math.floor($btcPrice) }</span>
  </div>

  {#if !$isMobile}
    <ul class="header__menu d-flex flex-row justify-between align-items-center">
      {#each headerItems as headerItem}
        <li class="header__menu__item">
          <a href="/{headerItem}"> { headerItem } </a>
        </li>
      {/each}
    </ul>
  {/if}
</header>

<style>

  .header {
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
    color: var(--egg);
    text-transform: capitalize;
    margin: 0 0.5em 0 0.5em;
  }
  .header__menu__item:hover {
    color: var(--mainColor);
    cursor: pointer;
  }
  .header__menu__homeButton {
    width: 25px;
    background-image: url('/icons/logo.png');
    background-size: contain;
    border-radius: 50%;
  }
</style>