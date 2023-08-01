<script lang="ts">
	import { promptCheckboxStore } from '$lib/promptCheckbox';

	let currentValue = false;

	$: {
		const prompt = $promptCheckboxStore;
		if (prompt && prompt.title !== '' && prompt.message !== '') {
			const dialog = document.querySelector('#prompt-checkbox-dialog') as HTMLDialogElement;
			dialog?.showModal();
		}
	}

	async function action(confirm: boolean) {
		const dialog = document.querySelector('#prompt-checkbox-dialog') as HTMLDialogElement;
		if (confirm) {
			await $promptCheckboxStore.cb(currentValue);
			currentValue = false;
		}
		dialog?.close();
	}
</script>

<dialog id="prompt-checkbox-dialog">
	<h1>{$promptCheckboxStore.title}</h1>

	<p>{$promptCheckboxStore.message}</p>

	<div id="checkbox">
		<input
			type="checkbox"
			checked={$promptCheckboxStore.value}
			on:change={(e) => {
				// @ts-expect-error
				return (currentValue = e.target?.value === 'on');
			}}
		/>
	</div>

	<div class="buttons">
		<button class="ok btn-secondary" on:click={() => action(true)}>Opslaan</button>
		<button on:click={() => action(false)}>Annuleren</button>
	</div>
</dialog>

<style lang="scss">
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
		border: none;
		padding: 2rem;

		z-index: 1000;
	}

	#checkbox {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
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
		#prompt-checkbox-dialog {
			width: 550px !important;
			min-width: auto;
		}

		.ok {
			width: 6rem;
		}
	}
</style>
