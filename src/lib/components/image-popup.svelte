<script lang="ts">
	import { imagePreviewStore } from '$lib/imagePreviewStore';

	let dialog: HTMLDialogElement;

	$: {
		if ($imagePreviewStore && $imagePreviewStore.image !== '') {
			dialog?.showModal();
		}
	}

	function close() {
		dialog?.close();
	}
</script>

<dialog
	id="image-preview-dialog"
	class="prompt"
	bind:this={dialog}
	on:click={close}
	role="button"
	tabindex="0"
>
	<img src={$imagePreviewStore.image} alt="img-preview" />
</dialog>

<style lang="scss">
	.prompt {
		padding: 1rem;

		background-color: transparent;
	}

	.buttons {
		margin: 0;
	}

	// Mobile
	@media (max-width: 600px) {
		.buttons {
			padding: 1rem;
		}
	}

	img {
		max-width: calc(100vw - 2rem);

		object-fit: contain;
	}
</style>
