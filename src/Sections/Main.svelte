<script>
  import Header from '../Shared/Header.svelte';
  import { createEventDispatcher } from 'svelte';

  export let title;
  const dispatch = createEventDispatcher();

  function navigateTo(event) {
    dispatch('navigate-to', event);
  }
  

</script>

<section class="main">
  <Header on:navigate-to="{ navigateTo }" />
  <h1 class="main__title"> { title.length ? title : '' } </h1>
</section>

<style lang="scss">
  .main {
    background-color: transparent;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    @include widthHeight(100vw, 100vh);

    &__title {
      color: $mainColor;
      font-size: 10em;
      font-weight: 300;
      text-shadow: 0px 0px 10px $lightGray;
    }
  }
</style>