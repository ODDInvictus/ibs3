<script lang="ts">
  import { Modals, closeModal } from "svelte-modals";
  import Table from "./Table.svelte";
  import type { sbPageData } from "./types";

  export let data: sbPageData;
  const middleIndex = Math.ceil(data.strafbakken.length / 2);

  let width: number;
</script>

<svelte:window bind:innerWidth={width} />

<main>
  <Modals>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div slot="backdrop" class="backdrop" on:click={closeModal} />
  </Modals>
  <table-container>
    {#if width < 900}
      <Table data={data.strafbakken} />
    {:else}
      <Table data={data.strafbakken.slice().splice(0, middleIndex)} />
      <Table data={data.strafbakken.slice().splice(-middleIndex)} />
    {/if}
  </table-container>
</main>

<style lang="scss">
  table-container {
    width: 100%;
    display: flex;
    gap: 1.5rem;
    justify-content: center;
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
