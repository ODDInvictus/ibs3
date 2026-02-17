<script lang="ts">
	import { page } from '$app/state'
	import Form from '$lib/form/form.svelte'
</script>

<Form {...page.data.form} />
