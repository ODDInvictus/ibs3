<script lang="ts">
	import Form from '$lib/form/form.svelte';

	export let form: any;
</script>

<div class="modal" role="dialog">
	<div class="contents">
		<Form {...form} />
	</div>
</div>

<style lang="scss">
	.modal {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		z-index: 100;

		color: black;

		pointer-events: none;
	}

	.contents {
		min-width: 240px;
		border-radius: 6px;
		padding: 1.5em;
		background: white;
		display: flex;
		flex-direction: column;
		pointer-events: auto;
	}
</style>
