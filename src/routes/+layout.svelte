<script lang="ts">
  import type { PageData } from './$types';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { onMount } from 'svelte';
  import { isMobile } from '$lib/helpers';
  import '../app.css';
  import '../styles.css';

  export let data: PageData;

  onMount(() => {
    isMobile.update(() => window.innerWidth < 768);
    window.addEventListener('resize', () => {
      isMobile.update(() => window.innerWidth < 768);
    })
  });

  $isMobile;
</script>

<Header />
<slot />
<Footer />
