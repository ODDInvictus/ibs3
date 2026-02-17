<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import Markdown from '$lib/components/Markdown.svelte'
	import Callout from '$lib/components/callout.svelte'
	import { fileProxy, superForm } from 'sveltekit-superforms'
	import { markdown, markdownMinimal } from '$lib/utils'
	import { saveLocation, searchLocation } from './location.remote'
	import flatpickr from 'flatpickr'
	import { Dutch } from 'flatpickr/dist/l10n/nl.js'
	import 'flatpickr/dist/flatpickr.css'
	import { formatDateTimeHumanReadable } from '$lib/dateUtils'
	import type { PageProps } from './$types.js'
	import { browser } from '$app/environment'
	import { page } from '$app/state'

	let { data }: PageProps = $props()

	const { form, constraints, enhance, message, delayed } = superForm(data.form, {
		legacy: false,
		resetForm: false,
		applyAction: true,
		invalidateAll: true,
		multipleSubmits: 'prevent',
	})

	const image = fileProxy(form, 'image')

	let nameMarkdown = $derived(markdownMinimal($form.name))
	let descriptionMarkdown = $derived(markdownMinimal($form.description))

	let locationSearch: { name: string; id: number }[] = $state([])

	$effect(() => {
		if (saveLocation.result) {
			setTimeout(() => {
				$form.location = saveLocation.result!
				closeDialog()
			}, 500)
		}
	})

	$effect(() => {
		if (saveLocation.fields.name.value()?.length >= 2) {
			searchLocation(saveLocation.fields.name.value()).then(ls => (locationSearch = ls))
		}
	})

	$effect(() => {
		if ($form.location === -1) {
			dialog = true
		}
	})

	let dialog = $state(false)

	function closeDialog() {
		dialog = false
	}

	function selectSuggestedLocation() {
		$form.location = locationSearch[0].id
		closeDialog()
	}

	let options = $state({
		altInput: true,
		altFormat: 'j F Y, H:i',
		locale: Dutch,
		weekNumbers: true,
		enableTime: true,
		formatDate: (dateObj: Date, formatStr: string) => {
			if (formatStr.startsWith('j ')) {
				return formatDateTimeHumanReadable(dateObj)
			}

			return dateObj.toISOString()
		},
		minDate: new Date(new Date().setHours(0)),
		defaultHour: 21,
	})
	$effect(() => {
		if (browser) {
			const end = flatpickr('#datepicker-end', { ...options, defaultDate: $form.endDate })
			const start = flatpickr('#datepicker', {
				...options,
				defaultDate: $form.date,
				onChange: (selectedDate, dateStr, instance) => {
					const nd = new Date(selectedDate[0])

					$form.date = nd

					const toSet = new Date(nd.setHours(nd.getHours() + 4))
					// @ts-expect-error debiele typings lmao
					end.setDate(toSet)
					// @ts-expect-error debiele typings lmao
					$form.endDate = toSet.toISOString()
				},
			})
		}
	})
</script>

{#snippet errorSnippet(msg: keyof typeof $form)}
	{@const err = page.form?.form?.errors?.[msg]}
	{#if err}
		<div class="error">
			<Callout type="caution">
				{err}
			</Callout>
		</div>
	{/if}
{/snippet}

{#if data.edit}
	<Title title={`Activiteit ${$form.name} bewerken`} underTitle="" />
{:else}
	<Title title="Nieuwe activiteit aanmaken" underTitle="Maak een nieuwe activiteit aan" />
{/if}

{#if import.meta.env.DEV}
	<div class="debug">
		<!-- <SuperDebug data={form} /> -->
	</div>
{/if}

{#if $message}
	<Callout type="caution">
		{$message}
	</Callout>
{/if}

<dialog class="location-dialog" open={dialog}>
	<h1>Nieuwe locatie aanmaken</h1>
	<form id="locationForm" {...saveLocation}>
		<!-- check andere locaties en geef suggestie voor bestaande locaties -->
		{#if locationSearch.length > 0}
			<div class="location-suggestion">
				Bedoelde je: <button onclick={selectSuggestedLocation} class="btn-a">{locationSearch[0].name}</button>
			</div>
		{/if}

		{#if saveLocation.fields.allIssues()}
			<Callout type="warning">
				{#each saveLocation.fields.allIssues() as issue}
					<div>
						{issue.message}
					</div>
				{/each}
			</Callout>
		{/if}

		<label for="name">
			Naam*
			<input placeholder="Naam" {...saveLocation.fields.name.as('text')} />
		</label>

		<label for="description">
			Omschrijving*
			<input placeholder="Omschrijving" {...saveLocation.fields.description.as('text')} />
		</label>
		<label for="adress">
			Adres
			<input placeholder="Adres" {...saveLocation.fields.adress.as('text')} />
		</label>
		<label for="postalCode">
			Postcode
			<input placeholder="Postcode" {...saveLocation.fields.postalCode.as('text')} />
		</label>
		<label for="city">
			Plaats
			<input placeholder="Plaats" {...saveLocation.fields.city.as('text')} />
		</label>
		<label for="country">
			Land
			<input placeholder="Land" {...saveLocation.fields.country.as('text')} />
		</label>

		<button class="btn-secondary" type="submit"> Opslaan </button>
	</form>
</dialog>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="wrapper" onclick={() => closeDialog()} data-sveltekit-reload>
	<form method="POST" use:enhance class="activity-form" enctype="multipart/form-data">
		<div class="step">
			<div class="number"><div>1</div></div>
			<div class="title">Activiteit details</div>
			<div class="filler"></div>

			{@render errorSnippet('name')}
			<label for="name">
				Naam
				<input name="name" type="text" placeholder="Naam" bind:value={$form.name} {...$constraints.name} />
			</label>
			{#if nameMarkdown}
				<div class="md">
					<Markdown text={nameMarkdown} class="" />
				</div>
			{/if}

			{@render errorSnippet('description')}
			<label for="description">
				Beschrijving
				<textarea name="description" placeholder="Beschrijving" bind:value={$form.description} {...$constraints.description}></textarea>
			</label>

			{#if descriptionMarkdown}
				<div class="md">
					<Markdown text={descriptionMarkdown} class="" />
				</div>
			{/if}

			{@render errorSnippet('date')}
			<label for="date">
				Begintijd
				<input id="datepicker" name="date" placeholder="Begintijd" bind:value={$form.date} />
			</label>
			{@render errorSnippet('endDate')}
			<label for="end-date">
				Eindtijd (optioneel)
				<input id="datepicker-end" name="endDate" placeholder="Eindtijd" bind:value={$form.endDate} />
			</label>
		</div>

		<div class="step">
			<div class="number">2</div>
			<div class="title">Extra informatie</div>
			<div class="filler"></div>
			{@render errorSnippet('location')}
			<label for="location">
				Locatie
				<select name="location" bind:value={$form.location}>
					<option value={3}>Selecteer een locatie</option>
					<option value={-1}>Nieuwe locatie aanmaken</option>
					<option value={3}>Nog niet bepaald</option>
					{#each data.locations as l}
						<option value={l.id}>{l.name}</option>
					{/each}
				</select>
			</label>

			{@render errorSnippet('committee')}
			<label for="committee">
				Georganiseerd door
				<select name="committee" bind:value={$form.committee}>
					{#each data.committees as c}
						<option value={c.id}>{c.name}</option>
					{/each}
				</select>
			</label>

			{#if !data.feut}
				{@render errorSnippet('membersOnly')}
				<label for="membersOnly">
					<input type="checkbox" id="membersOnly" name="membersOnly" checked={$form.membersOnly} />
					Toon deze activiteit alleen aan leden
				</label>
			{/if}
		</div>

		<div class="step">
			<div class="number">3</div>
			<div class="title">Afbeelding</div>
			<div class="filler"></div>
			<label for="image">
				{@render errorSnippet('image')}
				<!-- <input type="file" id="image" name="image" accept="image/*" oninput={e => ($form.image = e.currentTarget.files?.item(0) as File)} /> -->
				<input
					type="file"
					id="image"
					name="image"
					accept="image/png,image/jpeg,image/gif,image/webp,image/heic,image/avif"
					bind:files={$image} />

				{#if $form.image}
					<img src={URL.createObjectURL($form.image)} alt="preview" />
				{/if}
			</label>
		</div>

		<div class="step">
			<div class="number">4</div>
			<div class="title">Opslaan</div>
			<div class="filler"></div>

			{@render errorSnippet('noNotification')}
			<label for="noNotification">
				<input type="checkbox" name="noNotification" id="noNotification" checked={$form.noNotification} />
				Stuur geen notificatie via discord/e-mail
			</label>
			{#if data.edit}
				{@render errorSnippet('resetAttending')}
				<label for="resetAttending">
					<input type="checkbox" name="resetAttending" id="resetAttending" checked={$form.resetAttending} />
					Reset aanwezigheid status voor iedereen
				</label>
			{/if}

			{#if $delayed}
				<div class="submit"><button disabled>Activiteit wordt opgeslagen...</button></div>
			{:else}
				<div class="submit"><button> Activiteit aanmaken </button></div>
			{/if}
		</div>
	</form>
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.activity-form {
		width: 40%;

		@media (max-width: 600px) {
			width: 90%;
		}

		label {
			display: grid;
			padding-left: 1rem;
		}

		label:has(> input[type='checkbox']) {
			display: inline-block;
			padding-right: 0.5rem;
			white-space: nowrap;

			input {
				vertical-align: -2px;
			}

			span,
			input {
				vertical-align: middle;
			}
		}

		label[for='image'] {
			img {
				max-width: 100%;
			}
		}

		.submit {
			display: flex;
			justify-content: center;
		}
	}

	.error {
		margin-left: 1rem;
	}

	.step {
		position: relative;

		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		padding-bottom: 1rem;

		border-left: 1px solid var(--color-hr);

		.number {
			position: absolute;
			left: -1rem;
			display: flex;
			justify-content: center;
			align-items: center;
			line-height: 1rem;

			text-align: center;

			background-color: var(--color-hr);
			color: #0f0f0f;
			border-radius: 50px;
			width: 2rem;
			height: 2rem;
		}

		.title {
			position: absolute;
			font-size: 1.5rem;
			left: 1.5rem;
		}

		.filler {
			height: 2rem;
		}
	}

	.md {
		margin-left: 1rem;
		max-width: 100%;
	}

	.photo-selector-dialog {
		z-index: 1000;
	}

	.location-dialog {
		z-index: 1000;

		form {
			display: flex;
			flex-direction: column;
			gap: 0.1rem;

			label {
				display: grid;
			}

			button[type='submit'] {
				margin-top: 1rem;
			}
		}

		.location-suggestion {
			button {
				color: white;
				text-decoration: underline;
			}
		}
	}
</style>
