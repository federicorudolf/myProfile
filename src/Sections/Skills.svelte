<script>
import Skill from '../Components/Skill.svelte';

  const title = 'Skills';
  const skills = [
    {
      skillTitle: 'JavaScript',
      skillLevel: 3 / 8,
      skillLevelText: '95%',
      fadeinCoords: { x: -500, y: 0 },
      id: 0
    },
    {
      skillTitle: 'Angular',
      skillLevel: 2 / 8,
      skillLevelText: '90%',
      fadeinCoords: { x: -500, y: 0 },
      id: 1
    },
    {
      skillTitle: 'Vue.JS',
      skillLevel: -(1 / 4),
      skillLevelText: '70%',
      fadeinCoords: { x: -500, y: 0 },
      id: 2
    },
  ]
</script>

<section class="skills">
  <h1 class="skills__title"> { title } </h1>
  <div class="skills__container d-flex flex-row flex-wrap align-items-center justify-content-center">
    {#each skills as skill}
      <Skill { ...skill } />
    {/each}
  </div>
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