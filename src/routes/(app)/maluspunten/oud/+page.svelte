<script lang="ts">
	import Table from '$lib/components/table.svelte'
	import Title from '$lib/components/title.svelte'
	import { formatDateTimeHumanReadable } from '$lib/dateUtils'
	import type { PageProps } from './$types'

	let { data }: PageProps = $props()
</script>

<Title title="Alle maluspunten" underTitle="Zijn ze nog steeds zulke grote feuten?" />

<Table
	class="striped"
	columns={['Wie', 'Waarom', 'Hoeveel', 'Door', 'Datum']}
	rows={data.maluspunten.map(mp => [
		mp.id,
		mp.receiver.firstName,
		mp.reason,
		mp.amount,
		mp.giver.firstName,
		formatDateTimeHumanReadable(mp.dateCreated),
	])}
	tableId="maluspunten-oud" />
