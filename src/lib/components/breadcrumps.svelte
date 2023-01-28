<script lang="ts">
  import { page } from '$app/stores'
  import { ChevronRight } from 'svelte-heros-v2'

  let crumbs: any[] = []

  $: {
    let path = $page.url.pathname
    // Remove zero-length tokens.
    const tokens = path.split('/').filter((t) => t !== '')

    // Create { label, href } pairs for each token.
    let tokenPath = ''
    crumbs = tokens.map((t) => {
        tokenPath += '/' + t
        return {
            label: t,
            href: tokenPath,
        };
    });

    // Add a way to get home too.
    crumbs.unshift({ label: 'home', href: '/' })
  }
</script>

<nav>
  {#each crumbs as c, i}
    {#if i == crumbs.length-1}
        <span>{c.label}</span>
    {:else}
        <a href={c.href}>
          <span>{c.label}</span>
        </a>
        <i><ChevronRight width="1.2em" height="1.2em"/></i>
    {/if}
  {/each}
</nav>


<style>
  nav {
    color: white;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.3rem;
  }

  span, i {
    display: inline-block;
  }

  i {
    padding-top: 0.20rem;
  }

  span::first-letter {
    text-transform: capitalize;
  }
</style>