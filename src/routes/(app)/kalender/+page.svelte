<script lang="ts">
  import { page } from '$app/stores'
  import { env } from '$env/dynamic/public';

  console.log($page.data.activities)
</script>


<div id="top">
  <h1>Kalender</h1>
  <a href="/activiteit/nieuw">Activiteit aanmaken</a>  
</div>

<hr />

<div id="activities">
{#each $page.data.activities as activity}
  <div class="row">
    <img src={env.PUBLIC_UPLOAD_URL + 'activities/' + activity.image} alt="Geen plaatje geupload :(" />
    <div class="info">
      <h2>{activity.name}</h2>
      <p>{activity.description}</p>
      <a href="/activiteit/{activity.id}">Meer informatie</a>
    </div>
  </div>
  <hr />
{/each}
</div>


<style lang="scss">
  $border-radius: 10px;
  $card-height: 250px;

  #activities {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: 0 40px;
  }
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: $card-height;

    border-radius: $border-radius;
    border: 1px solid var(--seperator-color);

    img {
      height: $card-height;
      object-fit: cover;
      margin-right: 20px;
      border-top-left-radius: $border-radius;
      border-bottom-left-radius: $border-radius;
    }

    .info {
      display: grid;
      grid-template-rows: 1fr 2fr;
      padding: 1rem;

      a {
        color: var(--primary-color);
      }
    }
  }

  #top {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
   
    h1 {
      text-align: center;
    }
  }

  hr {
    margin: var(--hr-margin);
  }
</style>