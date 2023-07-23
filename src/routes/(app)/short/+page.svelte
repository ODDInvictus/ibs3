<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<Title title="Maak een kortere link aan!" shortTitle="Link shortner" />

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<form action="short" method="POST">
	<div>
		<label for="url">Link</label>
		<input
			type="url"
			name="url"
			id="url"
			placeholder="https://www.youtube.com/watch?v=dgha9S39Y6M"
			required
		/>

		<label for="slug">Verkorting</label>
		<input type="text" name="slug" id="slug" placeholder="muziek" />
	</div>

	<p>Als je niks kiest wordt er iets gegenereerd</p>

	<button type="submit">Verkorten</button>
</form>

<style lang="scss">
	.error {
		color: red;
	}

	form {
		div {
			margin-top: 1rem;
			display: grid;
			grid-template-columns: 150px 1fr;
			gap: 1rem;

			@media screen and (max-width: 600px) {
				grid-template-columns: 1fr;

				label + input {
					margin-bottom: 0;
				}
			}
		}

		label {
			font-weight: 600;
			padding-top: 0.4rem;
		}

		button {
			margin-top: 1rem;
		}
	}
</style>
