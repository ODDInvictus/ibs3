<script lang="ts">
  import type { bakkenUser } from "../types";
  import "../table.scss";

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
  row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
</style>