<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import { toast } from '$lib/notification';

	export let data: PageData;
</script>

<Title title="Relaties" />
<main>
	{#if data.relation}
		<div class="actions">
			<a href="/ongeveer/relations/create?id={data.relation.id}" class="button">Bewerk</a>
			<button
				on:click={async () => {
					const res = await fetch('', {
						method: 'PATCH'
					});

					if (res.ok) {
						if (data.relation) data.relation.isActive = !data.relation.isActive;
						else window.location.reload();
					} else {
						toast({
							title: res.statusText,
							message: 'Er is iets misgegaan bij het uitschakelen van de relatie.',
							type: 'danger'
						});
					}
				}}>{data.relation.isActive ? 'Uitschakelen' : 'Inschakelen'}</button
			>
			<button
				on:click={async () => {
					const res = await fetch('', {
						method: 'DELETE'
					});
					if (res.ok) window.location.href = '/ongeveer/relations';
					else
						toast({
							title: res.statusText,
							message: 'Er is iets misgegaan bij het verwijderen van de relatie.',
							type: 'danger'
						});
				}}
				disabled={Object.values(data.relation._count).some((count) => count > 0)}
			>
				Verwijder
			</button>
		</div>
		<div class="info">
			<p>ID: {data.relation.id}</p>
			<p>Actief: {data.relation.isActive}</p>
			<p>Naam: {data.relation.name}</p>
			<p>Omschrijving: {data.relation.FinancialPersonDataOther?.description}</p>
			<p>IBAN: {data.relation.FinancialPersonDataOther?.iban ?? 'Onbekend'}</p>
			<p>Adres: {data.relation.FinancialPersonDataOther?.address}</p>
			<p>Postcode: {data.relation.FinancialPersonDataOther?.postalCode}</p>
			<p>Plaats: {data.relation.FinancialPersonDataOther?.city}</p>
			<p>Email: {data.relation.FinancialPersonDataOther?.email}</p>
		</div>
	{/if}
</main>

<style lang="scss">
	.actions {
		margin-top: 1rem;

		a:hover {
			text-decoration: underline;
		}
	}

	.info {
		margin-top: 1rem;
	}
</style>
