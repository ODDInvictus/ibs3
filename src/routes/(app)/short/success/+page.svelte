<script lang="ts"> 
  import { page } from '$app/stores'

  const slug = $page.url.searchParams.get('slug')

  const origin = $page.url.hostname
</script>

<h1>Aanmaken gelukt!</h1>

<hr />

<p>Je kan de link vinden op <a href={`https://${origin}/s/${slug}`}>{origin}/s/{slug}</a></p>



<style lang="scss">
  h1 {
    text-align: center;
  }

  hr {
    margin: 0.5rem 0;
  }

  p {
    text-align: center;
  }

  a {
    color: var(--primary-color);
  }
</style>