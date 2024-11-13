<script lang="ts">
	import type { Ledger } from '@prisma/client'
	import Create from './Create.svelte'
	import { openModal } from 'svelte-modals'
	import Plus from '~icons/tabler/plus'

	export let ledgers: Ledger[]
	export let showAdd = true
</script>

<table>
	<thead>
		<th>ID</th>
		<th>Naam</th>
		<th>Omschrijving</th>
	</thead>
	<tbody>
		{#each ledgers as ledger}
			<tr>
				<td><a href="/ongeveer/ledger/{ledger.id}">{ledger.id}</a></td>
				<td>{ledger.name}</td>
				<td>{ledger.description}</td>
			</tr>
		{/each}
		{#if showAdd}
			<tr>
				<td>
					<button
						class="btn-a"
						data-testid="add-ledger-btn"
						on:click={() => {
							openModal(Create)
						}}
						><Plus />
					</button>
				</td>
				<td />
				<td />
			</tr>
		{/if}
	</tbody>
</table>
