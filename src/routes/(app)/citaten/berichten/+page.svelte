<script lang="ts">
	import Table from '$lib/components/table.svelte'
	import Title from '$lib/components/title.svelte'
	import { formatDateTimeHumanReadable } from '$lib/dateUtils'
	import { promptSelect } from '$lib/promptSelect'
	import type { PageData } from './$types'
	import { linkDiscordUser } from './link.remote'

	const { data }: { data: PageData } = $props()

	function findUser(sender: string): string {
		const u = data.users.find(u => sender === u.discordUsername)

		return u ? u.firstName : 'Niet bekend bij IBS'
	}

	function link(msgID: string) {
		const msg = data.msgs.find(m => m.id === msgID)

		if (!msg) return

		promptSelect({
			title: `Wie is ${msg.sender}`,
			message: `Selecteer een gebruiker`,
			options: data.users.map(u => ({ key: u.firstName, value: u.ldapId })),
			cb: async (selection: string) => {
				linkDiscordUser({ ldapId: selection, discordUsername: msg?.sender }).then(() => location.reload())
			},
		})
	}
</script>

<Title
	title="Discord berichten"
	underTitle="Deze berichten zijn allemaal in #citaten gestuurd, sommige hiervan zijn gekoppeld aan een citaat" />

<Table
	class="striped"
	tableId="messages-table"
	columns={['Tekst', 'Discord', 'Persoon', 'Gestuurd op', 'Gekoppeld', 'Acties']}
	rows={data.msgs.map(msg => [
		msg.id,
		msg.text,
		msg.sender,
		findUser(msg.sender),
		formatDateTimeHumanReadable(msg.createdAt),
		msg.quotes.length > 0 ? '✅' : '❌',
	])}
	actions={[{ type: 'link', action: id => link(id), title: 'Link gebruiker' }]} />
