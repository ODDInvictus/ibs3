<script lang="ts">
  import { page } from '$app/stores'
  let committee = $page.data.committee
</script>

<h1>{committee.name}</h1>

<hr />

{#each committee.CommitteeMember as member}
  <div class="user-card">
    <p>
      <a href="/leden/{member.member.ldapId}">{member.member.firstName} {member.member.lastName}</a> 
      als {member.function}</p>
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