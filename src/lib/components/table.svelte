<script lang="ts">
	import Edit from '~icons/tabler/edit'
	import Delete from '~icons/tabler/circle-x'
	import Add from '~icons/tabler/plus'
	import Revert from '~icons/tabler/arrow-back-up'

	type Action = {
		type: 'edit' | 'delete' | 'add' | 'revert'
		action: (id: string) => void
		title?: string
	}

	// Eerste element in row is de id
	export let rows: string[][] = []
	export let columns: string[] = []
	export let actions: Action[] = []
	export let tableId = 'custom-table'
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
				{#each row.splice(1) as cell}
					<td>{cell}</td>
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
	.actions {
		button {
			margin: 0 0.25rem;
			padding-top: 0.25rem;
		}
	}
</style>
