<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import Submit from '$lib/superforms/Submit.svelte'
	import { onError } from '$lib/superforms/error'
	import { superForm } from 'sveltekit-superforms/client'
	import type { PageData } from './$types'
	import SuperFileField from '$lib/superforms/SuperFileField.svelte'
	import { toast } from '$lib/notification'

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
					message: 'File upload failed',
					title: 'Error',
					type: 'danger',
				})
			}
		},
	})

	const { enhance } = formProps
</script>

<Title title="File upload" />

<form method="post" enctype="multipart/form-data" class="superform" use:enhance>
	<SuperFileField {formProps} name="file">File</SuperFileField>
	<Submit {formProps}>Uploaden</Submit>
</form>
