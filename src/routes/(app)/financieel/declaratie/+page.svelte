<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import validators from './declarationSchema';
	import type { PageData } from './$types';
	import { onError } from '$lib/superforms/error';
	import SuperField from '$lib/superforms/SuperField.svelte';
	import SuperSelect from '$lib/superforms/SuperSelect.svelte';
	import Submit from '$lib/superforms/Submit.svelte';
	import SuperFileField from '$lib/superforms/SuperFileField.svelte';

	export let data: PageData;

	const formProps = superForm(data.form, {
		validators,
		onError
	});

	const { enhance, form, message } = formProps;

	let files: FileList;
	let src: string | null = null;

	$: if (files) {
		showImage();
	}

	function showImage() {
		if (!files || files.length === 0) return;

		const file = files[0];

		const reader = new FileReader();

		reader.onload = function (event) {
			src = event.target?.result?.toString() ?? null;
		};

		reader.readAsDataURL(file);
	}
</script>

<Title
	title="Doe een declaratie"
	shortTitle="Declaratie"
	underTitle="Heb je bier gekocht, of wil je gewoon geld van ons? Doe dan een declaratie!"
/>

{#if $message}
	<div class="message">{$message}</div>
{/if}

<form method="POST" enctype="multipart/form-data" class="superform" use:enhance>
	<SuperField type="text" {formProps} field="product">Wat heb je gekocht</SuperField>

	<SuperField type="text" {formProps} field="methodOfPayment">Betaalmethode</SuperField>

	<SuperSelect
		{formProps}
		field="receiveMethod"
		options={[
			['SALDO', 'Saldo'],
			['BANK', 'Rekening']
		]}
	>
		Hoe wil je terug betaald worden?
	</SuperSelect>

	{#if $form.receiveMethod === 'BANK'}
		<SuperField type="text" {formProps} field="iban">IBAN</SuperField>
	{/if}

	<SuperField type="number" {formProps} field="price" class="input-euro euro">Prijs</SuperField>

	<SuperFileField name="receipt" bind:files>Bon</SuperFileField>

	<Submit {formProps}>Verstuur</Submit>
</form>

{#if src}
	<img {src} id="receipt-image" alt="Hier komt je bonnetje te staan" />
{/if}
