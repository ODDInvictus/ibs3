<script lang="ts">
	import { confirmStore } from '$lib/confirm';

	$: {
		const c = $confirmStore;
		console.log('change', c);
		if (c && c.title !== '' && c.message !== '') {
			const dialog = document.querySelector('dialog');
			dialog?.showModal();
		}
	}

	function action(confirm: boolean) {
		const dialog = document.querySelector('dialog');
		$confirmStore.cb(confirm);
		dialog?.close();
	}
</script>

<dialog>
	<h1>{$confirmStore.title}</h1>

	<p>{$confirmStore.message}</p>

	<div class="buttons">
		<button class="ok" on:click={() => action(true)}>OK</button>
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

	// media query for phones
	@media (max-width: 600px) {
		dialog {
			width: 90%;
		}
	}

	.ok {
		background: var(--secondary-color);
		border-radius: $border;
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
