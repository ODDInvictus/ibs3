<script lang="ts">
	import { promptCheckboxStore } from '$lib/promptCheckbox'

	let currentValue = false

	$: {
		const prompt = $promptCheckboxStore
		if (prompt && prompt.title !== '' && prompt.message !== '') {
			const dialog = document.querySelector('#prompt-checkbox-dialog') as HTMLDialogElement
			dialog?.showModal()
		}
	}

	async function action(confirm: boolean) {
		const dialog = document.querySelector('#prompt-checkbox-dialog') as HTMLDialogElement
		if (confirm) {
			await $promptCheckboxStore.cb(currentValue)
			currentValue = false
		}
		dialog?.close()
	}
</script>

<dialog id="prompt-checkbox-dialog" class="checkbox">
	<h1>{$promptCheckboxStore.title}</h1>

	<p>{$promptCheckboxStore.message}</p>

	<div id="checkbox">
		<input
			type="checkbox"
			checked={$promptCheckboxStore.value}
			on:change={e => {
				// @ts-expect-error
				return (currentValue = e.target?.checked)
			}} />
	</div>

	<div class="buttons">
		<button class="ok btn-secondary" on:click={() => action(true)}>Opslaan</button>
		<button on:click={() => action(false)}>Annuleren</button>
	</div>
</dialog>
