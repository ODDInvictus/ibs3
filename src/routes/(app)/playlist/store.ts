import { writable } from "svelte/store";
import { browser } from "$app/environment";
import spotify from "./Spotify";

export const accesstokenStore = writable("");

accesstokenStore.subscribe((value) => {
  if (browser && value) {
    sessionStorage.setItem("spotifyAccesstoken", value);
    spotify.setAccessToken(value);
  }
});
