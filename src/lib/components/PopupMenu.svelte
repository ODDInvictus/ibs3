<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';

  export let showMenu: boolean = false

  function logOut() {
    signOut()
  }
</script>

{#if showMenu}
<div class="menu">
    <div id="pointer" />

    <a class="menu-item" href="/profiel">Profiel</a>
    <a class="menu-item" href="/streeplijst/persoonlijk">Mijn streeplijst</a>
    <a class="menu-item" href="/instellingen">Instellingen</a>

    <hr />

    <button class="menu-item" on:click={() => logOut()}>Uitloggen</button>
</div>
{/if}


<style>
  .menu {
    position: absolute;
    margin-top: 14rem;
    z-index: 1;
    background-color: white;
    color: black;
    border-radius: 5px;
    box-shadow: 0 0 50px 0 rgba(0, 0, 0, 0.2);
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
    border-top: 1px solid #d1d5db;
    border-radius: 5px;
  }

  .menu-item {
    padding-bottom: 0.2rem;
    padding-top: 0.2rem;
    width: 100%;
    height: 100%;
  }

  .menu-item:hover {
    background-color: #f3f4f6;
  }

  #pointer {
    position: absolute;
    width: 0;
    height: 0;
    box-shadow: 0 0 50px 0 rgba(0, 0, 0, 0.2);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid white;
    margin-top: -1rem;
    margin-left: 6rem;
  }
</style>