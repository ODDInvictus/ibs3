<script lang="ts">
  import { page } from '$app/stores'
</script>

<h1>
  Oei! Activiteit {$page.params.id} niet gevonden.
</h1>

<hr />

<p>Misschien is dit verwijderd of ben je zelf gewoon dom.</p>

<style>
  h1, p {
    text-align: center;
  }

  hr {
    margin: var(--hr-margin);
  }
</style>