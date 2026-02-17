<script lang="ts">
	import Base from './Base.svelte'

	interface Props {
		text: string
		[key: string]: any
	}

	let { ...props }: Props = $props()
</script>

<Base {...props}>
	<p>
		{props.text}
	</p>
</Base>
