<script lang="ts">
	import { toast } from '$lib/notification'

	export let url: string
	export let redirect: string
	export let confirmMessage: string | undefined = undefined
	export let text = 'Verwijderen'
</script>

<!-- TODO add loading spinner, prevent spam clicking -->
<button
	class="btn-danger"
	type="button"
	{...$$restProps}
	on:click={async () => {
		if (confirmMessage && !confirm(confirmMessage)) return
		const res = await fetch(url, { method: 'DELETE' })
		if (res.ok) {
			location.href = redirect
		} else {
			const message = await res.text()
			toast({
				title: res.statusText,
				message,
				type: 'danger',
				time: message ? 10000 : undefined,
			})
		}
	}}>{text}</button
>
