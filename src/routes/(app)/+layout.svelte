<script lang="ts">
  import Logo from '$lib/components/Logo.svelte'
  import { clickOutside } from '$lib/events/clickOutside';
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { CalendarDays, Cake, Users, Folder, Cog6Tooth, InformationCircle, FaceFrown } from 'svelte-heros-v2'
  import PopupMenu from '$lib/components/PopupMenu.svelte'
	import Breadcrumps from '$lib/components/Breadcrumps.svelte'
	import { onMount } from 'svelte';
  import { LDAP_IDS } from '$lib/constants';
	import type { Committee } from '@prisma/client';
  import { PUBLIC_VERSION } from '$env/static/public';

  let showMenu: boolean = false

  function toggleMenu() {
    showMenu = !showMenu
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

<div id="layout">

  <div id="background"/>

  <aside>
    <section id="top">
      <button on:click={() => goto('/')}>
        <Logo />
      </button> 
      <p>Invictus Bier Systeem</p>
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
        <span>IBS v{PUBLIC_VERSION}</span>
      </a>
    </section>

  </aside>

  <div id="content">
    <header>
      <Breadcrumps />

      <button id="user" on:click={toggleMenu} use:clickOutside on:click_outside={closeMenu}>
        <div id="user-card">
          <p id="name">{$page.data.user.firstName + ' ' + $page.data.user.lastName ?? 'Gebruiker'}</p>
          <p id="title">{bestCommittee}</p>
        </div>
        <!-- <button>Log uit</button> -->
        <img src="https://avatars.githubusercontent.com/u/11670885?v=4" alt="user" />

        <PopupMenu {showMenu}/>
      </button>
    </header>

    <main>
      <div>
        <slot />
      </div>
    </main>
  </div>
</div>

<style>
  #layout {
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 100vh;
  }

  main {
    margin-right: 1.5rem;
    margin-left: 0.5rem;
    margin-top: 1rem;

    height: calc(100vh - 6.5rem);
    background-color: #f9fafb;
    border-radius: 5px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

    overflow: scroll;
  }

  main > div {
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-right: 1.5rem;
    padding-left: 1.5rem;
  }

  header {
    height: 4rem;
    width: calc(100vw - 19rem);
    max-width: 100%;
    margin-top: 0.5rem;
    margin-left: 1rem;
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
    margin-top: 0.1rem;
    margin-right: 2rem;
  }

  header > #user #name {
    /* User name */
    font-weight: bold;    
  }

  header > #user #title {
    /* User title */
    font-size: 0.8rem;
    float: right;
    color: #e5e7eb;
  }

  header > #user > img {
    /* User avatar */
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }


  aside {
    background-color: #010a4a;
    width: 16rem;
    margin: 1rem;
    border-radius: 1rem;

    display: flex;
    flex-direction: column;
  }

  #background {
    z-index: -1;
    position: absolute;
    width: 100vw;
    height: 22rem;
    background-color: #7e22ce;
  }

  #top {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 10rem;
    color: white;
  }

  aside > hr {
    margin-left: 10%;
    width: 80%;
    border-top: 1px solid white;
    border-radius: 5px;
  }

  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  aside > section:nth-child(3) {
    margin-top: 0.5rem;
  }

  aside > section:last-child {
    margin-top: auto;
    padding-bottom: 0.5rem;
  }

  section > a {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 80%;
    color: white;    
    margin-left: 1rem;
    margin-right: 1rem;
    padding: 0.8rem;
  }

  section > a:hover {
    background: rgb(126,34,206);
    background: linear-gradient(145deg, rgba(126,34,206,1) 0%, rgba(139,92,246,1) 100%); 
    border-radius: 5px;
  }

  section > a > i {
    color: #c084fc;
  }

  section > a:hover > i {
    color: white;
  }

  section > a span {
    margin-left: 0.5rem;
  }

</style>