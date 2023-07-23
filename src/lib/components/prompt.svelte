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

<dialog id="prompt-dialog">
	<h1>{$promptStore.title}</h1>

	<p>{$promptStore.message}</p>

	<input type="text" bind:value />

	<div class="buttons">
		<button class="ok" on:click={() => action(true)}>Opslaan</button>
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

		background: var(--primary-color);
		color: white;
		border-radius: $border;
		padding: 2rem;

		z-index: 1000;
	}

	input {
		width: 100%;
		padding: 0.5rem;
		border-radius: $border;
		border: none;
	}

	.ok {
		background: var(--secondary-color);
		border-radius: $border;
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
		#prompt-dialog {
			width: 550px !important;
			min-width: auto;
		}

		.ok {
			width: 6rem;
		}
	}
</style>
