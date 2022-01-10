<script>
  import { createEventDispatcher } from 'svelte';
  import { btcData, isMobile } from './../Store/store';
  export let language;

  const headerItems = [
    'inicio',
    'skills',
    'trabajos',
    'certificados',
    `${language}`
  ]; 
  const dispatch = createEventDispatcher();
  let btc;
  let mobileDevice;

  isMobile.subscribe(data => {
    mobileDevice = data;
  })
  btcData.subscribe(data => {
    btc = data;
  });
  function headerItemClicked(item) {
    dispatch('navigate-to', item);
  }

</script>

<header class="header d-flex flex-row justify-content-between align-items-center">
  <button class="menu_button">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    </svg>
  </button>
  <a href="/"> FJR </a>

  <div class="d-flex flex-row justify-content-center align-items-center">
    <img src="{btc.logo_url}" width="25px" alt="">
    <span class="ps-2 header__menu__item"> $ { Math.floor(+btc.price) }</span>
  </div>

  {#if !mobileDevice}
    <ul class="header__menu d-flex flex-row justify-between align-items-center">
      { #each headerItems as headerItem }
        <li class="header__menu__item">
          <button on:click="{ () => headerItemClicked(headerItem) }">{ headerItem } </button>
        </li>
      { /each }
    </ul>
  {/if}
</header>

<style lang="scss">

  .header {
      position: fixed;
      top: 0;
      backdrop-filter: blur(2px);
      border-bottom: 1px white;
      @include boxShadow;
      @include widthHeight(100%, 60px);
      @include padding(0, 2em);

      &__menu {
        @include padding(0, 0);
        @include margin(0, 0);
        padding: 0;
        margin: 0;
        list-style: none;
        font-family: $mainFont;
          &__item {
            color: $egg;
            text-transform: capitalize;
            @include margin(0, 0.5em); 
          }

          &__item:hover {
            color: $mainColor;
            cursor: pointer;
          }
      }
  }

</style>