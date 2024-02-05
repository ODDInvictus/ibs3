<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import { intProxy, superForm } from 'sveltekit-superforms/client';
	import Submit from '$lib/superforms/Submit.svelte';
	import SuperField from '$lib/superforms/SuperField.svelte';
	import { categorySchema } from './categorySchema';
	import { onError } from '$lib/superforms/error';

	export let data: PageData;

	const formProps = superForm(data.form, {
		// Zod schema for client side validation
		validators: categorySchema,
		// Error handeler for thrown errors (403, 500 etc.)
		onError
	});
	const { form, enhance } = formProps;
	const idProxy = intProxy(form, 'id');
</script>

<Title title="Categorie {data.id ? 'berwerken' : 'aanmaken'}" />

<form method="POST" use:enhance class="superform">
	<input type="hidden" name="id" bind:value={$idProxy} />
	<SuperField type="text" {formProps} field="name">Naam</SuperField>
	<SuperField type="textarea" {formProps} field="description">Beschrijving</SuperField>
	<SuperField type="checkbox" {formProps} field="isActive">Actief?</SuperField>
	<Submit {formProps}>Opslaan</Submit>
</form>
