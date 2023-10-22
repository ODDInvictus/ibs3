<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import LedgersTable from './LedgersTable.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Title title="Ledgers" />
<LedgersTable ledgers={data.ledgers} />
<br />
<a href="/ongeveer/ledger/inactive">Inactieve grootboekrekeningen</a>
