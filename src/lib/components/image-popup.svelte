<script lang="ts">
	import { imagePreviewStore } from '$lib/imagePreviewStore'

	let dialog: HTMLDialogElement

	$: {
		if ($imagePreviewStore && $imagePreviewStore.image !== '') {
			dialog?.showModal()
		}
	}

	function close() {
		dialog?.close()
	}
</script>

<!-- svelte-ignore a11y-positive-tabindex -->
<dialog id="image-preview-dialog" class="prompt" bind:this={dialog} on:click={close} role="button" tabindex="1">
	<div class="img"><img src={$imagePreviewStore.image} alt="img-preview" /></div>
</dialog>

<style lang="scss">
	.prompt {
		margin: 0;
		padding: 0;
		background-color: transparent;

		max-height: 100vh;
		max-width: 100vw;

		overflow: hidden;

		outline: none;
	}

	.img {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
	}

	.prompt[open] {
		animation: show 0.5s ease normal;
		// Dit zorgt ervoor, samen met de translate(-50%, -50%) dat hij draait om zijn as.
		transform-origin: top left;
	}
	@keyframes show {
		from {
			transform: scale(0.1, 0.1) translate(-50%, -50%);
		}
		to {
			transform: scale(1, 1) translate(-50%, -50%);
		}
	}

	img {
		max-width: calc(100vw - 2rem);
		max-height: calc(100vh - 1rem);

		object-fit: cover;
	}
</style>
