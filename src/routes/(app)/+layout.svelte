<script lang="ts">
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte'
	import LogoMobile from '$lib/components/LogoSmallMobile.svelte'
  import { clickOutside } from '$lib/events/clickOutside'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { CalendarDays, Cake, Users, Folder, Cog6Tooth, InformationCircle, FaceFrown } from 'svelte-heros-v2'
  import PopupMenu from '$lib/components/PopupMenu.svelte'
	import Breadcrumps from '$lib/components/breadcrumps.svelte'
	import { LDAP_IDS } from '$lib/constants'
	import type { Committee } from '@prisma/client'
  import { PUBLIC_VERSION } from '$env/static/public'

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
    showMenu = false
  }

  let bestCommittee = 'Lid'

  onMount(() => {
    const data = $page.data
    console.log(data)
    if (data.committees && data.committees.length > 0) {
      bestCommittee = getBestId(data.committees)
    }
  })

  const getBestId = (committees: Committee[]): string => {
    let order = [
      LDAP_IDS.COLOSSEUM,
      LDAP_IDS.MEMBERS,
      LDAP_IDS.FINANCIE,
      LDAP_IDS.ADMINS,
      LDAP_IDS.SENAAT,
      LDAP_IDS.FEUTEN,
    ]
    
    let best = committees[0]

    // Now find the committee where their ldapId is the highest in the order array
    // Not every committee is in the order, ignore those
    for (let i = 1; i < committees.length; i++) {
      const committee = committees[i]
      if (order.indexOf(committee.ldapId) > order.indexOf(best.ldapId)) {
        best = committee
      }
    }


    switch (best.ldapId) {
    case LDAP_IDS.FEUTEN:
      return 'Feut'
    case LDAP_IDS.SENAAT:
      return 'Senaat'
    case LDAP_IDS.ADMINS:
      return 'Admin'
    case LDAP_IDS.FINANCIE:
      return 'Financie'
    case LDAP_IDS.COLOSSEUM:
      return 'Colosseum-bewoner'
    case LDAP_IDS.MEMBERS:
      return 'Lid'
    default:
      return 'Lid'
    }
  }
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div id="background" class="w-screen col-span-0" />
<div id="layout" class="grid gap-4 grid-cols-12 grid-row-12">
	<aside
		class="z-10 h-[10vh]
		sm:relative 
		sm:h-[calc(100vh-2.5rem)]
		sm:row-span-12
		drop-shadow 
		sm:flex-col
		sm:col-span-4
		rounded-md
		xl:col-span-3 2xl:col-span-2
		md:m-5"
		>
		<section id="top">
			<button on:click={() => goto('/')}>
				<div class="center-logo">
					<Logo width="75%" />
				</div>
			</button>
		</section>

		<hr />

		<section>
			<a href="/kalender" class="sm:justify-left sm:items-start sm:w-full ">
				<i><CalendarDays /></i>
				<span class="hidden sm:block">Kalender</span>
			</a>
		</section>

		<section>
			<a href="/strafbakken" class="sm:justify-left sm:items-start sm:w-full ">
				<i><Cake /></i>
				<span class="hidden sm:block">Strafbakken</span>
			</a>
		</section>

		<section>
			<a href="/financieel" class="sm:justify-left sm:items-start sm:w-full ">
				<i><Folder /></i>
				<span class="hidden sm:block">Financieel</span>
			</a>
		</section>

		<section>
			<a href="/maluspunten" class="sm:justify-left sm:items-start sm:w-full ">
				<i><FaceFrown /></i>
				<span class="hidden sm:block">Maluspunten</span>
			</a>
		</section>

		<section>
			<a href="/leden" class="sm:justify-left sm:items-start sm:w-full ">
				<i><Users /></i>
				<span class="hidden sm:block">Leden</span>
			</a>
		</section>

		<section>
			<a href="/instellingen" class="sm:justify-left sm:items-start sm:w-full ">
				<i><Cog6Tooth /></i>
				<span class="hidden sm:block">Instellingen</span>
			</a>
		</section>

		<section>
			<a href="/over">
				<i><InformationCircle /></i>
				<span class="hidden sm:block">IBS v{PUBLIC_VERSION}</span>
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

      <button id="user" on:click={toggleMenu} use:clickOutside on:click_outside={closeMenu}>
        <div id="user-card">
          <p id="name">{$page.data.user.firstName + ' ' + $page.data.user.lastName ?? 'Gebruiker'}</p>
          <p id="title">{bestCommittee}</p>
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

<style lang="scss">

	.center-logo {
		justify-content: center;
		align-items: center;
		display: flex;
	}

	main {
		height: calc(100vh - 5.25rem);
		background-color: var(--card-color);

		overflow: auto;
		overflow-x: hidden;
	}

	header {
		height: 4rem;
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		color: white;

		#user {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			gap: 0.8rem;

			img {
				width: 3rem;
				height: 3rem;
				border-radius: 50%;
			}
		}

		#user #name {
			font-weight: 550;
		}

		#user #title {
			font-size: 0.8rem;
			float: right;
			color: var(--light-grey-color);
		}

	}

	#background {
		z-index: -1;
		position: absolute;
		height: 22rem;
		width: 100vw;
		background-color: var(--primary-color);
		background: linear-gradient(145deg, var(--primary-color) 0%, var(--primary-light-color) 100%);
	}

	aside {
		background-color: var(--card-color);

		// Mobile
		@media (max-width: 640px) {
			position: fixed;
			width: calc(100vw - 2em);
			top: calc(100vh - 75px);
			height: 80px;
			margin-left: 1rem;

			display: grid;
			grid-template-columns: repeat(4, 1fr);

			/* shadow */
			box-shadow: 0 0 5px var(--shadow-color);

			// Haal logo, hr, en alles behalve de eerste 4 icoontjes weg
			& > section:nth-child(-n+2), & > section:nth-child(n+7), hr {
				display: none;
			}

			section {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		// Regular screens
		@media (min-width: 640px) {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			#top {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				height: 10rem;
				color: var(--text-color);
			}

			section:not(#top) {
				width: 100%;
				padding-left: 2.5rem;
				padding-right: 2.5rem;
				width: 100%;
			}

			section:last-of-type {
				margin-top: auto;
				margin-bottom: 1rem;
			}

			hr {
				border-top: 1px solid var(--seperator-color);
				width: 80%;
				align-self: center;
				margin-bottom: 1rem;
				border-radius: 5px;
			}
		}
	}


	section {
	
		a {
			display: flex;
			gap: 0.2rem;
			color: var(--text-color);
			padding: 1rem;

			i {
				color: var(--text-color);
			}
		}

		a:hover {
			background: rgb(126, 34, 206);
			background: linear-gradient(145deg, #7e22ce 0%, #8b5cf6 100%);
			border-radius: 5px;
			color: var(--button-text-color);

			i {
				color: var(--button-text-color);
			}
		}
	}


</style>
