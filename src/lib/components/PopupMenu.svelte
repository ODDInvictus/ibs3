<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';

	export let showMenu: boolean = false;

	function logOut() {
		signOut();
	}

	function isDarkMode(): boolean {
		return !!document.querySelector(':root')?.classList.contains('dark');
	}

	function toggleColor() {
		// TODO: logic for feuten (dont toggle if feut)
		document.querySelector(':root')?.classList.toggle('dark');
		document.querySelector(':root')?.classList.toggle('light');
	}
</script>

{#if showMenu}
	<div class="menu">
		<div id="pointer" />

		<button class="menu-item" on:click={() => toggleColor()}>{
			isDarkMode() ? 'Light mode' : 'Dark mode'
		}</button>
		<a class="menu-item" href="/profiel">Profiel</a>
		<a class="menu-item" href="/financieel/persoonlijk">Streeplijst</a>
		<a class="menu-item" href="/instellingen">Instellingen</a>

		<hr />

		<button class="menu-item" on:click={() => logOut()}>Uitloggen</button>
	</div>
{/if}

<style>
	.menu {
		position: absolute;
		margin-top: 15rem;
		z-index: 1;
		background-color: var(--card-color);
		color: var(--text-color);
		border-radius: 5px;
		box-shadow: 0 0 5px 0 var(--shadow-color);
		width: 10rem;
		padding: 0.5rem;

		cursor: default;

		display: flex;
		flex-direction: column;
		align-items: center;
	}

	hr {
		margin-top: 0.4rem;
		margin-bottom: 0.4rem;
		width: 90%;
		border-top: 1px solid var(--primary-color);
		border-radius: 5px;
	}

	.menu-item {
		padding-bottom: 0.2rem;
		padding-top: 0.2rem;
		width: 100%;
		height: 100%;
	}

	.menu-item:hover {
		background-color: var(--card-focus-color);
	}

	#pointer {
		position: absolute;
		width: 0;
		height: 0;
		/* box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2); */
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-bottom: 10px solid var(--card-color);
		margin-top: -1rem;
		margin-left: 6rem;
	}
</style>
