<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { toast } from '$lib/notification'
	import type { PageData } from './$types'
	import Save from '~icons/tabler/device-floppy'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	const save = (settingId: number) => {
		const setting = data.ibsSettings.find(s => s.id === settingId)
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
		{#each data.ibsSettings as setting}
			<tr>
				<td>{setting.name}</td>
				<td>{setting.description}</td>
				<td><input type="text" bind:value={setting.value} /></td>
				<td class="actions">
					<button class="btn-a" title="Opslaan" onclick={() => save(setting.id)}>
						<Save />
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

{#if data.unsetKeys?.length > 0}
	<div class="unset-keys">
		<hr />
		<h2>Onbekende instellingen</h2>
		<p>Deze instellingen zijn nog niet bekend in de database, maar wel in de code. Hieronder kan je ze aanmaken</p>

		<table class="striped equal-width">
			<thead>
				<tr>
					<th>Key</th>
					<th>Acties</th>
				</tr>
			</thead>
			<tbody>
				{#each data.unsetKeys as key}
					<tr>
						<td>{key}</td>
						<td>
							<a href="/admin/instellingen/aanmaken/{key}" class="btn-a">Aanmaken</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style lang="scss">
	.unset-keys {
		hr {
			margin: 1rem 0;
		}
	}
</style>
