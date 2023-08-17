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
		margin: 0;
		padding: 0;
		background-color: transparent;
		overflow: hidden;
	}

	.prompt[open] {
		animation: show 1s ease normal;
	}
	@keyframes show {
		from {
			transform: translate(0%, -100%);
		}
		to {
			transform: translateX(0%, 0%);
		}
	}

	img {
		max-width: calc(100vw - 2rem);
		max-height: calc(100vh - 1rem);

		object-fit: cover;
	}
</style>
