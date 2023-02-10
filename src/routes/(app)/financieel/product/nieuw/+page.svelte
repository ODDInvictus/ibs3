<script>
  import { page } from '$app/stores'
</script>

<h1>Nieuw product aanmaken</h1>

<form method="POST">
  <label for="name">Naam</label>
  <input type="text" name="name" id="name" />

  <label for="description">Omschrijving</label>
  <input type="text" name="description" id="description" />

  <label for="price">Prijs</label>
  <input type="number" name="price" id="price" />

  <label for="categoryId">Categorie</label>
  <select name="categoryId" id="categoryId">
    {#each $page.data.categories as category}
      <option value="{category.id}">{category.name}</option>
    {/each}
  </select>

  <label for="kcal">Kcal</label>
  <input type="number" name="kcal" id="kcal" />

  <label for="alcohol">Alcohol %</label>
  <input type="number" name="alcohol" id="alcohol" />

  <label for="volume">Volume (mL)</label>
  <input type="number" name="volume" id="volume" />

  <label for="weight">Gewicht (gram)</label>
  <input type="number" name="weight" id="weight" />

  <button type="submit">Opslaan</button>
</form>

