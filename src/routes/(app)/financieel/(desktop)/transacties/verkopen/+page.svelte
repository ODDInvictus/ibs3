<script>
	import { enhance } from '$app/forms';
  import { page } from '$app/stores'
	import StyledButton from '$lib/components/StyledButton.svelte';

  const data = $page.data

  const convert = () => {

  }
</script>

<div id="root">
  <h1>Verkopen</h1>

  <form method="POST" id="buttons" use:enhance={({ cancel }) => {
    if (!confirm('Weet je zeker dat je alle verkopen wilt converteren naar transacties? Deze actie kan niet ongedaan gemaakt worden')) {
      cancel()
    }
  }}>
    <button type="submit">
      Converteer naar transacties
    </button>
  </form>

  {#if data.sales.length == 0}
    <div class="not-found">
      <h2>Geen verkopen gevonden</h2>
      <a href="/financieel/streeplijst/verwerk">Verwerk een streeplijst!</a>
    </div>
  {/if}

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Product</th>
        <th>Aantal</th>
        <th>Verkocht aan</th>
        <th>Prijs</th>
        <th>Verander</th>
      </tr>
    </thead>
    <tbody>
      {#each data.sales as sale}
        <tr>
          <td>{sale.id}</td>
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

<style>
  h1 {
    font-size: 1.5rem;
  }

  .not-found {
    text-align: center;
  }

  #buttons {
    margin: 1rem;
  }

  a:hover {
    text-decoration: underline;
  }

  table {
    width: 80%;
    margin: 0 auto;
    text-align: center;
  }
</style>