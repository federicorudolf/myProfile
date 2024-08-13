<script>
  import { onDestroy, onMount } from 'svelte';

</script>

<header class="header">
  <slot name="header" />
</header>
<section class="section">
  <slot name="section" />
</section>
<footer class="footer">
  <slot name="footer" />
</footer>

<style lang="scss">

</style>