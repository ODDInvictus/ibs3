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

<dialog id="prompt-select-dialog">
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

<style lang="scss">
	$border: 10px;
	$padding: 1rem;

	dialog {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		min-width: 25rem;

		background: var(--color-primary);
		color: var(--color-text-light);
		border-radius: var(--border-radius);
		padding: 2rem;

		z-index: 1000;
	}

	select {
		width: 100%;
		padding: 0.5rem;
		border: none;
		color: var(--color-text-light);
	}

	option {
		color: var(--color-text);
	}

	.ok {
		padding: 0.5rem;
		width: 8rem;
	}

	h1,
	p {
		padding-bottom: $padding;
	}

	.buttons {
		padding-top: 1rem;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		gap: $padding;
	}

	// media query for phones
	@media (max-width: 600px) {
		#prompt-select-dialog {
			width: 550px !important;
			min-width: auto;
		}

		.ok {
			width: 6rem;
		}
	}
</style>
