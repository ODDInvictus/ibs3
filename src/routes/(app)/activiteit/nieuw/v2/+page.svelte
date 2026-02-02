<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import Markdown from '$lib/components/Markdown.svelte'
	import type { PageData } from './$types'
	import { superForm } from 'sveltekit-superforms/client'
	import { markdown } from '$lib/utils'
	import InputFile from '$lib/components/input-file.svelte'

	export let data: PageData

	$: nameMarkdown = markdown($form.name)

	const { form, constraints, enhance } = superForm(data.form, {
		taintedMessage: 'Wil je de pagina verlaten? Veranderingen worden niet opgeslagen',
		validators: {
			// name: name => {
			// 	alert(name)
			// 	if (name.length > 0) {
			// 		nameMarkdown = markdown(name)!
			// 	}
			// 	return name
			// },
		},
	})
</script>

<Title title="Nieuwe activiteit aanmaken" underTitle="Maak een nieuwe activiteit aan" />

<div class="wrapper">
	<form method="POST" use:enhance>
		<div class="step">
			<div class="number"><div>1</div></div>
			<div class="title">Activiteit details</div>
			<div class="filler"></div>

			<label for="name">
				Naam
				<input name="name" type="text" placeholder="Naam" bind:value={$form.name} {...$constraints.name} />
			</label>
			<!-- TODO: Markdown dialog -->
			{#if nameMarkdown}
				<Markdown text={nameMarkdown} class="md" />
			{/if}

			<label for="description">
				Beschrijving
				<textarea name="description" placeholder="Beschrijving" bind:value={$form.description} {...$constraints.description} />
			</label>

			<label for="date"> Datum </label>
		</div>

		<div class="step">
			<div class="number">2</div>
			<div class="title">Extra informatie</div>
			<div class="filler"></div>
			<label for="description">
				Beschrijving
				<textarea name="description" placeholder="Beschrijving" bind:value={$form.description} {...$constraints.description} />
			</label>

			<label for="description">
				Beschrijving
				<textarea name="description" placeholder="Beschrijving" bind:value={$form.description} {...$constraints.description} />
			</label>
		</div>

		<div class="step">
			<div class="number">3</div>
			<div class="title">Afbeelding</div>
			<div class="filler"></div>
			<InputFile />
			of
			<button>Selecteer een foto van ibs</button>
			<!-- Of selecteer 1 uit de foto module (dialoog) -->
		</div>

		<div class="step">
			<div class="number">4</div>
			<div class="title">Opslaan</div>
			<div class="filler"></div>

			<label for="no-notification">
				<input type="checkbox" name="no-notification" checked={$form.noNotification} />
				Stuur geen notificatie via discord/e-mail
			</label>
			<label for="reset-attending">
				<input type="checkbox" name="reset-attending" checked={$form.noNotification} />
				Reset aanwezigheid status voor iedereen
			</label>
			%sveltekit.version%

			<button> Activiteit aanmaken </button>
		</div>
	</form>
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;

		min-width: 75vw;
	}

	.step {
		position: relative;

		display: flex;
		flex-direction: column;
		gap: 1rem;

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

		label {
			padding-left: 1rem;
		}
	}
</style>
