<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { markdown } from '$lib/utils';
	import type { sbUserPageData } from '../types';

	export let data: sbUserPageData;

	const formatName = (names: { nickname: string | null; firstName: string }) => {
		let unformattedName = names.nickname || names.firstName;
		return unformattedName[0].toUpperCase() + unformattedName.slice(1).toLowerCase();
	};

	$: name = formatName({
		nickname: data.strafbakken.nickname,
		firstName: data.strafbakken.firstName
	});
</script>

<main>
	<Title
		title="{name} zijn {data.strafbakken.StrafbakReceived.length} strafbakken"
		shortTitle="{name} :: Strafbakken"
	/>
	<table-container>
		<table>
			<thead>
				<th>Gever</th>
				<th>Reden</th>
				<!-- <th>Locatie</th> -->
				<th>Datum</th>
				<th>Tijd</th>
			</thead>
			<tbody>
				{#each data.strafbakken.StrafbakReceived as strafbak}
					<tr>
						<td>
							{#if strafbak.giver}
								<a href={`/strafbakken/${strafbak.giver.firstName}`}>
									{formatName(strafbak.giver)}
								</a>
							{:else}
								IBS
							{/if}
						</td>
						<td>{@html markdown(strafbak.reason) ?? 'Geen reden gegeven'}</td>
						<!-- <td>{strafbak.location ?? 'Onbekend'}</td> -->
						<td>{strafbak.dateCreated.toLocaleDateString()}</td>
						<td>{strafbak.dateCreated.toLocaleTimeString().slice(0, -3)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</table-container>
</main>

<style lang="scss">
	$tr-padding: 0.75rem;

	table-container {
		display: grid;
		place-items: center;

		thead {
			display: grid;
			grid-template-columns: 1fr 2fr 1fr 1fr;
			place-items: center;

			th {
				text-align: center;
				width: fit-content;
			}
		}

		tbody {
			tr {
				display: grid;
				grid-template-columns: 1fr 2fr 1fr 1fr;
				color: var(--primary-color);
				
				td {
					border: none;
				}

				a {
					color: var(--primary-color);
				}

				&:nth-child(odd) {
					background-color: var(--primary-color);
					color: white;
					
					a {
						color: white;
					}
				}
			}
		}
	}

	:root.dark tr:nth-child(even) {
		td, a {
			color: white;
		}
	}
</style>
