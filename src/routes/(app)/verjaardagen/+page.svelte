<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { daysLeftTill, toAge, toBirthday } from '$lib/dateUtils';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Title title="Verjaardagen" />

<table class="striped">
	<thead>
		<tr>
			<th>Naam</th>
			<th>Geboortedatum</th>
			<th>Toekomstige leeftijd</th>
			<th>Hoeveel dagen nog</th>
		</tr>
	</thead>
	<tbody>
		{#each data.birthdays as bd}
			<tr class={bd.ldapId === data.user.ldapId ? 'highlight' : ''}>
				<td>{bd.firstName} {bd.lastName} {bd.nickname ? `(${bd.nickname})` : ''}</td>
				<td>{toBirthday(bd.birthDate)}</td>
				<td>{toAge(bd.birthDate) + 1}</td>
				<td>{daysLeftTill(bd.birthDate)}</td>
			</tr>
		{/each}
	</tbody>
</table>
