<script lang="ts">
	import Edit from '~icons/tabler/edit'
	import Delete from '~icons/tabler/circle-x'
	import Add from '~icons/tabler/plus'
	import Revert from '~icons/tabler/arrow-back-up'
	import Eye from '~icons/tabler/eye'
	import Link from '~icons/tabler/link'

	type Action = {
		type: 'edit' | 'delete' | 'add' | 'revert' | 'view' | 'link'
		action: (id: string) => void
		title?: string
	}

	// Eerste element in row is de id
	export let rows: string[][] = []
	export let columns: string[] = []
	export let actions: Action[] = []
	export let tableId = 'custom-table'
	export let markdownIdx = -1
</script>

<table id={tableId} class={$$props.class}>
	<thead>
		<tr>
			{#each columns as column}
				<th>{column}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each rows as row}
			<tr id={row[0]}>
				{#each row.splice(1) as cell, idx}
					{#if markdownIdx === idx}
						<td>{@html cell}</td>
					{:else}
						<td>{cell}</td>
					{/if}
				{/each}
				{#if actions && actions.length > 0}
					<td class="actions">
						{#each actions as action}
							<button class="btn-a" on:click={() => action.action(row[0])}>
								{#if action.type === 'edit'}
									<div title={action.title ?? 'Bewerken'}>
										<Edit />
									</div>
								{:else if action.type === 'delete'}
									<div title={action.title ?? 'Verwijder'}>
										<Delete />
									</div>
								{:else if action.type === 'add'}
									<div title={action.title ?? 'Toevoegen'}>
										<Add />
									</div>
								{:else if action.type === 'view'}
									<div title={action.title ?? 'Bekijken'}>
										<Eye />
									</div>
								{:else if action.type === 'link'}
									<div title={action.title ?? 'Koppelen'}>
										<Link />
									</div>
								{:else if action.type === 'revert'}
									<div title={action.title ?? 'Terugdraaien'}>
										<Revert />
									</div>
								{/if}
							</button>
						{/each}
					</td>
				{/if}
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	table {
		font-weight: 400;
	}

	.actions {
		button {
			margin: 0 0.25rem;
			padding-top: 0.25rem;
		}
	}
</style>
