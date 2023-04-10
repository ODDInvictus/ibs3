<script>
  import { page } from '$app/stores'
</script>

<div id="root">
  <div id="sales">
    <h1>Laatste 20 transacties</h1>

    <hr />

    <div class="buttons">
      <a href="/financieel/transacties/statistieken">Statistieken</a>
    </div>

    {#if $page.data.transactions.length == 0}
      <div class="not-found">
        <h2>Geen transacties gevonden</h2>

        <p>Maak eerst een aantal verkopen, declaraties etc. aan</p>
      </div>
    {/if}

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Datum</th>
          <th>Beschrijving</th>
          <th>Prijs</th>
          <th>Van</th>
          <th>Naar</th>
        </tr>
      </thead>
      <tbody>
        {#each $page.data.transactions as transaction}
          <tr>
            <td>{transaction.id}</td>
            <td>{new Date(transaction.createdAt).toLocaleString('nl-NL')}</td>
            <td>{transaction.description}</td>
            <td>€ {Number(transaction.price).toFixed(2)}</td>
            <td>{transaction.from.name}</td>
            <td>{transaction.to.name}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style lang="scss">
  .not-found {
    text-align: center;
  }

  h1 {
    text-align: center;
    padding-bottom: 0.5rem;
  }

  .buttons {
    display: flex;
    justify-content: center;
    padding: 0.5rem 0; 
  }

</style>