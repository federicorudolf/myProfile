import type { LayoutServerLoad } from './$types';
import { fetchMediumArticles } from '$lib/services';

export const prerender = true;

export const load = (async () => {
  const btcPrice = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC')
    .then(r => r.json())
    .then(({data}) => data.rates.USD);

  const mediumArticles = await fetchMediumArticles();

  return {
    btcPrice,
    mediumArticles
  };
}) satisfies LayoutServerLoad;
