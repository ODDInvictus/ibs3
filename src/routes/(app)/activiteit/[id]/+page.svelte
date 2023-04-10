<script lang="ts">
  import { page } from '$app/stores'
  import { env } from '$env/dynamic/public';
  import MapPin from '~icons/tabler/map-pin'
  import Clock from '~icons/tabler/clock'
  import Calendar from '~icons/tabler/calendar'
  import CalendarPlus from '~icons/tabler/calendar-plus'
  import UsersGroup from '~icons/tabler/users-group'
  import ExternalLink from '~icons/tabler/external-link'
  import AccessibleOff from '~icons/tabler/accessible-off'
	import { getSlug } from '$lib/textUtils';
	import UserCard from './UserCard.svelte';
	import { generateICal } from '$lib/utils';

  const activity  = $page.data.activity
  let attending   = $page.data.attending
  
  $: bij    = attending.filter(a => a.isAttending).map(a => a.user)
  $: notBij = attending.filter(a => !a.isAttending).map(a => a.user)

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

  async function setAttending(status: boolean) {
    // First check if the user is attending
    const a = attending.find(a => a.user.ldapId == $page.data.user.ldapId)

    if (a.isAttending === status) {
      // The user is already attending/not attending, so do nothing
      return
    }

    // Send a request to the server to update the attending status
    await fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status,
        activityId: activity.id
      })
    }).catch(err => {
      console.error(err)
      alert(err.message)
    })

    // Update the attending status
    a.isAttending = status
    attending = attending
  }

  function generateIcal() {
    const startTime = new Date(activity.startTime)
    const endTime = new Date(activity.endTime)
    const ical = generateICal({
      title: activity.name,
      eventId: activity.id,
      description: activity.description,
      location: activity.location?.name,
      startTime,
      endTime,
      url: activity.url
    })

    // now let's save the file
    const downloadLink = document.createElement('a')
    downloadLink.href = ical
    downloadLink.download = `ibs-activiteit-${activity.id}.ical`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

</script>

<div>
  <div id="title">
    <h1>{activity.name}</h1>
    <hr />
  </div>


  <div class="cols">
    <div id="left" class="col">
      {#if activity.image == null}
        <img src={env.PUBLIC_UPLOAD_URL + 'activities/logo.png'} alt="Placeholder mist?"/>
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
          {#if activity.location !== null}
            <a href="/locatie/{getSlug(activity.location.name)}">{activity.location.name}</a>
          {:else}
            Nog geen locatie bekend
          {/if}
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

      {#if activity.membersOnly}
      <hr />

      <div class="row">
        <AccessibleOff />
        <p>Alleen voor leden</p>
      </div>
      {/if}

      <hr />

      <div class="row">
        <CalendarPlus />
        <button on:click={generateIcal}>Opslaan in agenda</button>
      </div>

      <hr />

      <div id="description">
        <span>{activity.description}</span>
      </div>
    </div>

    <div id="right" class="col">
      <h2>Wie komen er allemaal?</h2>

      <hr />

      <div id="buttons">
        <button on:click={async () => await setAttending(true)} id="bij-button">Ik ben 🐝!</button>

        <hr />

        <button on:click={async () => await setAttending(false)} id="nietbij-button">Ik ben niet 🐝</button>
      </div>

      <hr />

      <div id="users">
        {#each bij as user}
          <UserCard status="positive" user={user}/>
        {/each}
        {#each notBij as user}
          <UserCard status="negative" user={user}/>
        {/each}
      </div>

    </div>
  </div>
</div>

<style lang="scss">
  $border-radius: 10px;
  $gap: 0.5rem;
  $gap-side: 2rem;

  @media (max-width: 640px) {
    #title {
      display: none;
    }
  }

  .cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: auto;
    margin: 0 $gap-side;


    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      margin: 0;
      gap: $gap;
    }
  }

  .col {
    display: flex;
    flex-direction: column;

    margin: $gap;

    border: 1px solid var(--seperator-color);
    border-radius: $border-radius;

    @media (max-width: 640px) {
      margin: 0;
      margin-bottom: $gap;
      width: 90vw;
    }
  }

  #left {
    justify-content: flex-start;

    h2, p, .row, button {
      padding-left: 1rem;
    }

    a, button {
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
      margin: 0.5rem 1rem;
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

    h2 {
      padding-bottom: 0.5rem;
    }

    hr {
      width: 100%;
      padding: 0;
      margin: 0;
    }

    #users {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 90%;
      margin: $gap auto;

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
        width: 90%;
      }
    }

    #buttons {
      display: grid;
      grid-template-columns: 1fr 1px 1fr;
      width: 100%;

      hr {
        z-index: 1;
        width: 1px;
        padding: 20px 0;
        margin: 0;
        height: 100%;
        background-color: var(--seperator-color);
      }
    }
  }

  h1 {
    text-align: center;
  }

  hr {
    margin: var(--hr-margin);
  }
</style>

