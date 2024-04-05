<script lang="ts">
	import { notifications } from '../notification'
	import SingleToast from './SingleToast.svelte'
</script>

{#if $notifications}
	<div class="notifications">
		{#each $notifications as notification}
			<SingleToast {notification} />
		{/each}
	</div>
{/if}
