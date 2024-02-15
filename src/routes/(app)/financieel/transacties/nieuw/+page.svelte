<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import SuperField from '$lib/superforms/SuperField.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { createTransactionSchema } from './createTransaction';
	import { onError } from '$lib/superforms/error';
	import SuperSelect from '$lib/superforms/SuperSelect.svelte';
	import Submit from '$lib/superforms/Submit.svelte';

	export let data: PageData;

	const formProps = superForm(data.form, {
		validators: createTransactionSchema,
		onError
	});

	const { enhance } = formProps;
</script>

<Title title="Transactie maken" />

<form method="post" class="superform" use:enhance>
	<SuperField type="number" {formProps} field="amount">Bedrag</SuperField>

	<SuperSelect {formProps} field="to" options={data.users.map((fp) => [fp.id, fp.name])}>
		Aan
	</SuperSelect>

	<SuperField type="text" {formProps} field="description">Omschrijving</SuperField>

	<Submit {formProps}>Opslaan</Submit>
</form>
