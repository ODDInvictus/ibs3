<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
  import StyledButton from '$lib/components/StyledButton.svelte';
import Row from './row.svelte'

  let data: RowData[] = [{ 
    id: 0, 
    person: 0, 
    product: 0, 
    amount: 0 
  }]

  const newRow = () => {
    data.push({ 
      id: data.length, 
      person: 0, 
      product: 0, 
      amount: 0 
    })
    // Tell Svelte that we updated data
    data = data
  }

  const deleteRow = () => {
    if (data.length === 1) return
    data.pop()
    // Tell Svelte that we updated data
    data = data
  }

  const pagedata = $page.data
  let error = ''

  const submit = () => {
    if (!confirm('Weet je zeker dat je deze streeplijst wilt verwerken?')) return

    fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => {
      if (res.status === 200) {
        console.log('success')
        
        if (!confirm('Verwerken gelukt! Wil je nog een streeplijst verwerken?')) {
          goto('/financieel/streeplijst/verwerk')
        }
        goto('/financieel')

      } else {
        res.json().then(err => {
          error = err.message
        })
      }
    })
  }

</script>


<div id="root">
  <h1>Verwerk een streeplijst</h1>

  <button on:click={() => newRow()}              >Rij toevoegen</button>
  <button on:click={() => deleteRow()}           >Rij verwijderen</button>
  <button on:click={() => submit()} type="submit">Submit</button>

  <div id="error">
    {#if error}
      <p>{error}</p>
    {/if}
  </div>

  <div id="header">
    <h2>ID</h2>
    <h2>Persoon</h2>
    <h2>Product</h2>
    <h2>Aantal</h2>
  </div>

  {#each data as row}
    <Row bind:value={row} data={pagedata}/>
  {/each}
</div>

<style lang="scss">
  #root {
    display: block;
  }

  button {
    margin: 1rem;
  }

  #error {
    color: red;
    margin-left: 1rem;
  }

  #header {
    display: grid;
    grid-template-columns: 1fr 14fr 14fr 14fr;
    grid-gap: 1rem;
    margin: 1rem;
  }


  h1 {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }

</style>