<script lang="ts">
	import { page } from '$app/stores';
	import Form from './form.svelte';

	const f = $page.data.form;
</script>

<Form {...f} />
