<script lang="ts">
	import { enhance } from '$app/forms'
	import { toast } from '$lib/notification'

	let files: FileList | undefined = $state()
	let keys: string[] = $state([])
	let transactions: string[][] = $state([])

	const handleNewFile = async () => {
		if (!files || files.length === 0) {
			keys = []
			transactions = []
			return
		}
		const file = files[0]
		const json = csvToJSON(await file.text())
		keys = json.shift() ?? []
		transactions = json
	}

	const csvToJSON = (csv: string) => {
		const data = csv.split('\n')
		const keys = data.shift()?.split(',') ?? []
		const transactions: string[][] = []
		for (const row of data) {
			transactions.push(row.split(','))
		}
		return [keys, ...transactions]
	}
</script>

<form
	method="POST"
	use:enhance={() => {
		const confirmed = confirm('Weet je zeker dat je deze transacties wilt opslaan?')
		if (!confirmed) return

		return ({ result }) => {
			if (result.type === 'success') {
				toast({
					title: 'Gelukt!',
					message: 'Bank transacties succesvol opgeslagen',
					type: 'success',
				})
				files = undefined
				handleNewFile()
			} else {
				toast({
					title: result.status?.toString() || 'Error',
					message: 'Er is iets misgegaan',
					type: 'danger',
				})
			}
		}
	}}
	enctype="multipart/form-data">
	<input type="file" name="file" id="file" bind:files onchange={handleNewFile} accept=".csv" />
	<button type="submit">Upload</button>
</form>

{#if keys.length > 0}
	<h2>Geselecteerde bestand:</h2>
{/if}
<table>
	<thead>
		{#each keys as key}
			<th>{key}</th>
		{/each}
	</thead>
	<tbody>
		{#each transactions as transaction}
			<tr>
				{#each transaction as value}
					<td>{value}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	button {
		width: fit-content;
	}
</style>
