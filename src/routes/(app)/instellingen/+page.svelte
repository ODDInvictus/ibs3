<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import Table from '$lib/components/table.svelte'
	import type { Preference } from '@prisma/client'
	import { page } from '$app/stores'
	import { promptCheckbox } from '$lib/promptCheckbox'
	import { confirm } from '$lib/confirm'
	import { toast } from '$lib/notification'
	import type { PageData } from './$types'
	import { alert } from '$lib/alert'
	import { signOut } from '@auth/sveltekit/client'

	export let data: PageData

	function logout() {
		confirm({
			title: 'Uitloggen?',
			message: 'Weet je zeker dat je wil uitloggen?',
			cb: success => {
				if (success) signOut()
			},
		})
	}

	function edit(id: string, action: string) {
		const obj = data.preferences.find(p => p.id === Number(id))

		if (!obj) return

		if (action === 'edit') {
			promptCheckbox({
				title: 'Voorkeur aanpassen',
				message: 'Geef de nieuwe waarde op voor deze voorkeur.',
				value: obj.value,
				cb: async value => {
					await cb(id, value, 'edit')
				},
			})
		} else if (action === 'revert') {
			confirm({
				title: 'Voorkeur terugdraaien',
				message: `De standaard waarde voor deze voorkeur is: ${obj.base.defaultValue}`,
				cb: async value => {
					if (value) await cb(id, obj.base.defaultValue, 'edit')
				},
			})
		}
	}

	async function cb(id: string, value: boolean, action: string) {
		await fetch('', {
			method: 'POST',
			body: JSON.stringify({
				id: id,
				value,
				action,
			}),
		})
			.then(async res => {
				const body = await res.json()

				if (body.success) {
					toast({
						title: 'Voorkeur aangepast',
						message: `De voorkeur is aangepast naar ${value}.`,
						type: 'success',
					})
					setTimeout(() => {
						location.reload()
					}, 1000)
				} else {
					toast({
						title: 'Voorkeur niet aangepast',
						message: body.message,
						type: 'danger',
					})
				}
			})
			.catch(err => {
				console.error(err)
			})
	}

	async function setTheme(theme: string) {
		await fetch('', {
			method: 'POST',
			body: JSON.stringify({
				action: 'theme',
				theme,
			}),
		})
			.then(async res => {
				const body = await res.json()

				if (body.success) {
					toast({
						title: 'Thema aangepast',
						message: `De voorkeur is aangepast naar ${theme}.`,
						type: 'success',
					})
					setTimeout(() => {
						location.reload()
					}, 1000)
				} else {
					toast({
						title: 'Thema niet aangepast',
						message: body.message,
						type: 'danger',
					})
				}
			})
			.catch(err => {
				console.error(err)
			})
	}

	async function rejectToken(id: string) {
		const callback = async () => {
			await fetch('', {
				method: 'POST',
				body: JSON.stringify({
					id: id,
					action: 'reject-token',
				}),
			})
				.then(async res => {
					const body = await res.json()

					if (body.success) {
						toast({
							title: 'Succes',
							message: `Token is succesvol verwijderd.`,
							type: 'success',
						})
						setTimeout(() => {
							location.reload()
						}, 1000)
					} else {
						toast({
							title: 'Token niet verwijderd',
							message: body.message,
							type: 'danger',
						})
					}
				})
				.catch(err => {
					console.error(err)
					toast({
						title: 'Token niet verwijderd',
						message: err,
						type: 'danger',
					})
				})
		}

		confirm({
			title: 'Token verwijderen',
			message: `Weet je zeker dat je deze token wil verwijderen? Dit kan niet ongedaan gemaakt worden.`,
			cb: async value => {
				if (value) await callback()
			},
		})
	}

	function viewToken(id: string) {
		alert({
			title: 'Token bekijken',
			message: 'Token: ' + data.tokens.find(t => t.token === id)?.token,
		})
	}
</script>

<Title title="Instellingen" underTitle="Op deze pagina kan je je ibs voorkeuren veranderen." />

<h2>Thema</h2>
<small>Let op: Tijdelijke thema's kunnen niet gewijzigd worden!</small>
<br />

<input type="radio" id="light" name="theme" value="light" checked={data.currentTheme === 'light'} on:click={() => setTheme('light')} />
<label for="light">Lichte modus</label>
<br />
<input type="radio" id="dark" name="theme" value="dark" on:click={() => setTheme('dark')} checked={data.currentTheme === 'dark'} />
<label for="dark">Donkere modus</label>
<br />
<input type="radio" id="feut" name="theme" value="feut" on:click={() => setTheme('feut')} checked={data.currentTheme === 'feut'} />
<label for="feut">Feuten thema</label>
<br />
<input type="radio" id="dies" name="theme" value="dies" on:click={() => setTheme('dies')} checked={data.currentTheme === 'dies'} />
<label for="dies">Dies thema</label>
<br />
<input
	type="radio"
	id="invakancie25"
	name="theme"
	value="invakancie25"
	on:click={() => setTheme('invakancie25')}
	checked={data.currentTheme === 'invakancie25'} />
<label for="dies">InVakanCie 2025 thema</label>

<hr />

<h2>Email voorkeuren</h2>

<Table
	class="striped"
	tableId="settings-table"
	columns={['Voorkeur', 'Waarde', 'Acties']}
	rows={data.preferences.map(p => {
		return [String(p.id), p.base.description, String(p.value)]
	})}
	actions={[
		{
			type: 'edit',
			action: id => edit(id, 'edit'),
			title: 'Bewerk voorkeur',
		},
		{
			type: 'revert',
			action: id => edit(id, 'revert'),
			title: 'Terug naar standaard waarde',
		},
	]} />

<hr />

<h2>Tokens</h2>

<Table
	class="striped"
	tableId="tokens-table"
	columns={['Naam', 'Type', 'Acties']}
	rows={data.tokens.map(t => {
		return [t.token, t.name, t.type]
	})}
	actions={[
		{
			type: 'view',
			action: id => viewToken(id),
			title: 'Token bekijken',
		},
		{
			type: 'delete',
			action: id => rejectToken(id),
			title: 'Token verwijderen',
		},
	]} />

<hr />

<h2>Logout</h2>
<div class="uitloggen" on:click={logout}>
	<button>Uitloggen</button>
</div>

<style>
	.uitloggen {
		padding-top: 1rem;
	}
</style>
