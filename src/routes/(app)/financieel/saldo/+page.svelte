<script lang="ts">
  import { page } from '$app/stores';
	import { formatPrice } from '$lib/textUtils';

  const personId = $page.data.own.personId
</script>

<h1>Saldo overzicht</h1>

<table>
  <thead>
    <tr>
      <th>Naam</th>
      <th>Saldo</th>
    </tr>
  </thead>
{#each $page.data.persons as person}
  <tr class={personId === person.personId ? 'person-self' : 'person-other'}>
    <td>{person.person.name}</td>
    <td class="euro">{formatPrice(person.person.balance)}</td>
  </tr>
{/each}
</table>

<style lang="scss">
  h1 {
    font-size: 1.5rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    td {
      padding: 0.5rem;
      text-align: center;
    }
  }

  .person-self {
    background-color: purple;
    color: white;
  }
</style>