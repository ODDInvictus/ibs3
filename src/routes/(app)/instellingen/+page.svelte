<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import Table from '$lib/components/table.svelte';
	import type { Preference } from '@prisma/client';
	import { page } from '$app/stores';
	import { promptCheckbox } from '$lib/promptCheckbox';
	import { confirm } from '$lib/confirm';
	import { toast } from '$lib/notification';

	const preferences = $page.data.preferences as Preference[];

	function edit(id: string, action: string) {
		const obj = preferences.find((p) => p.id === Number(id));

		if (!obj) return;

		if (action === 'edit') {
			promptCheckbox({
				title: 'Voorkeur aanpassen',
				message: 'Geef de nieuwe waarde op voor deze voorkeur.',
				value: obj.value,
				cb: async (value) => {
					await cb(id, value, 'edit');
				}
			});
		} else if (action === 'revert') {
			confirm({
				title: 'Voorkeur terugdraaien',
				message: `De standaard waarde voor deze voorkeur is: ${obj.defaultValue}`,
				cb: async () => {
					await cb(id, obj.defaultValue, 'revert');
				}
			});
		}
	}

	async function cb(id: string, value: boolean, action: string) {
		await fetch('', {
			method: 'POST',
			body: JSON.stringify({
				id: id,
				value,
				action
			})
		})
			.then(async (res) => {
				const body = await res.json();
				console.log(body);

				if (body.success) {
					toast({
						title: 'Voorkeur aangepast',
						message: `De voorkeur is aangepast naar ${value}.`,
						type: 'success'
					});
					setTimeout(() => {
						location.reload();
					}, 1000);
				} else {
					toast({
						title: 'Voorkeur niet aangepast',
						message: body.message,
						type: 'error'
					});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}
</script>

<Title title="Instellingen" underTitle="Op deze pagina kan je je ibs voorkeuren veranderen." />

<Table
	tableId="settings-table"
	columns={['Voorkeur', 'Waarde', 'Acties']}
	rows={preferences.map((p) => {
		return [String(p.id), p.base.description, String(p.value)];
	})}
	actions={[
		{
			type: 'edit',
			action: (id) => edit(id, 'edit'),
			title: 'Bewerk voorkeur'
		},
		{
			type: 'revert',
			action: (id) => edit(id, 'revert'),
			title: 'Terug naar standaard waarde'
		}
	]}
/>
