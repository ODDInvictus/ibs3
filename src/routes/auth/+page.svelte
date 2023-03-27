<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import Logo from '$lib/components/Logo.svelte';
	import StyledButton from '$lib/components/StyledButton.svelte';
</script>

<div id="content" class="dark flex justify-center items-center">
	<div class="-mt-20">
		<div id="logo" />
		<h1>
			Invictus Bier Systeem
		</h1>
	
		<div class="flex justify-center">
			<button on:click={() => signIn('authentik')}>
				Log in
			</button>
		</div>
	</div>
</div>

<style lang="scss">
	#logo {
		width: 600px;
		height: 500px;

		// Media query for mobile
		@media (max-width: 600px) {
			width: 300px;
			height: 250px;
		}

		background-image: url('/logo_griffin.svg');
		margin: 0;
	}

	h1 {
		font-size: 2rem;
		text-align: center;
		color: white;
	}

	#content {
		width: 100vw;
		height: 100vh;
		background-image: url('/auth_bg.svg');
		background-size: cover;
	}

	button {
		border-radius: 5px;
		padding: 0.5rem 1rem;
		color: white;
	}

	button:hover {
		background-color: #f2f2f2;
		color: #002233;
		text-decoration: underline;
	}
</style>
