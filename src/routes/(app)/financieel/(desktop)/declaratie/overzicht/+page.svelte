<script lang="ts">
  import { page } from '$app/stores'
  import { XCircle, PencilSquare, Check } from 'svelte-heros-v2'

  let error = ''

  function formatPrice(price: number) {
    return price.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
  }

  async function process(id: number, type: 'accept' | 'decline') {
    const accept = confirm('Weet je zeker dat je deze declaratie wilt ' + (type === 'accept' ? 'goedkeuren?' : 'afkeuren?'))

    if (!accept) return
    await fetch('', {
      method: 'POST',
      body: JSON.stringify({ id, type }),
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      if (res.status !== 200) {
        error = res.message
      } else {
        removeRow(id)
      }
    })
    .catch(err => error = err.message)
  }

  function removeRow(id: number) {
    // select the tr where x-id = id
    const row = document.querySelector(`tr[data-id="${id}"]`)
    row?.remove()
  }
</script>

<div id="root">
  <h1>Declaratie overzicht</h1>

  <p class="error">
    {#if error}
      {error}
    {/if}
  </p>

  <table>
    <thead>
      <tr>
        <th>Id</th>
        <th>Prijs</th>
        <th>Datum</th>
        <th>Persoon</th>
        <th>Reden</th>
        <th>Betaalwijze</th>
        <th>Acties</th>
      </tr>
    </thead>
    <tbody>
      {#if !$page.data.declarations.length}
        <tr>
          <td colspan="7">
            <p id="no-decla">Geen declaraties gevonden</p>
            <a href="/financieel/declaratie" class="link">Wil je een declaratie doen?</a>
          </td>
        </tr>
      {/if}
      {#each $page.data.declarations as declaration}
        <tr data-id={declaration.id}>
          <td>{declaration.id}</td>
          <td class="price">{formatPrice(declaration.price)}</td>
          <td>{new Date(declaration.createdAt).toLocaleString('nl-NL')}</td>
          <td>{declaration.person.name}</td>
          <td>{declaration.reason}</td>
          <td>{declaration.methodOfPayment}</td>
          <td class="actions">
            <button on:click={() => process(declaration.id, 'accept')}>
              <Check class="text-green-500" />
            </button>
            <button on:click={() => process(declaration.id, 'decline')}>
              <XCircle class="text-red-500" />
            </button>
            <a href="/financieel/declaratie/{declaration.id}">
              <PencilSquare class="text-purple-500"/>
            </a>
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

  .error {
    color: red;
  }

  #no-decla {
    font-size: 1.1rem;
  }

  .link:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    text-align: center;
  }

  .price {
    text-align: left;
  }


  .actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>