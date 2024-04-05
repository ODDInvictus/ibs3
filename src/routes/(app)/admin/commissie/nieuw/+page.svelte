<script lang="ts">
	import { page } from '$app/stores'
	import Form from '$lib/form/form.svelte'

	const f = $page.data.form
</script>

<Form {...f} />
