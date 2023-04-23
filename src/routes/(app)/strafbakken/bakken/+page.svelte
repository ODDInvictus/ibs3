<script lang="ts">
  import type { bakkenPageData } from "../types";
  import Table from "./Table.svelte";

  export let data: bakkenPageData;

  console.log(data)

  const middleIndex = Math.ceil(data.strafbakken.length / 2);
  let width: number;

  // Get the longest name
  let longestName = "";
  data.strafbakken.forEach((user) => {
    let name = user.nickname ?? user.firstName;
    if (name.length > longestName.length) longestName = name;
  });

  function getTitle(week: String | null) {
    if (week === null) return "Alle getrokken strafbakken";
    if (week === "0") return "Getrokken strafbakken deze week";
    return `Getrokken strafbakken week ${week}`;
  }

  $: msg = getTitle(data.week);
</script>

<svelte:window bind:innerWidth={width} />

<main>
  <header>
    <h1>{msg}</h1>
    <hr />
  </header>
  <table-container>
    {#if width < 900 || data.strafbakken.length < 5}
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
  {#if data.week !== "0"}
    <a
      href="/strafbakken/bakken?week=0"
      class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
      data-sveltekit-preload-data="hover"
    >
      Wie is er deze week meesterbakker?
    </a>
  {/if}
  <a
    href={data.week === null ? "/strafbakken" : "/strafbakken/bakken"}
    class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
    data-sveltekit-preload-data="hover"
  >
    Terug
  </a>
</main>

<style lang="scss">
  $margin: 1rem;
  $cell-padding: 0.75rem;

  main {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: $margin;

    header {
      width: 100%;

      h1 {
        text-align: center;
        font-weight: 600;
        font-size: larger;
      }

      hr {
        margin-top: $margin;
      }
    }

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
</style>
