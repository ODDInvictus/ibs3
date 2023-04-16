<script lang="ts">
  import { page } from '$app/stores'
  import { env } from '$env/dynamic/public';

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 6) {
      return 'Goedenacht';
    } else if (hour < 12) {
      return 'Goedemorgen';
    } else if (hour < 18) {
      return 'Goedemiddag';
    } else {
      return 'Goedenavond';
    }
  }
</script>

<h1>{getGreeting()}, {$page.data.user.firstName}!</h1>

<p>Welkom bij Invictus Bier Systeem</p>

<style>

</style>