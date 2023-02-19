<script lang="ts">
  import type { sbUserPageData } from "../types";

  export let data: sbUserPageData;
  console.log(data.strafbakken);

  const formatName = (names: {
    nickname: string | null;
    firstName: string;
  }) => {
    let unformattedName = names.nickname || names.firstName;
    return (
      unformattedName[0].toUpperCase() + unformattedName.slice(1).toLowerCase()
    );
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  let name = formatName({
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
        <th>Datum</th>
      </thead>
      <tbody>
        {#each data.strafbakken.StrafbakReceived as strafbak}
          <tr>
            <a href={`/strafbakken/${strafbak.giver.firstName}`}>
              {formatName(strafbak.giver)}
            </a>
            <td>{strafbak.reason ?? "Geen reden gegeven"}</td>
            <td>{formatDate(strafbak.dateCreated)}</td>
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
          background-color: #d3c0ff;
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
