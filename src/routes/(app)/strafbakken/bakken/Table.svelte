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

<table>
  <thead>
    <th>Naam</th>
    <th>Bakken</th>
  </thead>
  <tbody>
    {#each data as user}
      <tr>
        <td>{formatName(user)}</td>
        <td>{user.count}</td>
      </tr>
    {/each}
    <!-- Add an invisible row with the longest name to make sure the 2 tables have the same width (kinda) -->
    {#if longestName !== null}
      <tr id="invisible">
        <td class="cell">{longestName}</td>
        <td class="cell" />
      </tr>
    {/if}
  </tbody>
</table>

<style lang="scss">
  $cell-padding: 0.75rem;

  th {
    padding: 0 $cell-padding $cell-padding $cell-padding;
  }

  tr {
    td {
      padding: $cell-padding;
    }

    &:nth-child(odd) {
      background-color: var(--primary-color);
      color: white;
    }

    &#invisible {
      opacity: 0;
      cursor: default;
      height: 0px;

      td {
        padding: 0 $cell-padding;
        word-wrap: normal;
        text-overflow: clip;
        line-height: 0%;
      }
    }
  }
</style>
