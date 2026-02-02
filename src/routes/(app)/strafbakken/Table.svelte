<script lang="ts">
	import Plus from '~icons/tabler/plus'
	import Minus from '~icons/tabler/minus'
	import Modal from './Modal.svelte'
	import { openModal } from 'svelte-modals'
	import type { sbUser } from './types'

	export let data: sbUser[]
	export let longestName: string | null

	const trekBak = (id: number, index: number) => {
		changeCount(index, -1)
		fetch('/strafbakken', {
			method: 'DELETE',
			body: JSON.stringify({
				user: id,
			}),
		}).catch(() => {
			changeCount(index, 1)
		})
	}

	const changeCount = (index: number, n: number) => {
		data[index]._count.StrafbakReceived += n
	}
</script>

<table class="not-full-width">
	<thead>
		<th>Naam</th>
		<th>Bakken</th>
		<th>Acties</th>
	</thead>
	<tbody>
		{#each data as user, i}
			<row class="row">
				<a href={`/strafbakken/${user.firstName.toLowerCase()}`} class="cell">
					{user.nickname || user.firstName}
				</a>
				<a href={`/strafbakken/${user.firstName.toLowerCase()}`} class="cell">
					<p>{user._count.StrafbakReceived}</p>
				</a>
				<div class="actions cell">
					<button
						class="btn-a"
						on:click={() =>
							openModal(Modal, {
								username: user.nickname || user.firstName,
								uid: user.id,
								changeCount,
								index: i,
							})}>
						<i><Plus /></i>
					</button>
					<button class="btn-a" on:click={user._count.StrafbakReceived ? () => trekBak(user.id, i) : null}>
						<i class={user._count.StrafbakReceived ? '' : 'none'}><Minus /></i>
					</button>
				</div>
			</row>
		{/each}
		<!-- Add an invisible row with the longest name to make sure the 2 tables have the same width (kinda) -->
		{#if longestName !== null}
			<row id="invisible">
				<p class="cell">{longestName}</p>
				<div class="cell"></div>
				<div class="cell"></div>
			</row>
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

	i:hover {
		filter: invert(35%);
	}

	tbody {
		display: grid;
		grid-template-columns: 1fr;

		row {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			transition: all 0.4s ease;

			&:nth-child(odd) {
				background-color: var(--color-primary);
				color: white;
				a,
				i {
					color: white;
				}
			}

			&:has(.cell:not(.actions):hover) {
				background-color: var(--color-primary);
				color: white;
				text-decoration: underline;
			}

			.cell {
				padding: $cell-padding;
				word-wrap: break-word;
				position: relative;

				p {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
				}
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

		.actions {
			display: flex;
			align-items: center;
			gap: $cell-padding;
		}
	}
</style>
