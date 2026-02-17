<script lang="ts">
	import { fade } from 'svelte/transition'
	import InfoCircle from '~icons/tabler/info-circle'
	import ExclamationCircle from '~icons/tabler/exclamation-circle'
	import AlertCirlce from '~icons/tabler/alert-circle'
	import CircleCheck from '~icons/tabler/circle-check'

	interface Props {
		notification: {
			type: string
			title: string
			message: string
		}
	}

	let { notification }: Props = $props()
</script>

<div role="alert" class="notification {notification.type}" transition:fade>
	<div class="icon">
		{#if notification.type === 'info'}
			<InfoCircle />
		{:else if notification.type === 'success'}
			<CircleCheck />
		{:else if notification.type === 'warning'}
			<AlertCirlce />
		{:else if notification.type === 'danger'}
			<ExclamationCircle />
		{/if}
	</div>
	<div class="body">
		<h3 class="title">
			{notification.title}
		</h3>
		<p class="message">
			{notification.message}
		</p>
	</div>
</div>
