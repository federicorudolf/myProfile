import type { PageLoad } from './$types';

export const prerender = true;

export const load = (async () => {
  const btcPrice = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC')
    .then(r => r.json())
    .then(({data}) => data.rates.USD)
  return {
    btcPrice,
  }
}) satisfies PageLoad;
