<script lang="ts">
	interface Props {
		width?: string
		height?: string
	}

	let { width = '70', height = '70' }: Props = $props()
</script>

<svg {width} {height} viewBox="0 0 174 174" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M168 87C168 131.735 131.735 168 87 168C42.2649 168 6 131.735 6 87C6 42.2649 42.2649 6 87 6C131.735 6 168 42.2649 168 87ZM174 87C174 135.049 135.049 174 87 174C38.9512 174 0 135.049 0 87C0 38.9512 38.9512 0 87 0C135.049 0 174 38.9512 174 87ZM119.5 90.2226L87 121.957V121.969L54.329 90.2343C50.6624 86.401 44.829 77.7346 47.829 67.2346C50.5849 57.5887 59.329 53.7343 62.329 52.7343C66.9957 51.0676 79.4 51.5687 87 61.9687C94.6 51.5687 106.833 51.0559 111.5 52.7226C114.5 53.7226 123.244 57.5769 126 67.2229C129 77.7229 123.167 86.3892 119.5 90.2226Z"
		fill="url(#paint0_linear_1101_36)" />
	<defs>
		<linearGradient id="paint0_linear_1101_36" x1="31.5" y1="17" x2="147" y2="157" gradientUnits="userSpaceOnUse">
			<stop stop-color="#76EAD8" />
			<stop offset="1" stop-color="#6CE6AF" />
		</linearGradient>
	</defs>
</svg>
