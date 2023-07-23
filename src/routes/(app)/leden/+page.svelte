<script lang="ts">
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';
	let members = $page.data.members;
</script>

<Title title="Leden en ander gespuis" shortTitle="Leden" />

{#each members as member}
	<div>
		<a href="/leden/{member.ldapId}">{member.firstName} {member.lastName}</a>
	</div>
{/each}
