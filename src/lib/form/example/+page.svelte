<script lang="ts">
	import { page } from '$app/state'
	import Form from '$lib/form/form.svelte'

	const f = page.data.form
</script>

<Form {...f} />
