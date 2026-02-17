<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import LedgersTable from '../LedgersTable.svelte'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Title title="Inactieve grootboekrekeningen" />
<LedgersTable ledgers={data.ledgers} showAdd={false} />
<br />
<a href="/ongeveer/ledger">Actieve grootboekrekeningen</a>
