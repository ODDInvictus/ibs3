<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import Logo from '$lib/Logo.svelte';
	import StyledButton from '$lib/StyledButton.svelte';

	function login() {
		console.log('click!')
		signIn('authentik')
	}
</script>

<div id="content" class="dark flex justify-center items-center">
	<div class="-mt-20">
		<Logo height="600px" width="600px" />
	
		<div class="flex justify-center">
			<StyledButton onclick={login}>
				Log in
			</StyledButton>
		</div>
	</div>
</div>

<style>
	#content {
    background-color: #010a4a;

		width: 100vw;
		height: 100vh;
	}
</style>
