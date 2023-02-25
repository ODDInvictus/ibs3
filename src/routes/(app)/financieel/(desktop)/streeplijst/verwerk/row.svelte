<script lang="ts">
  import { page } from '$app/stores'
	import { onMount } from 'svelte';

  onMount(() => {
    console.log($page.data)
  })

  export let value: RowData;
</script>

<div class="row">
  <label for="person">
    Persoon
  </label>
  <select name="person" bind:value={value.person}>
    <option value={1}>Niels</option>
    <option value={2}>Naut</option>
  </select>

  <label for="product">
    Product
  </label>
  <select name="product" bind:value={value.product}>
    <option value={1}>Grolsch 30cl</option>
    <option value={2}>Grolsch 45cl</option>
  </select>

  <label for="amount">
    Aantal
  </label>
  <input type="number" step={1} bind:value={value.amount}/>

</div>