<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores'
  import Row from './row.svelte'

  onMount(() => {
    console.log('OnMount')
    console.log('pageData', $page.data)
  })
  
  let data: RowData[] = [{ 
    id: 0, 
    person: 1, 
    product: 1, 
    amount: 0 
  }]

  const newRow = () => {
    data.push({ 
      id: data.length, 
      person: 1, 
      product: 1, 
      amount: 0 
    })
    // Tell Svelte that we updated data
    data = data
  }


  $: {
    console.log('Something changed!', data)
  }
</script>


<div id="root">
  <h1>Verwerk een streeplijst</h1>

  <button on:click={() => newRow()}>
    +
  </button>

  {#each data as row}
    <Row bind:value={row} />
  {/each}
 
  <button>Submit</button>
</div>

<style lang="scss">
  #root {
    display: block;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }

</style>