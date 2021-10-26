<script>
  import { createEventDispatcher } from 'svelte';
  export let language;

  const headerItems = [
    'inicio',
    'skills',
    'trabajos',
    'certificados',
    `${language}`
  ]; 
  const dispatch = createEventDispatcher();

  function headerItemClicked(item) {
    dispatch('navigate-to', item);
  }

</script>

<header class="header d-flex flex-row justify-content-between align-items-center">
  <a href="/"> Testing </a>
  <ul class="header__menu d-flex flex-row justify-between align-items-center">
    { #each headerItems as headerItem }
      <li class="header__menu__item">
        <button on:click="{ () => headerItemClicked(headerItem) }">{ headerItem } </button>
      </li>
    { /each }
  </ul>
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