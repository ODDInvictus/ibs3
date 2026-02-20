<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import LedgersTable from './LedgersTable.svelte'

	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Title title="Grootboekrekening" />
<LedgersTable ledgers={data.ledgers} />
<br />
<a href="/ongeveer/ledger/inactive">Inactieve grootboekrekeningen</a>
