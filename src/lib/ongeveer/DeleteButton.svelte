<script lang="ts">
	import { toast } from '$lib/notification'

	interface Props {
		url: string
		redirect: string
		confirmMessage?: string | undefined
		text?: string
		[key: string]: any
	}

	let { url, redirect, confirmMessage = undefined, text = 'Verwijderen', ...rest }: Props = $props()
</script>

<!-- TODO add loading spinner, prevent spam clicking -->
<button
	class="btn-danger"
	type="button"
	{...rest}
	onclick={async () => {
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
	}}>{text}</button>
