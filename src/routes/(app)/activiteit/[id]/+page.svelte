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
  const bij      = $page.data.activity.attending.filter(a => a.isAttending).map(a => a.user)
  const notBij   = $page.data.activity.attending.filter(a => !a.isAttending).map(a => a.user)

  function formatTime(time: string) {
    const date = new Date(time)
    return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
  }

  function formatDate(time: string, endTime: string) {
    const date = new Date(time)
    const end = new Date(endTime)

    // If the activity is longer than 12 hours, show the end date
    if (end.getTime() - date.getTime() > 12 * 60 * 60 * 1000) {
      return date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
            + ' - ' + 
            end.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    }

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
        <p>{formatDate(activity.startTime, activity.endTime)}</p>
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

      <hr />

      <div id="users">
        <div id="bij">
          {#if bij && bij.length == 0}
            <p>Nog niemand 😥</p>
          {/if}
          {#each bij as user}
            <div class="row">
              <a href="/lid/{user.ldapId}">{user.firstName + ' ' + user.lastName}</a>
            </div>
          {/each}
        </div>

        <div id="not-bij">
          {#if notBij && notBij.length == 0}
            <p>🥳 Iedereen is bij!</p>
          {/if}
          {#each notBij as user}
            <div class="row">
              <a href="/lid/{user.ldapId}">{user.firstName + ' ' + user.lastName}</a>
            </div>
          {/each}
        </div>
      </div>

      <hr />

      <div id="buttons">
        <button id="bij-button">Ik ben 🐝!</button>
        <button id="nietbij-button">Ik ben niet 🐝</button>
      </div>
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

    margin: $gap;

    border: 1px solid var(--seperator-color);
    border-radius: $border-radius;
  }

  #left {
    align-items: flex-start;
    justify-content: center;

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

    hr {
      width: 100%;
      margin: 0.5rem;
    }

    #users {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;

      div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }

    #bij, #bij-button {
      border-right: 1px solid var(--seperator-color);
    }

    #buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
    }
  }

  h1 {
    text-align: center;
  }

  hr {
    margin: var(--hr-margin);
  }
</style>

