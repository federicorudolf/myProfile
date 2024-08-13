import { writable } from "svelte/store";

export const btcPrice = writable(0);

export const isMobile = writable(false)