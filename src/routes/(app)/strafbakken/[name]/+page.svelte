<script lang="ts">
  import type { sbUserPageData } from "../types";

  export let data: sbUserPageData;

  const formatName = (names: {
    nickname: string | null;
    firstName: string;
  }) => {
    let unformattedName = names.nickname || names.firstName;
    return (
      unformattedName[0].toUpperCase() + unformattedName.slice(1).toLowerCase()
    );
  };

  $: name = formatName({
    nickname: data.strafbakken.nickname,
    firstName: data.strafbakken.firstName,
  });
</script>

<main>
  <h1>{name} zijn {data.strafbakken.StrafbakReceived.length} strafbakken</h1>
  <hr />
  <table-container>
    <table>
      <thead>
        <th>Gever</th>
        <th>Reden</th>
        <th>Locatie</th>
        <th>Datum</th>
        <th>Tijd</th>
      </thead>
      <tbody>
        {#each data.strafbakken.StrafbakReceived as strafbak}
          <tr>
            <a href={`/strafbakken/${strafbak.giver.firstName}`}>
              {formatName(strafbak.giver)}
            </a>
            <td>{strafbak.reason ?? "Geen reden gegeven"}</td>
            <td>{strafbak.location ?? "Onbekend"}</td>
            <td>{strafbak.dateCreated.toLocaleDateString()}</td>
            <td>{strafbak.dateCreated.toLocaleTimeString().slice(0, -3)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </table-container>
</main>

<style lang="scss">
  h1 {
    text-align: center;
    font-weight: 600;
    font-size: larger;
  }

  hr {
    margin: 1rem 0;
  }

  $tr-padding: 0.75rem;

  table-container {
    display: grid;
    place-items: center;

    td,
    th,
    tr a {
      padding: $tr-padding;
    }

    tbody {
      tr {
        &:nth-child(odd) {
          background-color: var(--primary-color);
          color: white;
        }

        a {
          display: table-cell;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
</style>
