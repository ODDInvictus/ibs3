<script lang="ts">
	import type { Snippet } from 'svelte'
	import InfoCircle from '~icons/tabler/info-circle'
	import Bulb from '~icons/tabler/bulb'
	import ExclamationCircle from '~icons/tabler/exclamation-circle'
	import AlertTriangle from '~icons/tabler/alert-triangle'
	import HandStop from '~icons/tabler/hand-stop'

	type Props = {
		type: 'note' | 'tip' | 'important' | 'warning' | 'caution'
		children: Snippet
	}

	let { type, children }: Props = $props()
</script>

<div class="ibs-callout {type}">
	<div class="icon">
		<i>
			{#if type === 'note'}
				<InfoCircle /> <span>Info</span>
			{:else if type === 'tip'}
				<Bulb /> <span>Tip</span>
			{:else if type === 'important'}
				<ExclamationCircle /> <span>Belangrijk</span>
			{:else if type === 'warning'}
				<AlertTriangle /> <span>Waarschuwing</span>
			{:else}
				<HandStop /> <span>Pas op!</span>
			{/if}
		</i>
	</div>
	<div>
		{@render children?.()}
	</div>
</div>
