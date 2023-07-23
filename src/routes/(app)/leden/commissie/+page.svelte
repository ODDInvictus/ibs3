<script lang="ts">
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';
	let committees = $page.data.committees;
</script>

<Title title="Commissies" />

{#each committees as committee}
	<div><a href="/leden/commissie/{committee.ldapId}">{committee.name}</a></div>
{/each}
