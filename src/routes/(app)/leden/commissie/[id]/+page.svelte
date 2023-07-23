<script lang="ts">
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';
	let committee = $page.data.committee;
</script>

<Title title={committee.name} shortTitle="Commissie :: {committee.name}" />

{#each committee.CommitteeMember as member}
	<div class="user-card">
		<p>
			<a href="/leden/{member.member.ldapId}">{member.member.firstName} {member.member.lastName}</a>
			als {member.function}
		</p>
	</div>
{/each}
