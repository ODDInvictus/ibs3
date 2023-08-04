<script lang="ts">
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';

	function formatDate(dateString: string) {
		const date = new Date(dateString);

		const hour = ('0' + date.getHours()).slice(-2);
		const minute = ('0' + date.getMinutes()).slice(-2);

		return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hour}:${minute}`;
	}
</script>

<div>
	<Title
		title="Maluspunten"
		underTitle="Op deze pagina kan je zien wat de feuten allemaal hebben uitgespookt"
	/>

	<div class="center m-4">
		<a href="/maluspunten/uitdelen">
			<button class="btn-a">Maluspunt uitdelen</button>
		</a>
	</div>

	<div id="table-container">
		<table class="striped">
			<thead>
				<tr>
					<th>Wie</th>
					<th>Waarom</th>
					<th>Hoeveel</th>
					<th>Door</th>
					<th>Datum</th>
				</tr>
			</thead>
			<tbody>
				{#each $page.data.maluspunten as punt, idx}
					<tr>
						<td>{punt.receiver.firstName}</td>
						<td>{punt.reason}</td>
						<td>{punt.amount}</td>
						<td>{punt.giver.nickname ?? punt.giver.firstName}</td>
						<td>{formatDate(punt.dateCreated)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	hr {
		margin: var(--hr-margin);
	}

	form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		grid-gap: 1rem;
	}

	label {
		font-weight: 600;
	}

	input,
	select {
		margin-top: 0.2rem;
		width: 100%;
		border-radius: 5px;
		border: 1px solid var(--border-color);
	}

	input:focus,
	select:focus {
		outline: none;
		border: 1px solid var(--black-color);
	}

	#table-container {
		overflow-y: auto;
	}
</style>
