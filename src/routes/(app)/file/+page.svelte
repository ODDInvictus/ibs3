<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import Submit from '$lib/superforms/Submit.svelte'
	import { onError } from '$lib/superforms/error'
	import { superForm } from 'sveltekit-superforms/client'
	import type { PageData } from './$types'
	import SuperFileField from '$lib/superforms/SuperFileField.svelte'
	import { toast } from '$lib/notification'
	import SuperField from '$lib/superforms/SuperField.svelte'

	export let data: PageData

	const formProps = superForm(data.form, {
		onError,
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast({
					title: 'File upload succesvol',
					message: `${result.data?.name} is opgeslagen`,
					type: 'success',
				})
			} else {
				toast({
					title: 'Er is iets misgegaan',
					message: result.data?.message,
					type: 'danger',
				})
			}
		},
	})

	const { enhance } = formProps
</script>

<Title title="Bestand uploaden" underTitle="Hier kan je een generiek bestandje uploaden, denk aan PDFjes voor ALVs o.i.d." />

<div class="topbar">
	<a href="/file/overzicht">Overzicht bestanden</a>
</div>

<form method="post" enctype="multipart/form-data" class="superform" use:enhance>
	<SuperFileField {formProps} name="file">Bestand</SuperFileField>
	<SuperField type="checkbox" {formProps} field="isPhoto">Foto? (dus compressie)</SuperField>
	<Submit {formProps}>Uploaden</Submit>
</form>

<style>
	.topbar {
		display: flex;
		justify-content: center;
	}
</style>
