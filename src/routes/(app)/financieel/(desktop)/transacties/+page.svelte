<script>
  import { page } from '$app/stores'
</script>

<div id="root">
  <h1>Transacties</h1>

  <p>Welkom op de transacties pagina. Hier kan je alle transacties bekijken, en andere objecten promoveren tot transactie!</p>

  <div id="page">
    <div id="sales">
      <h1>Oude transacties</h1>

      {#if $page.data.transactions.length == 0}
        <div class="not-found">
          <h2>Geen transacties gevonden</h2>

          <p>Maak eerst een aantal verkopen, declaraties etc. aan</p>
        </div>
      {/if}
    </div>
    <div id="transactions">
      <h1>Vekopen</h1>

      <div class="buttons">
        <a href="/financieel/streeplijst/verwerk">Verwerk een nieuwe streeplijst</a>
        <a href="/financieel/transacties/verkopen">Converteer naar transacties</a>
      </div>


      {#if $page.data.sales.length == 0}
        <div class="not-found">
          <h2>Geen verkopen gevonden</h2>
          <a href="/financieel/streeplijst/verwerk">Verwerk een streeplijst!</a>
        </div>
      {/if}

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

  #sale-table {
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