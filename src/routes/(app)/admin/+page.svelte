<script>
	import Title from '$lib/components/title.svelte'

	import TablerMail from '~icons/tabler/mail'
	import TablerUsersGroup from '~icons/tabler/users-group'
	import TablerExternalLink from '~icons/tabler/external-link'
	import TablerFileTypeDoc from '~icons/tabler/file-type-doc'
	import TablerLibraryPhoto from '~icons/tabler/photo'
	import TablerFiles from '~icons/tabler/files'
	import TablerAdjustmentsCog from '~icons/tabler/adjustments-cog'
	import TablerListNumbers from '~icons/tabler/list-numbers'
	import TablerBeer from '~icons/tabler/beer'
	import TablerBackhoe from '~icons/tabler/backhoe'
	import { toast } from '$lib/notification'

	async function bak() {
		await fetch('/strafbakken', {
			method: 'POST',
			body: JSON.stringify({
				action: 'self',
				reason: 'Klikte op het knopje op de admin pagina.',
			}),
		})
			.then(res => res.text())
			.then(res => toast({ title: 'Dit was zeker een keuze van je', message: res, type: 'success' }))
	}
</script>

<Title
	title="Invictus Bier Systeem beheer"
	shortTitle="Administratie"
	underTitle="Welkom op de admin pagina van IBS. Weet je niet wat je hier doet? Dan hoor je hier waarschijnlijk niet" />

<table class="small">
	<tbody>
		<tr>
			<td>
				<a href="/admin/email">
					<span class="icon">
						<TablerMail />
					</span>
					Beheer email
				</a>
			</td>
		</tr>
		<tr>
			<td>
				<a href="/admin/commissie">
					<span class="icon">
						<TablerUsersGroup />
					</span>
					Beheer commissies
				</a>
			</td>
		</tr>
		<tr>
			<td>
				<a href="/admin/shortlinks">
					<span class="icon">
						<TablerExternalLink />
					</span>
					Short links
				</a>
			</td>
		</tr>
		<tr>
			<td>
				<a href="/docs">
					<span class="icon">
						<TablerFileTypeDoc />
					</span>
					Documentatie
				</a>
			</td>
		</tr>
		<tr>
			<td>
				<a href="/fotos/upload">
					<span class="icon">
						<TablerLibraryPhoto />
					</span>
					Upload fotos
				</a>
			</td>
		</tr>
		<tr>
			<td>
				<button class="btn-a" on:click={bak}>
					<span class="icon">
						<TablerBeer />
					</span>
					Krijg strafbak
				</button>
			</td>
		</tr>
		<tr>
			<td>
				<a href="/file">
					<span class="icon">
						<TablerFiles />
					</span>
					Bestanden
				</a>
			</td>
		</tr>
		<tr>
			<td>
				<a href="/admin/instellingen">
					<span class="icon">
						<TablerAdjustmentsCog />
					</span>
					IBS Instellingen
				</a>
			</td>
		</tr>
		<tr>
			<td>
				<a href="/ranglijst/nieuw">
					<span class="icon">
						<TablerListNumbers />
					</span>
					Nieuwe ranglijst
				</a>
			</td>
		</tr>
		<tr>
			<td>
				<a href="/admin/jobs">
					<span class="icon">
						<TablerBackhoe />
					</span>
					Jobs
				</a>
			</td>
		</tr>
	</tbody>
</table>

<style lang="scss">
	td {
		text-align: left;
		.icon {
			vertical-align: -0.25em;
		}
	}
</style>
