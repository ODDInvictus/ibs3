<script lang="ts">
	import { run } from 'svelte/legacy'

	import Title from '$lib/components/title.svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import { declatationSchema } from './declarationSchema'
	import SuperField from '$lib/superforms/SuperField.svelte'
	import SuperSelect from '$lib/superforms/SuperSelect.svelte'
	import Submit from '$lib/superforms/Submit.svelte'
	import SuperFileField from '$lib/superforms/SuperFileField.svelte'
	import type { PageData } from './$types'
	import { onError } from '$lib/superforms/error'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	const formProps = superForm(data.form, {
		validators: declatationSchema,
		onError,
		onSubmit: () => (src = null),
	})

	const { enhance, form, message } = formProps

	let files: FileList = $state()
	let src: string | null = $state(null)

	function showImage() {
		if (!files || files.length === 0) return

		const file = files[0]

		const reader = new FileReader()

		reader.onload = function (event) {
			src = event.target?.result?.toString() ?? null
		}

		reader.readAsDataURL(file)
	}
	run(() => {
		if (files) {
			showImage()
		}
	})
</script>

<Title title="Declaratie indienen" shortTitle="Declaratie" />

{#if $message}
	<div class="message">{$message}</div>
{/if}

<form method="POST" enctype="multipart/form-data" class="superform" use:enhance>
	<SuperField type="text" {formProps} field="product">Wat heb je gekocht?</SuperField>

	<SuperField type="text" {formProps} field="methodOfPayment">Betaalmethode</SuperField>

	<SuperSelect
		{formProps}
		field="receiveMethod"
		options={[
			['SALDO', 'Saldo'],
			['ACCOUNT', 'Rekening'],
		]}>
		Ontvangemethode
	</SuperSelect>

	{#if $form.receiveMethod === 'ACCOUNT'}
		<SuperField type="text" {formProps} field="iban">IBAN</SuperField>
	{/if}

	<SuperField type="number" {formProps} field="price" class="input-euro euro">Prijs</SuperField>

	<SuperFileField name="receipt" bind:files>Bon</SuperFileField>

	<Submit {formProps}>Verstuur</Submit>
</form>

{#if src}
	<img {src} id="receipt-image" alt="bonnetje" />
{/if}

<style lang="scss">
	img {
		max-height: 20rem;
		max-width: 80%;
		margin-top: 1rem;
	}

	@media (min-width: 600px) {
		img {
			right: 4rem;
			bottom: 4rem;
			max-width: 30%;
			max-height: 30rem;
		}
	}
</style>
