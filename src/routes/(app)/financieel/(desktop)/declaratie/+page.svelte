<script lang="ts">
	import { onMount } from 'svelte';

  let type = 'product'
  let productData = {
    product: 0,
    price: 0,
    statiegeld: 0,
    amount: 0,
    receipt: ''
  }
</script>

<h1>Doe een declaratie</h1>
<p>Heb je bier gekocht, of wil je gewoon geld van ons? Doe dan een declaratie!</p>

<div>
  <input type="radio" name="type" bind:group={type} value="product" id="product">
  <label for="product">Etenswaren</label>

  <input type="radio" name="type" bind:group={type} value="anders" id="anders">
  <label for="anders">Anders</label>
</div>

{#if type == 'product'}
  <form method="POST" enctype="multipart/form-data">
    <label for="product">Product</label>
    <input type="text" name="product" id="product" bind:value={productData.product}>

    <label for="statiegeld">Prijs</label>
    <input type="number" name="statiegeld" id="statiegeld" bind:value={productData.price}>

    <label for="statiegeld">Statiegeld</label>
    <input type="number" name="statiegeld" id="statiegeld" bind:value={productData.statiegeld}>

    <label for="amount">Aantal</label>
    <input type="number" name="amount" id="amount" bind:value={productData.amount}>

    <label for="receipt">Bon</label>
    <input type="file" name="receipt" id="receipt" bind:value={productData.receipt}>

    <button type="submit">Verstuur</button>
  </form>
{:else if type == 'anders'}
  Andersform
{/if}

<style lang="scss">
  h1 {
    font-size: 1.5rem;
  }

</style>