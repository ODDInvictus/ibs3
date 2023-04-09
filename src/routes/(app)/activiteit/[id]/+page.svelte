<script lang="ts">
  import { page } from '$app/stores'
  import { env } from '$env/dynamic/public';
  import MapPin from '~icons/tabler/map-pin'
  import Clock from '~icons/tabler/clock'
  import Calendar from '~icons/tabler/calendar'
  import UsersGroup from '~icons/tabler/users-group'
  import ExternalLink from '~icons/tabler/external-link'
	import { getSlug } from '$lib/textUtils';

  const activity = $page.data.activity

  function formatTime(time: string) {
    const date = new Date(time)
    return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
  }

  function formatDate(time: string) {
    const date = new Date(time)
    return date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }
</script>

<div>
  <h1>{activity.name}</h1>

  <hr />

  <div class="cols">
    <div id="left" class="col">
      {#if activity.image == null}
        <p>Geen plaatje geupload :(</p>
      {:else}
        <img src={env.PUBLIC_UPLOAD_URL + 'activities/' + activity.image} alt="Geen plaatje geupload :(" />
      {/if}

      <h2>{activity.name}</h2>

      <hr />

      <div class="row">
        <UsersGroup />
        <p>
          Georganiseerd door: 
          <a href="/commissie/{activity.organisedBy.ldapId}">{activity.organisedBy.name}</a>
        </p>
      </div>

      <hr />

      <div class="row">
        <MapPin /> 
        <p>
          <a href="/locatie/{getSlug(activity.location.name)}">{activity.location.name}</a>
        </p>
      </div>

      <hr />

      <div class="row">
        <Calendar />
        <p>{formatDate(activity.startTime)}</p>
      </div>

      <hr />

      <div class="row">
        <Clock />
        <p>{formatTime(activity.startTime)} - {formatTime(activity.endTime)}</p>
      </div>
      
      {#if activity.url}
      <hr />

      <div class="row">
        <ExternalLink />
        <p>
          <a href="{activity.url}">Meer informatie</a>
        </p>
      </div>
      {/if}

      <hr />

      <div id="description">
        <p>{activity.description}</p>
      </div>
    </div>

    <div id="right" class="col">
      <h2>Wie komen er allemaal?</h2>
    </div>
  </div>
</div>

<style lang="scss">
  $border-radius: 10px;
  $gap: 0.5rem;
  $gap-side: 2rem;

  .cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 0 $gap-side;
  }

  .col {
    display: flex;
    flex-direction: column;
    justify-content: center;

    margin: $gap;

    border: 1px solid var(--seperator-color);
    border-radius: $border-radius;
  }

  #left {
    align-items: flex-start;

    h2, p, .row {
      padding-left: 1rem;
    }

    a {
      color: var(--primary-color);
    }

    h2 {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }

    .row {
      display: flex;
      align-items: center;
      padding-bottom: 0.25rem;
      padding-top: 0.25rem;
    }

    #description {
      padding: 0.25rem;
    }

    img {
      width: 100%;
      object-fit: cover;
      max-height: 200px;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
    }

    hr {
      width: 100%;
      margin: 0.2rem;
    }
  }

  #right {
    align-items: center;
  }

  h1 {
    text-align: center;
  }

  hr {
    margin: var(--hr-margin);
  }
</style>

