<script lang="ts">
	import logo from '$lib/assets/logowhite.png'
	interface Props {
		width?: string
		height?: string
	}

	let { width = '100px', height = '100px' }: Props = $props()
</script>

<img src={logo} alt="logo" class="block sm:hidden" {height} {width} />
