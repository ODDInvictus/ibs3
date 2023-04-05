<script lang="ts">
  import { page } from '$app/stores'

  const data = $page.data
</script>

<div id="root">
  <h1>Verkoop #{data.sale.id}</h1>
  
  <p>Aangemaakt op: {new Date(data.sale.createdAt).toLocaleString('NL-nl')}</p>
  <p>Laatst aangepast: {new Date(data.sale.updatedAt).toLocaleString('NL-nl')}</p>

  <form method="POST">
    <label for="amount">Aantal</label>
    <input type="number" name="amount" id="amount" value={data.sale.amount} />

    <label for="product">Product</label>
    <select name="product" id="product">
      {#each data.products as product}
        <option value={product.id} selected={product.id === data.sale.product.id}>{product.name}</option>
      {/each}
    </select>

    <label for="person">Persoon</label>
    <select name="person" value={data.sale.person.id}>
      <option value={0}>Kies een persoon</option>
      {#each Object.entries(data.people) as [key, arr]}
        <optgroup label={key}>
          {#each arr as person}
            <option value={person.id}>{person.name}</option>
          {/each}
      {/each}
    </select>

    <button type="submit">Verander</button>
  </form>
</div>

<style lang="scss">
  h1 {
    font-size: 1.5rem;
  }

  select {
    margin-top: 1rem;
  }
</style>