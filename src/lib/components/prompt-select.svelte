<script lang="ts">
	import { promptSelectStore } from '$lib/promptSelect';

	const opts = $promptSelectStore.options;

	let value: string =
		opts.length > 0 ? (typeof opts[0] === 'string' ? opts[0] : opts[0].value) : '';

	$: {
		const prompt = $promptSelectStore;
		if (prompt && prompt.title !== '' && prompt.message !== '') {
			const dialog = document.querySelector('#prompt-select-dialog') as HTMLDialogElement;
			dialog?.showModal();
		}
	}

	async function action(confirm: boolean) {
		const dialog = document.querySelector('#prompt-select-dialog') as HTMLDialogElement;
		if (confirm) {
			await $promptSelectStore.cb(value);
			value = '';
		}
		dialog?.close();
	}
</script>

<dialog id="prompt-select-dialog" class="select">
	<h1>{$promptSelectStore.title}</h1>

	<p>{$promptSelectStore.message}</p>

	<select bind:value>
		{#if typeof $promptSelectStore.options[0] === 'string'}
			{#each $promptSelectStore.options as option}
				<option value={option}>{option}</option>
			{/each}
		{:else}
			{#each $promptSelectStore.options as option}
				<!-- @ts-expect-error -->
				<option value={option.value}>{option.key}</option>
			{/each}
		{/if}
	</select>

	<div class="buttons">
		<button class="btn-secondary ok" on:click={() => action(true)}>Opslaan</button>
		<button on:click={() => action(false)}>Annuleren</button>
	</div>
</dialog>
