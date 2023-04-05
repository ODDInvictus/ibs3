<script lang="ts">
	import { page } from '$app/stores'
	import { enhance, applyAction } from '$app/forms'
	import StyledButton from '$lib/components/StyledButton.svelte'

	let error = ''

	function formatDate(dateString: string) {
		const date = new Date(dateString)

		const hour = ('0' + date.getHours()).slice(-2)
		const minute = ('0' + date.getMinutes()).slice(-2)

		return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hour}:${minute}`
	}
</script>

<div>
	<h1>Maluspunten</h1>

	<hr />

	<div id="form-container">
		<form
			method="POST"
			use:enhance={(event) => {
				return async ({ result, update }) => {
					console.log(result);
					if (result.type === 'failure') {
						error = result.data.message;
					} else {
						error = '';
						console.log(result);
						update();
					}
				};
			}}
		>
			<div>
				<label for="receiverId">Welke feut</label>
				<select name="receiverId">
					{#each $page.data.feuten as user}
						<option value={user.id}>{user.firstName}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="reason">Waarom</label>
				<input type="text" name="reason" placeholder="Waarom is het leven??" />
			</div>

			<div>
				<label for="amount">Hoeveel maluspunten</label>
				<input type="number" name="amount" placeholder="Hoeveel" />
			</div>

			<div>
				<label for="giverId">Gegeven door</label>
				<select name="giverId">
					{#each $page.data.members as user}
						<option value={user.id}>{user.firstName}</option>
					{/each}
				</select>
			</div>

			<div>
				<StyledButton type="submit">Toevoegen</StyledButton>
			</div>

			<div>
				{error}
			</div>
		</form>
	</div>

	<hr />

	<div id="table-container">
		<table>
			<thead>
				<tr>
					<th>ID</th>
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
						<td>{punt.id}</td>
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
	h1 {
		text-align: center;
		font-weight: 600;
		font-size: larger;
	}

	hr {
		margin: 1rem 0;
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

	table {
		width: 100%;
	}

	td,
	th {
		padding: 0.5rem;
		text-align: left;
	}
</style>
