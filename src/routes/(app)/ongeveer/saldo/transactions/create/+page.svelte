<script lang="ts">
	import type { PageData, ActionData } from './$types'

	export let data: PageData
	export let form: ActionData
</script>

<div id="root">
	<div id="title">
		<h1>Maak een nieuwe transactie</h1>
		<p>Doe dit alleen als je weet wat je doet!</p>
		<hr />
	</div>

	{#if form?.success}
		Gelukt!
	{:else}
		{form?.message ?? ''}
	{/if}
	{#if form?.error}
		{#if form.error.giver?._errors}
			<p>Van: {form.error.giver?._errors}</p>
		{/if}
		{#if form.error.receiver?._errors}
			<p>Naar: {form.error.receiver?._errors}</p>
		{/if}
		{#if form.error.description?._errors}
			<p>Beschrijving: {form.error.description?._errors}</p>
		{/if}
		{#if form.error.amount?._errors}
			<p>Bedrag: {form.error.amount?._errors}</p>
		{/if}
	{/if}

	<form method="POST">
		<label for="giver">Van</label>
		<select name="giver" data-testid="giver-input">
			<option value={0}>Kies een persoon</option>
			{#each Object.entries(data.financialPeople) as [key, arr]}
				<optgroup label={key}>
					{#each arr as person}
						<option value={person.id}>{person.name}</option>
					{/each}
				</optgroup>{/each}
		</select>

		<label for="receiver">Naar</label>
		<select name="receiver" data-testid="receiver-input">
			<option value={0}>Kies een persoon</option>
			{#each Object.entries(data.financialPeople) as [key, arr]}
				<optgroup label={key}>
					{#each arr as person}
						<option value={person.id}>{person.name}</option>
					{/each}
				</optgroup>{/each}
		</select>

		<label for="description">Beschrijving</label>
		<input type="text" name="description" data-testid="description-input" />

		<label for="amount">Bedrag</label>
		<span class="input-euro">
			<input type="number" class="euro" min="0.00" step=".01" name="amount" id="amount" data-testid="amount-input" />
		</span>

		<div class="button">
			<button type="submit" data-testid="submit-btn">Verstuur</button>
			<a href="/ongeveer/saldo">Terug</a>
		</div>
	</form>
</div>

<style lang="scss">
	#title {
		h1,
		p {
			text-align: center;
			padding-bottom: 0.5rem;
		}

		p {
			font-weight: 700;
		}
	}

	form {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: 100px 1fr;
		gap: 1rem;

		@media (max-width: 600px) {
			grid-template-columns: 1fr;
			gap: 0.25rem;

			input[type='file'] {
				margin-bottom: 1rem;
			}
		}

		label {
			font-weight: 600;
			padding-top: 0.4rem;
		}

		button {
			margin-bottom: 1rem;
		}

		input:not([type='file']) {
			padding: 0.5rem;
			border: 1px solid #ccc;
			border-radius: 5px;
			outline: none;
		}

		input[type='file'] {
			outline: none;
			cursor: pointer;
		}

		input:focus:not([type='file']) {
			border: 1px solid purple;
		}

		.euro {
			padding-left: 22px !important;
		}
	}

	.input-euro {
		position: relative;
	}

	.input-euro:before {
		position: absolute;
		content: '€';
		top: 9px;
		left: 9px;
	}
</style>
