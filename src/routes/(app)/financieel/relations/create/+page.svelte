<script lang="ts">
	import Form from '$lib/form/form.svelte';
	import { page } from '$app/stores';

	// import type { PageData } from './$types';
	// export let data: PageData;
</script>

<Form {...$page.data.form} />
