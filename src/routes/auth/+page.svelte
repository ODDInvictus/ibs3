<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import Logo from '$lib/components/Logo.svelte';
	import StyledButton from '$lib/components/StyledButton.svelte';
</script>

<div id="content" class="dark flex justify-center items-center">
	<div class="-mt-20">
		<Logo height="600px" width="600px" />

		<div class="flex justify-center">
			<button on:click={() => signIn('authentik')}> Log in </button>
		</div>
	</div>
</div>

<style>
	#content {
		background-color: #010a4a;
		width: 100vw;
		height: 100vh;
	}

	button {
		background-color: purple;
		color: white;
		border: none;
		border-radius: 5px;
		padding: 0.5rem 1rem;
	}
</style>
