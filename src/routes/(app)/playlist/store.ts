import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const accesstokenStore = writable(
  browser ? sessionStorage.getItem("spotifyAccesstoken") ?? "" : ""
);

accesstokenStore.subscribe((value) => {
  if (browser && value) sessionStorage.setItem("spotifyAccesstoken", value);
});
