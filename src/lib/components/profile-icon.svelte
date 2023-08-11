<script lang="ts">
	import { mergeClassNames } from '$lib/textUtils';
	import { onMount } from 'svelte';
</script>

<div class={mergeClassNames('ibs-profile-icon', $$props.class)}>
	<img
		height={$$props.height}
		width={$$props.width}
		src={$$props.src}
		alt={$$props.name
			.split(' ')
			.map((w) => w[0])
			.join('')}
	/>
</div>
