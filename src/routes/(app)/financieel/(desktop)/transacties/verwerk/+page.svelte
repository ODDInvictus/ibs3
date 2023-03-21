<script lang="ts">
  import { page } from '$app/stores'
</script>

<div id="root">
  <h1>Verwerk alle transacties</h1>
  <p>Hier kan je individuele transacties op <code>settled</code> zetten, om aan te geven dat ze zijn verwerkt.</p>
  <p>Dit geeft aan dat de transactie op de bank is gebeurd. (Bijvoorbeeld als iemand nog 15 euro krijgt van invictus, en dat heeft overgemaakt, kan je deze op settled zetten.)</p>

  <h2>Samenvatting</h2>

  <table id="summary-table">
    <thead>
      <tr>
        <th>Van</th>
        <th>Naar</th>
        <th>Bedrag</th>
      </tr>
    </thead>
    <tbody>
      {#each $page.data.summary as s}
      <tr>
        <td>{s.from}</td>
        <td>{s.to}</td>
        <td class="price">{s.totalAmount.toFixed(2)}</td>
      </tr>
      {/each}
      <tr>
        <td />
        <td />
        <td />
      </tr>
  </table>

  <h2>Overzicht</h2>

  <table id="transaction-table">
    <thead>
      <tr>
        <th>Beschrijving</th>
        <th>Van</th>
        <th>Naar</th>
        <th>Bedrag</th>
        <th>Grootboek</th>
        <th>Datum</th>
        <th>Verwerk</th>
      </tr>
    </thead>
    <tbody>
      {#each $page.data.transactions as transaction}
      <tr>
        <td>{transaction.description}</td>
        <td>{transaction.from.name}</td>
        <td>{transaction.to.name}</td>
        <td class="price">{transaction.price.toFixed(2)}</td>
        <td>{transaction.ledger.name}</td>
        <td>{new Date(transaction.ledger.createdAt).toLocaleDateString('nl-NL')}</td>
        <td><input type="checkbox" /></td>
      </tr>
      {/each}
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td><button>Verwerk</button></td>
      </tr>
    </tbody>
  </table>
</div>

<style lang="scss">
  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1.25rem;
    margin-top: 1rem;
  }

  button:hover {
    text-decoration: underline;
  }

  #summary-table {
    padding-bottom: 1rem;
  }

  #transaction-table {
    width: 100%;
    border-collapse: collapse;
  }

  table {
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

  .price:before {
    content: '\20AC\00A0';
  }

  .price {
    text-align: right;
  }
</style>