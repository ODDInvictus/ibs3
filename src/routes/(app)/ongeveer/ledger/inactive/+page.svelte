<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import LedgersTable from '../LedgersTable.svelte';

	export let data: PageData;
</script>

<Title title="Inactieve grootboekrekeningen" />
<LedgersTable ledgers={data.ledgers} showAdd={false} />
<br />
<a href="/ongeveer/ledger">Actieve grootboekrekeningen</a>
