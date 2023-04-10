<script lang="ts">
  import { page } from '$app/stores'
  let location = $page.data.location
</script>

<h1>{location.name}</h1>

<hr />

<table>
  <tr>
    <td>Naam</td>
    <td>{location.name}</td>
  </tr>
  <tr>
    <td>Adres</td>
    <td>{location.address}</td>
  </tr>
  <tr>
    <td>Postcode</td>
    <td>{location.postalCode}</td>
  </tr>
  <tr>
    <td>Plaats</td>
    <td>{location.city}</td>
  </tr>
  <tr>
    <td>Land</td>
    <td>{location.country}</td>
  </tr>
  <tr>
    <td>Beschrijving</td>
    <td>{location.description}</td>
  </tr>
  <tr>
    <td>ID</td>
    <td>{location.id}</td>
  </tr>
</table>

<style>
  h1 {
    text-align: center;
  }

  hr {
    margin: 0.5rem 0;
  }
</style>