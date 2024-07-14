<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { toast } from '$lib/notification'
	import type { PageData } from './$types'

	export let data: PageData

	async function action(id: number, action: 'edit' | 'delete') {
		await fetch('', {
			method: 'POST',
			body: JSON.stringify({
				id,
				action,
			}),
		}).then(async res => {
			const body = await res.json()
			if (res.status !== 200) {
				toast({
					title: 'Oeps',
					message: body.message,
					type: 'danger',
				})
			} else {
				toast({
					title: 'Gelukt',
					message: body.message,
					type: 'success',
				})
			}
		})
	}
</script>

<Title title="Shortlinks" underTitle="Alle shortlinks in het systeem" />

<div class="topbar">
	<a href="/short">Nieuwe shortlink</a>
</div>

<table class="small striped">
	<thead>
		<tr>
			<th>ID</th>
			<th>Shortlink</th>
			<th>Link</th>
			<th>Aangemaakt op</th>
			<th>Gebruiker</th>
			<th>Acties</th>
		</tr>
	</thead>
	<tbody>
		{#each data.links as link}
			<tr>
				<td>{link.id}</td>
				<td><a href="/s/{link.shortLink}">{link.shortLink}</a></td>
				<td class="long-link" title={link.link}>{link.link}</td>
				<td>{link.createdAt.toLocaleDateString('nl')}</td>
				<td>{link.user.firstName}</td>
				<td>
					<button class="btn-a" on:click={() => action(link.id, 'delete')}>Verwijder</button>
					<a href="/admin/shortlinks/{link.shortLink}">Informatie</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.topbar {
		display: flex;
		justify-content: center;
	}

	.long-link {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 40vw;
	}
</style>
