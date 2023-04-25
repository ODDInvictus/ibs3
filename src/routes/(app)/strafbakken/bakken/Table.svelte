<script lang="ts">
  import type { bakkenUser } from "../types";

  export let data: bakkenUser[];
  export let longestName: string | null;

  const formatName = (names: {
    nickname: string | null;
    firstName: string;
  }) => {
    let unformattedName = names.nickname || names.firstName;
    return (
      unformattedName[0].toUpperCase() + unformattedName.slice(1).toLowerCase()
    );
  };
</script>

<main>
  <thead>
    <th>Naam</th>
    <th>Bakken</th>
  </thead>
  <tbody>
    {#each data as user}
      <row>
        <td>{formatName(user)}</td>
        <td>{user.count}</td>
      </row>
    {/each}
    <!-- Add an invisible row with the longest name to make sure the 2 tables have the same width (kinda) -->
    {#if longestName !== null}
      <row id="invisible">
        <td class="cell">{longestName}</td>
        <td class="cell" />
      </row>
    {/if}
  </tbody>
</main>

<style lang="scss">
  $cell-padding: 0.75rem;

  thead {
    display: flex;
    justify-content: space-around;

    th {
      padding: $cell-padding;
      text-align: left;
    }
  }

  tbody {
    display: grid;
    grid-template-columns: 1fr;

    row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      transition: all 0.4s ease;

      &:nth-child(odd) {
        background-color: var(--primary-focus-color);
        color: white;
      }

      &:has(.cell:not(.actions):hover) {
        background-color: var(--primary-color);
        color: white;
        text-decoration: underline;
      }

      td {
        padding: $cell-padding;
        word-wrap: break-word;
        position: relative;
        border: none;
      }

      &#invisible {
        opacity: 0;
        cursor: default;
        height: 0px;

        .cell {
          padding: 0 $cell-padding;
          word-wrap: normal;
          text-overflow: clip;
          line-height: 0%;
        }
      }
    }
  }
</style>
