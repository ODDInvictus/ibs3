<script lang="ts">
  import { page } from '$app/stores'

  export let value: RowData;
  export let data: any;
</script>

<div class="row">
  <div>
    <h3>{value.id}</h3>
  </div>
  <select name="person" bind:value={value.person}>
    <option value={0}>Kies een persoon</option>
    {#each Object.entries(data.financialPeople) as [key, arr]}
      <optgroup label={key}>
        {#each arr as person}
          <option value={person.id}>{person.name}</option>
        {/each}
    {/each}
  </select>

  <select name="product" bind:value={value.product}>
    <option value={0}>Kies een product</option>
    {#each data.products as product}
      <option value={product.id}>{product.name}</option>
    {/each}
  </select>

  <input type="number" step={1} bind:value={value.amount}/>

</div>

<style>
  .row {
    display: grid;
    grid-template-columns: 1fr 14fr 14fr 14fr;
    grid-gap: 1rem;
    margin: 1rem;
  }
</style>