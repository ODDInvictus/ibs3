<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import { toast } from '$lib/notification'

	export let data: PageData
</script>

<Title title="Relaties" />

<div class="ongeveer-nav">
	<a href="/ongeveer/relations/create?id={data.relation.id}" class:disabled={data.relation.type !== 'OTHER'}> Bewerk </a>

	<button
		on:click={async () => {
			const res = await fetch('', {
				method: 'PATCH',
			})

			if (res.ok) {
				if (data.relation) data.relation.isActive = !data.relation.isActive
				else window.location.reload()
			} else {
				toast({
					title: res.statusText,
					message: (await res.text()) || 'Er is iets misgegaan bij het uitschakelen van de relatie.',
					type: 'danger',
				})
			}
		}}>{data.relation.isActive ? 'Uitschakelen' : 'Inschakelen'}</button>

	<button
		on:click={async () => {
			const res = await fetch('', {
				method: 'DELETE',
			})
			if (res.ok) window.location.href = '/ongeveer/relations'
			else
				toast({
					title: res.statusText,
					message: (await res.text()) || 'Er is iets misgegaan bij het verwijderen van de relatie.',
					type: 'danger',
				})
		}}
		disabled={Object.values(data.relation._count).some(count => count > 0) || data.relation.type !== 'OTHER'}
		data-testid="delete-btn">
		Verwijder
	</button>
</div>

<table class="info">
	<tr>
		<th>ID</th>
		<td>{data.relation.id}</td>
	</tr>
	<tr>
		<th>Actief</th>
		<td>{data.relation.isActive}</td>
	</tr>
	<tr>
		<th>Naam</th>
		<td>{data.relation.name}</td>
	</tr>
	<tr>
		<th>Omschrijving</th>
		<td>{data.relation.FinancialPersonDataOther?.description ?? '-'}</td>
	</tr>
	<tr>
		<th>IBAN</th>
		<td>{data.relation.FinancialPersonDataOther?.iban ?? '-'}</td>
	</tr>
	<tr>
		<th>Adres</th>
		<td>{data.relation.FinancialPersonDataOther?.address ?? '-'}</td>
	</tr>
	<tr>
		<th>Postcode</th>
		<td>{data.relation.FinancialPersonDataOther?.postalCode ?? '-'}</td>
	</tr>
	<tr>
		<th>Plaats</th>
		<td>{data.relation.FinancialPersonDataOther?.city ?? '-'}</td>
	</tr>
	<tr>
		<th>Email</th>
		<td>{data.relation.FinancialPersonDataOther?.email ?? '-'}</td>
	</tr>
</table>

<style lang="scss">
	.info {
		margin-top: 1rem;
		width: fit-content;

		th,
		td {
			text-align: left;
		}
	}
</style>
