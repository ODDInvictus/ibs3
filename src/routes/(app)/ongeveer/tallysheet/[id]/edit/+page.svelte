<script lang="ts">
	import type { PageData } from './$types'
	import { editTallySheetSchema } from './editTallySheetSchema'
	import Title from '$lib/components/title.svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import { onError } from '$lib/superforms/error'
	import SuperField from '$lib/superforms/SuperField.svelte'
	import Submit from '$lib/superforms/Submit.svelte'
	import { toast } from '$lib/notification'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	const formProps = superForm(data.form, {
		validators: editTallySheetSchema,
		onError,
	})
	const { enhance } = formProps
</script>

<Title title="Streeplijst bewerken" />

<p>
	Je kan alleen de info veranderen, om de streeplijst te veranderen ga je naar <a href="/ongeveer/sales">verkoop</a>
	en pas je de boekstukken aan.
</p>
<br />

<form method="POST" use:enhance class="superform">
	<SuperField type="date" {formProps} field="begin">Begin streeplijst</SuperField>

	<SuperField type="date" {formProps} field="end">Einde streeplijst</SuperField>

	<SuperField type="textarea" {formProps} field="notes">Notes</SuperField>

	<div class="btns">
		<Submit {formProps}>Opslaan</Submit>
		<a href="/ongeveer/tallysheet/{data.id}" class="button">Terug</a>
		<button
			type="button"
			class="btn-danger"
			disabled={!data.canDelete}
			onclick={async () => {
				// TODO: Zeg in confirm hoeveel boekstukken er zijn ofz
				if (confirm('Weet je zeker dat je deze streeplijst wilt verwijderen?')) {
					const res = await fetch('', { method: 'DELETE' })
					if (res.ok) {
						location.href = '/ongeveer/tallysheet'
					} else {
						toast({
							type: 'danger',
							message: 'Er is iets fout gegaan bij het verwijderen van de streeplijst',
							title: res.status + ' ' + res.statusText,
						})
					}
				}
			}}>Verwijderen</button>
	</div>
</form>

<style>
	.btns {
		display: flex;
		margin-top: 1rem;
		gap: 1rem;
	}
</style>
