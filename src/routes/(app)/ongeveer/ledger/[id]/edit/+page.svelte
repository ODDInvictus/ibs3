<script lang="ts">
	import Form from '$lib/form/form.svelte';
	import { page } from '$app/stores';
	import type { PageServerData } from './$types';
	import { toast } from '$lib/notification';

	export let data: PageServerData;
</script>

<Form {...$page.data.form} />
<button
	class="btn-danger"
	disabled={data.ledger._count.Transaction > 0}
	on:click={async () => {
		const confirmed = confirm('Weet je zeker dat je dit grootboek wilt verwijderen?');
		if (!confirmed) return;

		const res = await fetch(`/ongeveer/ledger/${data.ledger.id}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			window.location.href = '/ongeveer/ledger';
		} else {
			toast({
				title: res.statusText,
				message: 'Er is iets misgegaan bij het verwijderen van het grootboek.',
				type: 'danger'
			});
		}
	}}
>
	Verwijderen
</button>
