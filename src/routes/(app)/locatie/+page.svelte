<script lang="ts">
  import { page } from '$app/stores'
	import { getSlug } from '$lib/textUtils';
  let locations = $page.data.locations
</script>

<h1>Locaties</h1>

<hr />

{#each locations as location}
  <div><a href="/locatie/{location.id}">{location.name}</a></div>
{/each}

<style>
  h1 {
    text-align: center;
  }

  a {
    color: var(--link-color);
  }

  hr {
    margin: 0.5rem 0;
  }
</style>