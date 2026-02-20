<script lang="ts">
	import { mergeClassNames } from '$lib/textUtils'
	import { getPictureUrl } from '$lib/utils'
	interface Props {
		[key: string]: any
	}

	let { ...props }: Props = $props()

	let height = props.height ?? 128
	let width = props.width ?? 128
	let fixedSize = props.width ?? false
</script>

<div class={mergeClassNames('ibs-profile-icon', props.class)}>
	<img
		src={getPictureUrl(props.filename)}
		alt={props.name
			.split(' ')
			.map(w => w[0])
			.join('')}
		width={fixedSize ? width : undefined}
		height={fixedSize ? height : undefined} />
</div>
