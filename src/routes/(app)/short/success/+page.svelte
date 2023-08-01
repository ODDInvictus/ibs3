<script lang="ts">
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';

	const slug = $page.url.searchParams.get('slug');

	const origin = $page.url.hostname;
</script>

<Title title="Shortlink aangemaakt" />

<p>Je kan de link vinden op <a href={`https://${origin}/s/${slug}`}>{origin}/s/{slug}</a></p>

<style lang="scss">
	p {
		text-align: center;
	}
</style>
