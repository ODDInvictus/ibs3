<script lang="ts">
	import { page } from '$app/stores';
	import Check from '~icons/tabler/square-rounded-check';
	import Edit from '~icons/tabler/edit';
	import XCircle from '~icons/tabler/circle-x';
	import Title from '$lib/components/title.svelte';

	let error = '';

	function formatPrice(price: number) {
		return price.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' });
	}

	async function process(id: number, type: 'accept' | 'decline') {
		const accept = confirm(
			'Weet je zeker dat je deze declaratie wilt ' +
				(type === 'accept' ? 'goedkeuren?' : 'afkeuren?')
		);

		if (!accept) return;
		await fetch('', {
			method: 'POST',
			body: JSON.stringify({ id, type })
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.status !== 200) {
					error = res.message;
				} else {
					removeRow(id);
				}
			})
			.catch((err) => (error = err.message));
	}

	function removeRow(id: number) {
		// select the tr where x-id = id
		const row = document.querySelector(`tr[data-id="${id}"]`);
		row?.remove();
	}
</script>

<div id="root">
	<Title
		title="Declaratie overzicht"
		shortTitle="Declaratie overzicht"
		underTitle="Hieronder staan alle declaraties die zijn gedaan door gebruikers van IBS. Wanneer je een
	declaratie goedkeurd zal het saldo worden aangepast."
	/>

	<div class="buttons">
		<a href="/financieel/declaratie">Wil je een declaratie doen?</a>
	</div>

	<p class="error">
		{#if error}
			{error}
		{/if}
	</p>

	<div class="table-wrapper">
		<table>
			<thead>
				<tr>
					<th>Id</th>
					<th>Prijs</th>
					<th>Datum</th>
					<th>Persoon</th>
					<th>Reden</th>
					<th>Betaalwijze</th>
					<th>Acties</th>
				</tr>
			</thead>
			<tbody>
				{#if !$page.data.declarations.length}
					<tr>
						<td colspan="7">
							<p id="no-decla">Geen declaraties gevonden</p>
							<a href="/financieel/declaratie" class="link">Wil je een declaratie doen?</a>
						</td>
					</tr>
				{/if}
				{#each $page.data.declarations as declaration}
					<tr data-id={declaration.id}>
						<td>{declaration.id}</td>
						<td class="price">{formatPrice(declaration.price)}</td>
						<td>{new Date(declaration.createdAt).toLocaleString('nl-NL')}</td>
						<td>{declaration.person.name}</td>
						<td>{declaration.reason}</td>
						<td>{declaration.methodOfPayment}</td>
						<td>
							<div class="actions">
								<button class="btn-a" on:click={() => process(declaration.id, 'accept')}>
									<Check class="text-green-500" />
								</button>
								<button class="btn-a" on:click={() => process(declaration.id, 'decline')}>
									<XCircle class="text-red-500" />
								</button>
								<a href="/financieel/declaratie/{declaration.id}">
									<Edit class="text-purple-500" />
								</a>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style lang="scss">
	.actions {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.buttons {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	@media (max-width: 640px) {
		#root {
			overflow: hidden;
		}

		.table-wrapper {
			overflow-x: scroll;
		}

		table {
			width: 100%;
			overflow: scroll;
		}

		tr {
			height: 0;
		}

		td {
			height: 0;
		}

		.actions {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}

	.error {
		color: var(--error-color);
	}

	#no-decla {
		font-size: 1.1rem;
	}

	.link:hover {
		text-decoration: underline;
		cursor: pointer;
	}
</style>
