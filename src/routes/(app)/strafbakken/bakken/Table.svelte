<script lang="ts">
	import type { bakkenUser } from '../types'

	export let data: bakkenUser[]
	export let longestName: string | null

	const formatName = (names: { nickname: string | null; firstName: string }) => {
		let unformattedName = names.nickname || names.firstName
		return unformattedName[0].toUpperCase() + unformattedName.slice(1).toLowerCase()
	}
</script>

<table class="not-full-width">
	<thead>
		<tr>
			<th>Naam</th>
			<th>Bakken</th>
		</tr>
	</thead>
	<tbody>
		{#each data as user}
			<tr>
				<td>{formatName(user)}</td>
				<td>{user.count}</td>
			</tr>
		{/each}
		<!-- Add an invisible row with the longest name to make sure the 2 tables have the same width (kinda) -->
		{#if longestName !== null}
			<tr id="invisible">
				<td class="cell">{longestName}</td>
				<td class="cell"></td>
			</tr>
		{/if}
	</tbody>
</table>

<style lang="scss">
	$cell-padding: 0.75rem;

	thead {
		display: flex;
		justify-content: space-around;

		th {
			padding: $cell-padding;
			text-align: left;
		}
	}

	tbody {
		display: grid;
		grid-template-columns: 1fr;

		tr {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			transition: all 0.4s ease;

			&:nth-child(odd) {
				background-color: var(--color-table-highlight);
				color: var(--color-text-light);
			}

			&:has(.cell:not(.actions):hover) {
				background-color: var(--color-primary);
				color: white;
				text-decoration: underline;
			}

			td {
				padding: $cell-padding;
				word-wrap: break-word;
				position: relative;
				border: none;
			}

			&#invisible {
				opacity: 0;
				cursor: default;
				height: 0px;

				.cell {
					padding: 0 $cell-padding;
					word-wrap: normal;
					text-overflow: clip;
					line-height: 0%;
				}
			}
		}
	}
</style>
