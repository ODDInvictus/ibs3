<script lang="ts">
	import { goto } from '$app/navigation'
	import InfoCircle from '~icons/tabler/info-circle'

	interface Props {
		text: string
		class: string
	}

	let { text, class: className }: Props = $props()
</script>

<div class={'markdown-element ' + className}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="heading" role="button" tabindex="-1" onclick={() => goto('/docs/markdown')}>
		<p>markdown</p>
		<div class="icon">
			<InfoCircle />
		</div>
	</div>
	<p>{@html text}</p>
</div>

<style lang="scss">
	$spacing: 0.5rem;
	$headingFontSize: 0.75rem;

	.markdown-element {
		background-color: #eee;
		color: #242424;
		padding: $spacing;
		padding-top: calc(2 * $spacing + $headingFontSize);
		border-radius: 6px;
		width: 100%;
		position: relative;
		word-wrap: break-word;
	}

	.heading {
		display: flex;
		position: absolute;
		color: #929292;
		font-size: $headingFontSize;
		top: $spacing;
		left: $spacing;
		gap: calc($spacing / 2);
		cursor: pointer;

		&:hover {
			text-decoration: underline;
		}

		.icon {
			transform: translateY(2px);
		}
	}
</style>
