<script lang="ts">
	import { confirm } from '$lib/confirm';
	import { toast } from '$lib/notification';
	import type { PageData } from './$types';

	export let data: PageData;

	const submit = () => {
		confirm({
			title: 'Weet je het zeker?',
			message: 'Weet je zeker dat je deze transacties wilt verwerken?',
			cb: async (success) => {
				if (success) await submitCb();
			}
		});
	};

	const submitCb = async () => {
		await fetch('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then((res) => {
			if (res.status === 200) {
				toast({
					title: 'Verwerkt',
					message:
						'Alles is goed opgeslagen, je wordt binnenkort doorgestuurd naar de transacties pagina',
					type: 'success'
				});

				setTimeout(() => {
					window.location.href = '/financieel/transacties/';
				}, 3000);
			} else {
				toast({
					title: 'Er is iets fout gegaan',
					message: 'Er is iets fout gegaan bij het verwerken van de streeplijst',
					type: 'danger'
				});
			}
		});
	};
</script>

<div id="root">
	<h1>Verkopen</h1>

	<hr />

	<div id="buttons"><button on:click={submit}> Converteer naar transacties </button></div>

	{#if data.sales.length == 0}
		<div class="not-found">
			<h2>Geen verkopen gevonden</h2>
			<a href="/financieel/streeplijst/verwerk">Verwerk een streeplijst!</a>
		</div>
	{/if}

	<table class="equal-width striped small">
		<thead>
			<tr>
				<th>ID</th>
				<th>Product</th>
				<th>Aantal</th>
				<th>Verkocht aan</th>
				<th>Prijs</th>
				<th>Verander</th>
			</tr>
		</thead>
		<tbody>
			{#each data.sales as sale}
				<tr>
					<td>{sale.id}</td>
					<td>{sale.product.name}</td>
					<td id="amount">{sale.amount}</td>
					<td>{sale.person.name}</td>
					<td>€ {Number(sale.product.price * sale.amount).toFixed(2)}</td>
					<td>
						<a href="/financieel/transacties/verkopen/{sale.id}/">Verander</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.not-found {
		text-align: center;
	}

	#buttons {
		display: flex;
		justify-content: center;
		margin: 1rem;
	}

	h1 {
		text-align: center;
		padding-bottom: 0.5rem;
	}
</style>
