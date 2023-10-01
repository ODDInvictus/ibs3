<script lang="ts">
	import type { PageData } from './$types';

	import Title from '$lib/components/title.svelte';
	import { formatDateHumanReadable } from '$lib/dateUtils';
	import { toast } from '$lib/notification';

	export let data: PageData;
</script>

<Title title={data.ledger?.name ?? 'Niet gevonden'} />

{#if data.ledger}
	<div class="top">
		<div class="left">
			<p>ID: {data.ledger.id}</p>
			<p>Omschrijving: {data.ledger.description}</p>
			<p>Actief: {data.ledger.isActive ? 'Ja' : 'Nee'}</p>
		</div>
		<div class="right">
			<a class="button" href="/financieel/ledger/{data.ledger.id}/edit">Bewerken</a>
			<button
				on:click={async () => {
					const res = await fetch('', {
						method: 'PATCH'
					});

					if (res.ok) {
						if (data.ledger) data.ledger.isActive = !data.ledger.isActive;
						else window.location.reload();
					} else {
						toast({
							title: res.statusText,
							message: 'Er is iets misgegaan bij het uitschakelen van het grootboek.',
							type: 'danger'
						});
					}
				}}>{data.ledger.isActive ? 'Uitschakelen' : 'Inschakelen'}</button
			>
			<button
				class="btn-danger"
				disabled={data.ledger.Transaction.length > 0}
				on:click={async () => {
					const confirmed = confirm('Weet je zeker dat je dit grootboek wilt verwijderen?');
					if (!confirmed) return;

					const res = await fetch('', {
						method: 'DELETE'
					});

					if (res.ok) {
						window.location.href = '/financieel/ledger';
					} else {
						toast({
							title: res.statusText,
							message: 'Er is iets misgegaan bij het verwijderen van het grootboek.',
							type: 'danger'
						});
					}
				}}>Verwijder</button
			>
		</div>
	</div>

	<h2>Transacties</h2>
	<table>
		<thead>
			<th>ID</th>
			<th>Datum</th>
			<th>Bedrag</th>
			<th>Omschrijving</th>
		</thead>
		<tbody>
			{#each data.ledger.Transaction as transaction}
				<tr>
					<td><a href="/financieel/transacties/{transaction.id}">{transaction.id}</a></td>
					<td>{formatDateHumanReadable(transaction.createdAt)}</td>
					<td>{transaction.price}</td>
					<td>{transaction.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style lang="scss">
	.top {
		display: flex;
		justify-content: space-around;
		width: 100%;
		padding: 1rem;

		.right {
			display: flex;
			gap: 10px;

			@media screen and (max-width: 600px) {
				flex-direction: column;
			}

			button,
			a {
				height: fit-content;
			}
		}
	}
</style>
