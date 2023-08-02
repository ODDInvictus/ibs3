<script lang="ts">
	import { promptStore } from '$lib/prompt';

	let value: string = '';

	$: {
		const prompt = $promptStore;
		if (prompt && prompt.title !== '' && prompt.message !== '') {
			const dialog = document.querySelector('#prompt-dialog') as HTMLDialogElement;
			dialog?.showModal();
		}
	}

	async function action(confirm: boolean) {
		const dialog = document.querySelector('#prompt-dialog') as HTMLDialogElement;
		if (confirm) {
			await $promptStore.cb(value);
			value = '';
		}
		dialog?.close();
	}
</script>

<dialog id="prompt-dialog" class="prompt">
	<h1>{$promptStore.title}</h1>
	<p>{$promptStore.message}</p>
	<input type="text" bind:value />
	<div class="buttons">
		<button class="ok btn-secondary" on:click={() => action(true)}>Opslaan</button>
		<button on:click={() => action(false)}>Annuleren</button>
	</div>
</dialog>
