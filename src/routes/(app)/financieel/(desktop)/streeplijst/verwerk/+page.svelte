<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores'

  onMount(() => {
    console.log('OnMount')
    console.log('pageData', $page.data)
  })
</script>


<div id="root">
  <h1>Verwerk een streeplijst</h1>
  
  <code>
    {JSON.stringify($page, null, 2)}
  </code>
</div>

<style lang="scss">
  #root {
    display: block;
  }

</style>