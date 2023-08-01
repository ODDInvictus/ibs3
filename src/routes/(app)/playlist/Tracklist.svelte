<script lang="ts">
  import Pause from "~icons/tabler/pause";
  import Play from "~icons/tabler/play";

  export let search: string;
  export let tracks: SpotifyApi.TrackObjectFull[];

  const getSmallestImage = (images: SpotifyApi.ImageObject[]) => {
    return images.reduce((smallest, image) => {
      if (image.height! < smallest.height! && image.width! < smallest.width!)
        return image;
      return smallest;
    }, images[0]);
  };

  const formatArtists = (artists: SpotifyApi.ArtistObjectSimplified[]) => {
    return artists.map((artist) => artist.name).join(", ");
  };

  let previewSrc = "";
  let audioPlayer: HTMLAudioElement;

  $: {
    if (audioPlayer) {
      audioPlayer.src = previewSrc;
      audioPlayer.play();
    }
  }

  let hovering = "";

  $: onChange(search);
  const onChange = (...args: any[]) => {
    if (audioPlayer) audioPlayer.pause();
    previewSrc = "";
  };
</script>

<audio src={previewSrc} bind:this={audioPlayer} />
<ul>
  {#if tracks.length === 0}
    <p>No tracks found</p>
  {/if}
  {#each tracks as track}
    <li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        on:click={() => {
          hovering = "een trigger zodat svelte het weer snapt";
          hovering = track.preview_url ?? "";
          if (track.preview_url === previewSrc) {
            if (audioPlayer.paused) audioPlayer.play();
            else audioPlayer.pause();
          } else {
            if (track.preview_url) previewSrc = track.preview_url;
          }
        }}
        class={`${track.preview_url ? "clickable" : ""} ${previewSrc === track.preview_url && !audioPlayer.paused ? "highlight" : ""}`}
        on:mouseenter={() => (hovering = track.preview_url ?? "")}
        on:mouseleave={() => (hovering = "")}
      >
        <img
          src={getSmallestImage(track.album.images).url}
          alt={"Album cover " + track.name}
        />
        {#if track.preview_url}
          {#if (hovering === track.preview_url && (previewSrc !== track.preview_url || audioPlayer.paused)) || (previewSrc === track.preview_url && audioPlayer.paused)}
            <Play
              style={"position: absolute; top: 19px; left: 19px; height: 26px; width: 26px;"}
            />
          {:else if previewSrc === track.preview_url && !audioPlayer.paused}
            <Pause
              style={"position: absolute; top: 19px; left: 19px; height: 26px; width: 26px;"}
            />
          {/if}
        {/if}
      </div>
      <div class="right">
        <p>{track.name}</p>
        <p class="artists">{formatArtists(track.artists)}</p>
      </div>
    </li>
  {/each}
</ul>

<style lang="scss">
  $highlight-opacity: 0.7;

  ul {
    li {
      display: flex;

      img {
        height: 64px;
        width: 64px;
      }

      .clickable {
        cursor: pointer;
        display: inline-block;
        position: relative;

        &:hover:not(.highlight) img {
          opacity: $highlight-opacity;
        }

        &.highlight {
          opacity: $highlight-opacity;
        }
      }

      .right {
        margin-left: 10px;

        .artists {
          font-size: 0.8rem;
          color: #888;
        }
      }

      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
</style>
