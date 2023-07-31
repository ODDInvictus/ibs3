<script lang="ts">
	import { confirmStore } from '$lib/confirm';

	$: {
		const c = $confirmStore;
		if (c && c.title !== '' && c.message !== '') {
			const dialog = document.querySelector('#confirm-dialog') as HTMLDialogElement;
			dialog?.showModal();
		}
	}

	async function action(confirm: boolean) {
		const dialog = document.querySelector('#confirm-dialog') as HTMLDialogElement;
		await $confirmStore.cb(confirm);
		dialog?.close();
	}
</script>

<dialog id="confirm-dialog">
	<h1>{$confirmStore.title}</h1>

	<p>{$confirmStore.message}</p>

	<div class="buttons">
		<button class="btn-secondary ok" on:click={() => action(true)}>OK</button>
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
		border: none;

		padding: 2rem;

		z-index: 1000;
	}

	// media query for phones
	@media (max-width: 600px) {
		dialog {
			width: 90%;
		}
	}

	.ok {
		padding: 0.5rem;
		width: 4rem;
	}

	h1,
	p {
		padding-bottom: $padding;
	}

	.buttons {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		gap: $padding;
	}
</style>
