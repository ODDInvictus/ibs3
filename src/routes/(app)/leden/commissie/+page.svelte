<script lang="ts">
  import { page } from '$app/stores'
  let committees = $page.data.committees
</script>


<h1>Commissies</h1>

<hr />

{#each committees as committee}
  <div><a href="/leden/commissie/{committee.ldapId}">{committee.name}</a></div>
{/each}

<style>
  h1 {
    text-align: center;
  }

  a {
    color: var(--link-color);
  }

  hr {
    margin: var(--hr-margin);
  }
</style>