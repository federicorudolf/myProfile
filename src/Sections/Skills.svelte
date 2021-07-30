<script>
  const title = 'Skills';
</script>

<section class="skills">
  <h1 class="skills__title"> { title } </h1>
</section>

<style lang="scss">
  .skills {
      background-color: $lightGray;
      @include widthHeight(100%, auto);

      &__title {
          font-size: 3em;
      }
  }
</style>