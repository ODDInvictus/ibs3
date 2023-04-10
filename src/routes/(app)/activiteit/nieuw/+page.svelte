<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
  import { page } from '$app/stores';
	import type { ActionData } from './$types';
  import { onMount } from 'svelte';
  import InfoCircle from '~icons/tabler/info-circle'

  function setEndDate() {
    const startDate = document.getElementById('startDate') as HTMLInputElement;
    const endDate = document.getElementById('endDate') as HTMLInputElement;
    
    if (!endDate.value || endDate.value < startDate.value) endDate.value = startDate.value;
  }

  function handleErrors() {
    if (form?.errors) {
      for (const error of form.errors) {
        const element = document.getElementById('' + error.field) as HTMLInputElement
        element.classList.add('activity-create-error')
      }

      // Scroll to top
      window.scrollTo(0, 0)
    }
  }

  export let form: ActionData;
</script>

<h1>Nieuwe activiteit aanmaken</h1>

<hr />

{#if form?.error}
  <ul class="errors">
    {#if form?.message}
      <li>
        <div>
          <InfoCircle />
        </div>
        <span>{form?.message}</span>
      </li>
    {:else if form?.errors}
      {#each form?.errors as error}
        <li>
          <div>
            <InfoCircle />
          </div>
          <span>{error.message}</span>
        </li>
      {/each}
    {/if}
  </ul>
{/if}

<form method="POST" enctype="multipart/form-data" use:enhance={({ data }) => { 
  return async ({ result }) => {
    await applyAction(result)
    handleErrors()
  }
}}>
  <label for="name">Naam</label>
  <input type="text" name="name" id="name" />

  <label for="description">Beschrijving</label>
  <textarea name="description" id="description"></textarea>

  <label for="startDate">Begin datum</label>
  <input type="date" name="startDate" id="startDate" on:change={setEndDate}/>

  <label for="startTime">Begin tijd</label>
  <input type="time" name="startTime" id="startTime"/>

  <label for="endDate">Eind datum</label>
  <input type="date" name="endDate" id="endDate"/>

  <label for="endTime">Eind tijd</label>
  <input type="time" name="endTime" id="endTime"/>

  <label for="location">Locatie <span>(optioneel)</span></label>
  <select name="location" id="location" value={0}>
    <option value={0}>Nog niet bekend</option>
    {#each $page.data.locations as location}
      <option value={location.id}>{location.name}</option>
    {/each}
  </select>

  <label for="organisedBy">Georganiseerd door</label>
  <select name="organisedBy" id="organisedBy">
    <option value={0}>Selecteer een commissie!</option>
    {#each $page.data.committees as committee}
      <option value={committee.id}>{committee.name}</option>
    {/each}
  </select>

  <label for="url">Website voor meer informatie <span>(optioneel)</span></label>
  <input type="url" name="url" id="url" placeholder="URL"/>

  <label for="image">Afbeelding <span>(optioneel)</span></label>
  <input type="file" name="image" id="image" />

  <label for="membersOnly">Alleen voor leden</label>
  <input type="checkbox" name="membersOnly" id="membersOnly" />

  <button type="submit">Opslaan</button>
</form>

<style lang="scss">
  :global(.activity-create-error, .activity-create-error:active, .activity-create-error:focus) {
    border: 1px solid red !important;
  }

  .errors {
    color: black;

    li {
      border: 1px solid rgb(239 68 68);
      background-color: rgb(254 226 226);
      border-radius: 10px;
      margin-bottom: 0.5rem;

      display: grid;
      grid-template-columns: 1.4em 1fr;

      div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 0.2em;
      }

      span {
        margin-left: 0.5em;
        margin-top: 0.2em;
        margin-bottom: 0.2em;
      }
    }
  }

  form {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 1rem;

    label {
      font-weight: 600;
      padding-top: 0.4rem;
    }

    label + input, label + textarea, label + select {
      padding-bottom: 1rem;
    }

    label > span {
      font-weight: 400;
      font-size: 0.8rem;
      color: #666;
    }

    button {
      margin-bottom: 1rem;
    }

    @media screen and (max-width: 600px) {
      grid-template-columns: 1fr;
    
      label + input, label + textarea, label + select {
        margin-bottom: 0;
      }

    }

    input:not([type="file"]), textarea {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      outline: none;
    }

    input[type="file"] {
      outline: none;
      cursor: pointer;
    }
  }

  h1 {
    text-align: center;
  }

  hr {
    margin: 0.5rem 0;
  }
</style>