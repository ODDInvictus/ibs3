<script lang="ts">
	import { toast } from '$lib/notification';

	export let url: string;
	export let redirect: string;
</script>

<!-- TODO add loading spinner, prevent spam clicking -->
<button
	class="btn-danger"
	type="button"
	on:click={async () => {
		const res = await fetch(url, { method: 'DELETE' });
		if (res.ok) {
			location.href = redirect;
		} else {
			const message = await res.text();
			toast({
				title: res.statusText,
				message,
				type: 'danger',
				time: message ? 10000 : undefined
			});
		}
	}}>Verwijderen</button
>
