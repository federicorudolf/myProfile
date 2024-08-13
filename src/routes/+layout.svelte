<script lang="ts">
  import type { PageData } from './$types';
  import Header from '$lib/components/Header.svelte';
  import { onMount } from 'svelte';
  import { btcPrice, isMobile } from '$lib/helpers';
  import '../app.css';

  export let data: PageData;

  onMount(() => {
    isMobile.update(() => window.innerWidth < 768);
    fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC')
      .then(r => r.json())
      .then(({data}) => btcPrice.update(data.rates.USD))
    window.addEventListener('resize', () => {
      isMobile.update(() => window.innerWidth < 768);
    })
  });

  $btcPrice;
  $isMobile;
</script>

<Header lang="ES" />
<slot />
