<script lang="ts">
	import logo from '$lib/assets/logowhite.png';
	export let width: string = '100px';
	export let height: string = '100px';
</script>

<img src={logo} alt="logo" class="logo hidden sm:block" {height} {width} />

<style>
	:global(html.light img.logo) {
		filter: invert(1);
	}
</style>
