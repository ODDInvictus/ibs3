<script lang="ts">
	import { mergeClassNames } from '$lib/textUtils';

	let height = $$props.height ?? 64;
	let width = $$props.width ?? 64;
</script>

<div class={mergeClassNames('ibs-profile-icon', $$props.class)}>
	<img
		src={`/image/users/${$$props.src}?size=${height}x${width}`}
		alt={$$props.name
			.split(' ')
			.map((w) => w[0])
			.join('')}
	/>
</div>
