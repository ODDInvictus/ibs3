<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Title title="Access tokens" underTitle="Overzicht van alle tokens in de database" />

<table class="striped">
	<thead>
		<tr>
			<th>Gebruiker</th>
			<th>Token naam</th>
			<th>Type</th>
			<th>Laatst gebruikt</th>
		</tr>
	</thead>
	<tbody>
		{#each data.tokens as token}
			<tr>
				<td>{token.user.ldapId}</td>
				<td>{token.name}</td>
				<td>{token.type}</td>
				<td>{token.lastUsed.toLocaleString('nl')}</td>
			</tr>
		{/each}
	</tbody>
</table>
