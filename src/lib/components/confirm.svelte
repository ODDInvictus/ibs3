<script lang="ts">
	import { confirmStore } from '$lib/confirm'

	$: {
		const c = $confirmStore
		if (c && c.title !== '' && c.message !== '') {
			const dialog = document.querySelector('#confirm-dialog') as HTMLDialogElement
			dialog?.showModal()
		}
	}

	async function action(confirm: boolean) {
		const dialog = document.querySelector('#confirm-dialog') as HTMLDialogElement
		await $confirmStore.cb(confirm)
		dialog?.close()
	}
</script>

<dialog id="confirm-dialog" class="confirm">
	<h1>{$confirmStore.title}</h1>

	<p>{$confirmStore.message}</p>

	<div class="buttons">
		<button class="btn-secondary ok" on:click={() => action(true)}>OK</button>
		<button on:click={() => action(false)}>Annuleren</button>
	</div>
</dialog>
