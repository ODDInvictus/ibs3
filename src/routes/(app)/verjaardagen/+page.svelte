<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { daysLeftTill, toAge, toBirthday } from '$lib/dateUtils'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Title title="Verjaardagen" />

<div class="wrapper">
	<table class="striped">
		<thead>
			<tr>
				<th>Naam</th>
				<th>Geboortedatum</th>
				<th>Hoeveel dagen nog</th>
			</tr>
		</thead>
		<tbody>
			{#each data.birthdays as bd}
				<tr class={bd.ldapId === data.user.ldapId ? 'highlight' : ''}>
					<td><a href="/leden/{bd.ldapId}">{bd.firstName} {bd.lastName} {bd.nickname ? `(${bd.nickname})` : ''}</a></td>
					<td>{toBirthday(bd.birthDate)}</td>
					<td>{daysLeftTill(bd.birthDate)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style lang="scss">
	.highlight {
		a {
			color: white;
		}
	}

	@media (max-width: 600px) {
		.wrapper {
			overflow-x: scroll !important;
		}
	}
</style>
