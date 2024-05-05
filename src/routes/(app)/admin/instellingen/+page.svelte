<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { toast } from '$lib/notification'
	import type { PageData } from './$types'
	import Save from '~icons/tabler/device-floppy'

	export let data: PageData

	const save = (settingId: number) => {
		const setting = data.settings.find(s => s.id === settingId)
		if (!setting) return

		fetch(``, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id: settingId, value: setting.value }),
		})
			.then(async res => {
				if (!res.ok) throw new Error(await res.text())
				else toast({ type: 'success', message: 'Instellingen opgeslagen', title: 'Succes' })
			})
			.catch(err => toast({ type: 'danger', message: err, title: 'Oei' }))
	}
</script>

<div>
	<Title
		title="Instellingen"
		shortTitle="Instellingen"
		underTitle="Op deze pagina kan je instellingen aanpassen, doe dit alleen als je weet wat je doet lol" />

	<table class="striped small">
		<thead>
			<tr>
				<th>Naam</th>
				<th>Beschrijving</th>
				<th>Waarde</th>
				<th>Acties</th>
			</tr>
		</thead>
		<tbody>
			{#each data.settings as setting}
				<tr>
					<td>{setting.name}</td>
					<td>{setting.description}</td>
					<td><input type="text" bind:value={setting.value} /></td>
					<td class="actions">
						<button class="btn-a" title="Opslaan" on:click={() => save(setting.id)}>
							<Save />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
