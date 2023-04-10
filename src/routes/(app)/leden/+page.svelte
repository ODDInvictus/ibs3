<script lang="ts">
  import { page } from '$app/stores'
  let members = $page.data.members
</script>


<h1>Leden en ander gespuis</h1>

<hr />

{#each members as member}
  <div>
    <a href="/leden/{member.ldapId}">{member.firstName} {member.lastName}</a>
  </div>
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