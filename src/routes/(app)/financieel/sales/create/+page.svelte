<script lang="ts">
	import { page } from '$app/stores';
	import Form from '$lib/form/form.svelte';
</script>

<Form {...$page.data.form} />
