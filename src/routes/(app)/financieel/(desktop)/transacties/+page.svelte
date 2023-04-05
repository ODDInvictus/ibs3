<script>
  import { page } from '$app/stores'
</script>

<div id="root">
  <div id="sales">
    <h1>Laatste 20 transacties</h1>

    <a href="/financieel/transacties/statistieken">Statistieken</a>
    
    {#if $page.data.transactions.length == 0}
      <div class="not-found">
        <h2>Geen transacties gevonden</h2>

        <p>Maak eerst een aantal verkopen, declaraties etc. aan</p>
      </div>
    {/if}

    <table id="transaction-table">
      <thead>
        <tr>
          <th>Beschrijving</th>
          <th>Prijs</th>
          <th>Van</th>
          <th>Naar</th>
          <th>Datum</th>
        </tr>
      </thead>
      <tbody>
        {#each $page.data.transactions as transaction}
          <tr>
            <td>{transaction.description}</td>
            <td>€ {Number(transaction.price).toFixed(2)}</td>
            <td>{transaction.from.name}</td>
            <td>{transaction.to.name}</td>
            <td>{new Date(transaction.createdAt).toLocaleDateString('nl-NL')}</td>
          </tr>
        {/each}
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<style lang="scss">
  h1 {
    font-size: 1.5rem;
  }

  .not-found {
    text-align: center;
  }

  a:hover {
    text-decoration: underline;
  }

  .buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  table {
    margin-top: 1rem;
    width: 100%;
    border-collapse: collapse;

    th {
      padding: 0.5rem;
      border: 1px solid #ddd;
      text-align: left;
    }

    td {
      padding: 0.5rem;
      border: 1px solid #ddd;
      text-align: center;
    }

    tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    tr:last-child {
      background-color: #ddd;
    }

  }

</style>