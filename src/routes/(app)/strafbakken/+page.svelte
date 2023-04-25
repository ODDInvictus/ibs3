<script lang="ts">
  import { Modals, closeModal } from "svelte-modals";
  import Table from "./Table.svelte";
  import type { sbPageData } from "./types";

  export let data: sbPageData;

  const middleIndex = Math.ceil(data.strafbakken.length / 2);
  let width: number;

  // Get the longest name
  let longestName = "";
  data.strafbakken.forEach((user) => {
    let name = user.nickname ?? user.firstName;
    if (name.length > longestName.length) longestName = name;
  });
</script>

<svelte:window bind:innerWidth={width} />

<h1>
  Strafbakken
</h1>

<hr />

<main>
  <Modals>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div slot="backdrop" class="backdrop" on:click={closeModal} />
  </Modals>

  <table-container>
    {#if width < 900}
      <Table data={data.strafbakken} longestName={null} />
    {:else}
      <Table
        data={data.strafbakken.slice().splice(0, middleIndex)}
        {longestName}
      />
      <Table
        data={data.strafbakken.slice().splice(middleIndex, data.strafbakken.length - 1)}
        {longestName}
      />
    {/if}
  </table-container>
  <a
    href="/strafbakken/bakken"
    class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
    data-sveltekit-preload-data="hover"
  >
    Hoeveel heeft iedereen al getrokken?
  </a>
</main>

<style lang="scss">
  $margin: 1rem;

  h1 {
    text-align: center;
  }

  hr {
    margin: var(--hr-margin);
  }

  main {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: $margin;

    table-container {
      width: 100%;
      display: flex;
      justify-content: center;
      gap: $margin;
    }

    a {
      width: fit-content;
    }
  }

  .backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
</style>
