<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageProps } from './$types'

	let { data }: PageProps = $props()
</script>

<Title title={`Agenda-item: ${data.event.title}`} />

<main class="event-details">
	<table>
		<tbody>
			<tr>
				<th scope="row">Titel</th>
				<td>{data.event.title}</td>
			</tr>
			<tr>
				<th scope="row">Beschrijving</th>
				<td>{data.event.description || 'Geen beschrijving'}</td>
			</tr>
			<tr>
				<th scope="row">Locatie</th>
				<td>{data.event.location || 'Niet opgegeven'}</td>
			</tr>
			<tr>
				<th scope="row">Begint</th>
				<td>{new Date(data.event.startTime).toLocaleString('nl-NL')}</td>
			</tr>
			<tr>
				<th scope="row">Eindigt</th>
				<td>{new Date(data.event.endTime).toLocaleString('nl-NL')}</td>
			</tr>
			<tr>
				<th scope="row">Deelnemers</th>
				<td>
					{#if data.event.calendarEventUsers.length > 0}
						<ul>
							{#each data.event.calendarEventUsers as { user } (user.id)}
								<li>{user.nickname || `${user.firstName} ${user.lastName}`}</li>
							{/each}
						</ul>
					{:else}
						Geen deelnemers
					{/if}
				</td>
			</tr>
		</tbody>
	</table>

	<a href="/kalender">Terug naar kalender</a>
</main>

<style>
	.event-details {
		width: min(100% - 2rem, 48rem);
		margin: 1.5rem auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1rem;
	}

	th,
	td {
		padding: 0.75rem;
		border-bottom: 1px solid var(--border-color, #bbb);
		text-align: left;
		vertical-align: top;
	}

	th {
		width: 9rem;
	}

	ul {
		margin: 0;
		padding-left: 1.25rem;
	}

	@media (max-width: 36rem) {
		th,
		td {
			padding: 0.6rem 0.35rem;
		}

		th {
			width: 6rem;
		}
	}
</style>
