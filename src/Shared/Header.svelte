<script>

</script>

<header class="header d-flex flex-row justify-content-between align-items-center">
  <a href=""> Testing </a>
  <ul class="header__menu d-flex flex-row justify-between align-items-center">
      <li class="header__menu__item"> Holi</li>
  </ul>
</header>

<style lang="scss">

  .header {
      position: fixed;
      top: 0;
      box-shadow: 0 2px 15px -5px rgba($color: $lightGray, $alpha: 0.2);
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
          }
      }
  }

</style>