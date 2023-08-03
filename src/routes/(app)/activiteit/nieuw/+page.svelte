<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { ActionData } from './$types';
	import InfoCircle from '~icons/tabler/info-circle';
	import { markdown } from '$lib/utils';
	import Markdown from '$lib/components/Markdown.svelte';
	import Title from '$lib/components/title.svelte';
	import InputFile from '$lib/components/input-file.svelte';

	const activity = $page.data.activity;
	const activityTime = $page.data.times;

	function setEndDate() {
		const startDate = document.getElementById('startDate') as HTMLInputElement;
		const endDate = document.getElementById('endDate') as HTMLInputElement;

		if (!endDate.value || endDate.value < startDate.value) endDate.value = startDate.value;
	}

	function handleErrors() {
		if (form?.errors) {
			for (const error of form.errors) {
				const element = document.getElementById('' + error.field) as HTMLInputElement;
				element.classList.add('activity-create-error');
			}

			// Scroll to top
			window.scrollTo(0, 0);
		}
	}

	export let form: ActionData;

	let name = activity?.name || '';
	$: nameMarkdown = markdown(name);

	let description = activity?.description || '';
	$: descriptionMarkdown = markdown(description);
</script>

<Title title="Nieuwe activiteit aanmaken" shortTitle="Nieuwe Activiteit" />

{#if form?.error}
	<ul class="errors">
		{#if form?.message}
			<li>
				<div>
					<InfoCircle />
				</div>
				<span>{form?.message}</span>
			</li>
		{:else if form?.errors}
			{#each form?.errors as error}
				<li>
					<div>
						<InfoCircle />
					</div>
					<span>{error.message}</span>
				</li>
			{/each}
		{/if}
	</ul>
{/if}

<form
	method="POST"
	enctype="multipart/form-data"
	use:enhance={({ data }) => {
		return async ({ result }) => {
			await applyAction(result);
			handleErrors();
		};
	}}
>
	<label for="name">Naam <span>(markdown)</span></label>
	<div class="md-input">
		<input type="text" name="name" id="name" bind:value={name} />
		{#if nameMarkdown && name !== nameMarkdown}
			<Markdown class="md" text={nameMarkdown} />
		{/if}
	</div>

	<label for="description">Beschrijving <span>(markdown)</span></label>
	<div class="md-input">
		<textarea name="description" id="description" bind:value={description} />
		{#if descriptionMarkdown && description !== descriptionMarkdown.replaceAll('<br />', '')}
			<Markdown class="md" text={descriptionMarkdown} />
		{/if}
	</div>

	<label for="startDate">Begin datum</label>
	<input
		type="date"
		name="startDate"
		id="startDate"
		on:change={setEndDate}
		value={activityTime?.startDate ?? ''}
	/>

	<label for="startTime">Begin tijd</label>
	<input type="time" name="startTime" id="startTime" value={activityTime?.startTime ?? ''} />

	<label for="endDate">Eind datum</label>
	<input type="date" name="endDate" id="endDate" value={activityTime?.endDate ?? ''} />

	<label for="endTime">Eind tijd</label>
	<input type="time" name="endTime" id="endTime" value={activityTime?.endTime ?? ''} />

	<label for="location">Locatie <span>(optioneel)</span></label>
	<select name="location" id="location" value={activity?.location?.id ?? 0}>
		<option value={0}>Nog niet bekend</option>
		{#each $page.data.locations as location}
			<option value={location.id}>{location.name}</option>
		{/each}
	</select>

	<label for="organisedBy">Georganiseerd door</label>
	<select name="organisedBy" id="organisedBy" value={activity?.organisedBy?.id ?? 0}>
		<option value={0}>Selecteer een commissie!</option>
		{#each $page.data.committees as committee}
			<option value={committee.id}>{committee.name}</option>
		{/each}
	</select>

	<label for="url">Website voor meer informatie <span>(optioneel)</span></label>
	<input type="url" name="url" id="url" placeholder="URL" value={activity?.url ?? ''} />

	<label for="image">Afbeelding <span>(optioneel)</span></label>
	<div class="file-input">
		<InputFile name="image" id="image" class="file" />
	</div>

	<label for="membersOnly">Alleen voor leden</label>
	<input
		type="checkbox"
		name="membersOnly"
		id="membersOnly"
		value={activity?.membersOnly ?? false}
	/>

	<button type="submit">Opslaan</button>
</form>

<style lang="scss">
	:global(.activity-create-error, .activity-create-error:active, .activity-create-error:focus) {
		border: 1px solid red !important;
	}

	.errors {
		color: black;

		li {
			border: 1px solid rgb(239 68 68);
			background-color: rgb(254 226 226);
			border-radius: 10px;
			margin-bottom: 0.5rem;

			display: grid;
			grid-template-columns: 1.4em 1fr;

			div {
				display: flex;
				flex-direction: column;
				justify-content: center;
				margin-left: 0.2em;
			}

			span {
				margin-left: 0.5em;
				margin-top: 0.2em;
				margin-bottom: 0.2em;
			}
		}
	}

	$margin: 1rem;

	form {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: 150px 1fr;
		gap: $margin;

		.md-input {
			display: flex;
			flex-direction: column;

			:global(.md) {
				margin-top: $margin;
			}
		}

		label {
			font-weight: 600;
			padding-top: 0.4rem;
		}

		label + input,
		label + select {
			padding-bottom: 1rem;
		}

		label > span {
			font-weight: 400;
			font-size: 0.8rem;
			color: #666;
		}

		button {
			margin-bottom: 1rem;
		}

		@media screen and (max-width: 600px) {
			grid-template-columns: 1fr;

			label + input,
			label + select {
				margin-bottom: 0;
			}
		}

		.file-input :global(.file) {
			width: 80%;
		}

		textarea {
			box-sizing: border-box;

			padding: 0.5rem;
			border: 1px solid #ccc;
			border-radius: 5px;
			outline: none;
		}
	}
</style>
