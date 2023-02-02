<script lang="ts">
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte';
	import LogoMobile from '$lib/components/LogoSmallMobile.svelte';
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

	// vierkante schermen zijn voor homo's
	$: innerWidth = 0;
	$: innerHeight = 0;

	$: if (innerHeight / innerWidth >= 0.99 && innerHeight / innerWidth <= 1.01) {
		alert('Vierkante schermen zijn voor homos');

		// Toggle root element filter to turn everything black
		const root = document.documentElement;
		root.style.filter = 'grayscale(100%) contrast(0.5)';
	}

	let showMenu: boolean = false;

	function toggleMenu() {
		showMenu = !showMenu;
	}

	function closeMenu() {
		showMenu = false;
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div id="background" class="w-screen col-span-0" />
<div id="layout" class="grid gap-4 grid-cols-12 grid-row-12">
	<aside
		class="fixed z-10 h-[10vh]
		sm:relative 
		flex p-0 sm:h-[calc(100vh-2.5rem)] md:h-[calc(100vh-3.20rem)]
		flex-row sm:row-span-12
		row m-2 drop-shadow 
		sm:flex-col
		sm:col-span-4
		rounded-md
		md:m-5 h-2/12
		xl:col-span-3 2xl:col-span-2
		justify-center items-center"
	>
		<section id="top" class="hidden sm:block">
			<button on:click={() => goto('/')}>
				<div class="center-logo">
					<Logo width="75%" />
				</div>
			</button>
		</section>

		<hr />

		<section class="sm:mt-5 sm:items-start sm:pl-5">
			<a href="/kalender" class="items-center sm:justify-left sm:items-start sm:w-full ">
				<i><CalendarDays /></i>
				<span class="hidden sm:block">Kalender</span>
			</a>
		</section>

		<section class="sm:items-start sm:pl-5">
			<a href="/strafbakken" class="items-center sm:justify-left sm:items-start sm:w-full ">
				<i><Cake /></i>
				<span class="hidden sm:block">Strafbakken</span>
			</a>
		</section>

		<section class="sm:items-start sm:pl-5">
			<a href="/maluspunten" class="items-center sm:justify-left sm:items-start sm:w-full ">
				<i><FaceFrown /></i>
				<span class="hidden sm:block">Maluspunten</span>
			</a>
		</section>

		<section class="sm:items-start sm:pl-5">
			<a href="/leden" class="items-center sm:justify-left sm:items-start sm:w-full ">
				<i><Users /></i>
				<span class="hidden sm:block">Leden</span>
			</a>
		</section>

		<section class="sm:items-start sm:pl-5">
			<a href="/financieel" class="items-center sm:justify-left sm:items-start sm:w-full ">
				<i><Folder /></i>
				<span class="hidden sm:block">Financieel</span>
			</a>
		</section>

		<section class="sm:items-start sm:pl-5">
			<a href="/instellingen" class="items-center sm:justify-left sm:items-start sm:w-full ">
				<i><Cog6Tooth /></i>
				<span class="hidden sm:block">Instellingen</span>
			</a>
		</section>

		<section
			class="sm:mt-auto sm:pb-2 items-center sm:justify-left sm:items-start sm:pl-5 sm:w-full "
		>
			<a href="/over">
				<i><InformationCircle /></i>
				<span class="hidden sm:block">IBS v3.0.0</span>
			</a>
		</section>
	</aside>

	<div id="content" class="sm:block col-span-12 sm:col-span-8 xl:col-span-9 2xl:col-span-10 sm:p-0">
		<header class="p-5 sm:p-0 sm:pr-5">
			<div class="hidden md:flex">
				<Breadcrumps />
			</div>

			<div class="block mobile-logo">
				<button on:click={() => goto('/')}>
					<LogoMobile />
				</button>
			</div>

			<button id="user" on:click={toggleMenu} use:clickOutside on:click_outside={() => closeMenu()}>
				<div id="user-card">
					<p id="name">{$page.data.session?.user?.name ?? 'Gebruiker'}</p>
					<p id="title">Lit</p>
				</div>
				<!-- <button>Log uit</button> -->
				<img src="https://avatars.githubusercontent.com/u/11670885?v=4" alt="user" />

				<PopupMenu {showMenu} />
			</button>
		</header>

		<main class="pb-[10vh] sm:pb-0 mr-0 sm:mr-5 p-5 sm:pr-5 sm:rounded-md drop-shadow">
			<slot />
		</main>
	</div>
</div>

<style>
	/* smaller than 640px */
	@media (max-width: 640px) {
		aside > section > a {
			justify-content: center;
		}

		aside > section {
			height: 100%;
		}

		aside {
			width: calc(100vw - 1em);
			top: 90vh;

			/* shadow */
			box-shadow: 0 0 0.5em 0.5em var(--shadow-color);
		}
	}

	.center-logo {
		justify-content: center;
		align-items: center;
		display: flex;
	}

	main {
		height: calc(100vh - 6em);
		background-color: var(--card-color);

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
		align-items: flex-start;
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
		/* align-items: center; */
		justify-content: center;
	}

	/* every section where there is no element with id 'hey' */
	section:not(#top) {
		width: 80%;
	}

	section > a {
		display: flex;
		flex-direction: row;
		/* width: 80%; */
		color: var(--text-color);
		padding: 1rem;
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
</style>
