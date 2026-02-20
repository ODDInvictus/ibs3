<script lang="ts">
	import Table from '$lib/components/table.svelte'
	import Title from '$lib/components/title.svelte'
	import { formatDateTimeHumanReadable } from '$lib/dateUtils'
	import { markdown } from '$lib/utils'
	import type { PageData } from './$types'

	const { data }: { data: PageData } = $props()
</script>

<Title title="Citaten" />

<Table
	markdownIdx={0}
	class="striped citaten"
	tableId="citaten"
	columns={['Citaat', 'Geciteerd door', 'Datum']}
	rows={data.quotes.map(q => [
		'' + q.id,
		markdown(q.text)!,
		q.quoter ? q.quoter.firstName : q.msg?.sender!,
		formatDateTimeHumanReadable(q.createdAt),
	])} />
