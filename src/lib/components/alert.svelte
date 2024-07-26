<script lang="ts">
	import { alertStore } from '$lib/alert'

	$: {
		const prompt = $alertStore
		if (prompt && prompt.title !== '' && prompt.message !== '') {
			const dialog = document.querySelector('#alert-dialog') as HTMLDialogElement
			dialog?.showModal()
		}
	}

	function close() {
		const dialog = document.querySelector('#alert-dialog') as HTMLDialogElement
		dialog?.close()
	}
</script>

<dialog id="alert-dialog" class="prompt">
	<h1>{$alertStore.title}</h1>
	<p>{$alertStore.message}</p>
	<div class="buttons">
		<button class="btn-secondary" on:click={close}>Sluiten</button>
	</div>
</dialog>
