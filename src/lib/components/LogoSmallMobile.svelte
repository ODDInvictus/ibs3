<script lang="ts">
	import logo from '$lib/assets/logowhite.png';
	export let width: string = '100px';
	export let height: string = '100px';
</script>

<img src={logo} alt="logo" class="block sm:hidden" {height} {width} />
