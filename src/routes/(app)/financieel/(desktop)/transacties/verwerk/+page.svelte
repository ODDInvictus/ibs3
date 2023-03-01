<script lang="ts">
  import { page } from '$app/stores'
</script>

<div id="root">
  <h1>Verwerk alle transacties</h1>
  <p>Hier kan je individuele transacties op <code>settled</code> zetten, om aan te geven dat ze zijn verwerkt.</p>
  <p>Dit geeft aan dat de transactie op de bank is gebeurd. (Bijvoorbeeld als iemand nog 15 euro krijgt van invictus, en dat heeft overgemaakt, kan je deze op settled zetten.)</p>

  <transaction-table>
    <table>
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
          <td>{transaction.price}</td>
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
  </transaction-table>
</div>

<style lang="scss">
  h1 {
    font-size: 1.5rem;
  }

  button:hover {
    text-decoration: underline;
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