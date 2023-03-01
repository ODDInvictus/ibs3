<script>
  import { page } from '$app/stores'
</script>

<div id="root">
  <h1>Transacties</h1>

  <p>Welkom op de transacties pagina. Hier kan je alle transacties bekijken, en andere objecten promoveren tot transactie!</p>

  <div id="page">
    <div id="sales">
      <h1>Laatste 20 transacties</h1>

      <div class="buttons">
        <a href="/financieel/transacties/verwerk">Verwerk transacties</a>
        <a href="/financieel/transacties/statistieken">Statistieken</a>
      </div>

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
            <th>Verwerkt</th>
            <th>Verander</th>
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
              <td>{transaction.settled ? 'Ja' : 'Nee'}</td>
              <td>
                <a href="/financieel/transacties/{transaction.id}/">Verander</a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div id="transactions">
      <h1>Vekopen</h1>

      <div class="buttons">
        <a href="/financieel/streeplijst/verwerk">Verwerk een nieuwe streeplijst</a>
        <a href="/financieel/transacties/verkopen">Converteer naar transacties</a>
      </div>


      <table id="sale-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Aantal</th>
            <th>Verkocht aan</th>
            <th>Prijs</th>
            <th>Verander</th>
          </tr>
        </thead>
        <tbody>
          {#each $page.data.sales as sale}
            <tr>
              <td>{sale.product.name}</td>
              <td id="amount">{sale.amount}</td>
              <td>{sale.person.name}</td>
              <td>€ {Number(sale.product.price * sale.amount).toFixed(2)}</td>
              <td>
                <a href="/financieel/transacties/verkopen/{sale.id}/">Verander</a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      {#if $page.data.sales.length == 0}
        <div class="not-found">
          <h2>Geen verkopen gevonden</h2>
          <a href="/financieel/streeplijst/verwerk">Verwerk een streeplijst!</a>
        </div>
      {/if}
    </div>
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

  #page {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;

    h1 {
      text-align: center;
      margin-bottom: 1rem;
    }
  }

  table {
    width: 100%;

    thead {
      background-color: #eee;
    }

    th {
      text-align: left;
    }

    td {
      text-align: left;
    }


    #amount {
      text-align: left;
      padding-right: 1rem;
    }
  }

</style>