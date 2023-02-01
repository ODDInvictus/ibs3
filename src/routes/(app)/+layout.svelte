<script lang="ts">
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { clickOutside } from '$lib/events/clickOutside';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		CalendarDays,
		Cake,
		Users,
		Folder,
		Cog6Tooth,
		InformationCircle,
		FaceFrown
	} from 'svelte-heros-v2';
	import PopupMenu from '$lib/components/PopupMenu.svelte';
	import Breadcrumps from '$lib/components/Breadcrumps.svelte';

	function toggleColor() {
		// TODO: logic for feuten (dont toggle if feut)
		document.querySelector(':root')?.classList.toggle('dark');
		document.querySelector(':root')?.classList.toggle('light');
	}
	let showMenu: boolean = false;

	function toggleMenu() {
		showMenu = !showMenu;
	}

	function closeMenu() {
		showMenu = false;
	}
</script>

<div id="layout" class="grid gap-4 grid-cols-12">
	<div id="background" class="w-screen col-span-0" />
	<aside class="col-span-5 sm:col-span-4 xl:col-span-3 2xl:col-span-2">
		<section id="top">
			<button on:click={() => goto('/')}>
				<div class="center-logo">
					<Logo width="75%" />
				</div>
			</button>
			<!-- <p>Invictus Bier Systeem</p> -->
		</section>

		<hr />

		<section>
			<a href="/kalender">
				<i><CalendarDays /></i>
				<span>Kalender</span>
			</a>
		</section>

		<section>
			<a href="/strafbakken">
				<i><Cake /></i>
				<span>Strafbakken</span>
			</a>
		</section>

		<section>
			<a href="/maluspunten">
				<i><FaceFrown /></i>
				<span>Maluspunten</span>
			</a>
		</section>

		<section>
			<a href="/leden">
				<i><Users /></i>
				<span>Leden</span>
			</a>
		</section>

		<section>
			<a href="/financieel">
				<i><Folder /></i>
				<span>Financieel</span>
			</a>
		</section>

		<section>
			<a href="/instellingen">
				<i><Cog6Tooth /></i>
				<span>Instellingen</span>
			</a>
		</section>

		<section>
			<a href="/over">
				<i><InformationCircle /></i>
				<span>IBS v3.0.0</span>
			</a>
		</section>
	</aside>

	<div id="content" class="sm:col-span-8 xl:col-span-9 2xl:col-span-10">
		<header>
			<Breadcrumps />
			<!-- button to toggle color -->
			<button on:click={toggleColor}> Toggle kleurenschema </button>

			<button id="user" on:click={toggleMenu} use:clickOutside on:click_outside={closeMenu}>
				<div id="user-card">
					<p id="name">{$page.data.session?.user?.name ?? 'Gebruiker'}</p>
					<p id="title">Lit</p>
				</div>
				<!-- <button>Log uit</button> -->
				<img src="https://avatars.githubusercontent.com/u/11670885?v=4" alt="user" />

				<PopupMenu {showMenu} />
			</button>
		</header>

		<main>
			<div class="p-5">
				<slot />
			</div>
		</main>
	</div>
</div>

<style>
	.center-logo {
		/* Flex and center */
		display: flex;
		justify-content: center;
		align-items: center;
	}

	main {
		height: calc(100vh - 6.5rem);
		background-color: var(--card-color);
		border-radius: 5px;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

		overflow: scroll;
		overflow-x: hidden;
	}

	header {
		height: 4rem;
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		color: white;
	}

	header > #user {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.8rem;
	}

	header > #user #name {
		/* User name */
		font-weight: bold;
	}

	header > #user #title {
		/* User title */
		font-size: 0.8rem;
		float: right;
		color: var(--light-grey-color);
	}

	header > #user > img {
		/* User avatar */
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
	}

	aside {
		background-color: var(--card-color);
		display: flex;
		flex-direction: column;
		border-radius: 5px;
	}

	#background {
		z-index: -1;
		position: absolute;
		height: 22rem;
		width: 100vw;
		background-color: var(--primary-color);
		background: linear-gradient(145deg, var(--primary-color) 0%, var(--primary-light-color) 100%);
	}

	#top {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 10rem;
		color: var(--text-color);
	}

	aside > hr {
		border-top: 1px solid var(--seperator-color);
		border-radius: 5px;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
	}

	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	aside > section:nth-child(3) {
		/* margin-top: 0.5rem; */
	}

	aside > section:last-child {
		/* margin-top: auto; */
		/* padding-bottom: 0.5rem; */
	}

	section > a {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		/* width: 80%; */
		color: var(--text-color);
		/* margin-left: 1rem;
		margin-right: 1rem; */
		padding: 0.8rem;
	}

	section > a:hover {
		background: rgb(126, 34, 206);
		background: linear-gradient(145deg, #7e22ce 0%, #8b5cf6 100%);
		border-radius: 5px;
		color: var(--button-text-color);
	}

	section > a > i {
		color: var(--text-color);
	}

	section > a:hover > i {
		color: var(--button-text-color);
	}

	section > a span {
		/* margin-left: 0.5rem; */
	}
</style>
