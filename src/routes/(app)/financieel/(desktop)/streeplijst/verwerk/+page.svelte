<script lang="ts">
	import { page } from '$app/stores';
	import Row from './row.svelte';
	import { confirm } from '$lib/confirm';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/notification';

	let data: RowData[] = [
		{
			id: 0,
			person: 0,
			product: 0,
			amount: 0
		}
	];

	const newRow = () => {
		data.push({
			id: data.length,
			person: 0,
			product: 0,
			amount: 0
		});
		// Tell Svelte that we updated data
		data = data;
	};

	const deleteRow = () => {
		if (data.length === 1) return;
		data.pop();
		// Tell Svelte that we updated data
		data = data;
	};

	const pagedata = $page.data;
	let error = '';

	const submit = () => {
		confirm({
			title: 'Weet je het zeker?',
			message: 'Weet je zeker dat je deze streeplijst wilt verwerken?',
			cb: async (success) => {
				if (success) await submitCb();
			}
		});
	};

	const submitCb = async () => {
		await fetch('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then((res) => {
			if (res.status === 200) {
				toast({
					title: 'Succes',
					message:
						'Alles is goed opgeslagen, je wordt binnenkort doorgestuurd naar de verkopen pagina',
					type: 'success'
				});

				setTimeout(() => goto('/financieel/transacties/verkopen'), 3000);
			} else {
				res.json().then((err) => {
					error = err.message;
				});
			}
		});
	};
</script>

<div id="root">
	<h1>Verwerk een streeplijst</h1>

	<hr />

	<button on:click={() => newRow()}>Rij toevoegen</button>
	<button on:click={() => deleteRow()}>Rij verwijderen</button>
	<button on:click={() => submit()} type="submit">Submit</button>

	<div id="error">
		{#if error}
			<p>{error}</p>
		{/if}
	</div>

	<div id="header">
		<p>ID</p>
		<p>Persoon</p>
		<p>Product</p>
		<p>Aantal</p>
	</div>

	{#each data as row}
		<Row bind:value={row} data={pagedata} />
	{/each}
</div>

<style lang="scss">
	#root {
		display: block;
	}

	button {
		margin: 1rem;
	}

	#error {
		color: red;
		margin-left: 1rem;
	}

	#header {
		display: grid;
		grid-template-columns: 1fr 14fr 14fr 14fr;
		grid-gap: 1rem;
		margin: 1rem;
	}

	h1 {
		text-align: center;
	}

	hr {
		margin: var(--hr-margin);
	}
</style>
