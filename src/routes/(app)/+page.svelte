<script lang="ts">
  import { page } from '$app/stores'
  import { env } from '$env/dynamic/public';
  import knoppers from '$lib/assets/knoppers.png';
	import { onDestroy, onMount } from 'svelte';
	import type { Snapshot } from './$types';

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

  const words = [
    'Weezer', 
    'CaptainSparklez', 
    'Minecraft',
    'Maarten Marcusse',
    'Diederik',
    'Naut',
    'Bier',
    'Invictus',
    'Coldplay',
    'JoyRadio',
    'Kerst',
    'Abstracte Algebra',
    'KB45',
    'http://localhost:5173',
    'marktplaats.nl',
    'kaas.nl',
    'de ultieme kaasbeleving',
    'discord',
    'docker',
    'phpMyAdmin',
    'een emmer van de trap tyfen',
    'de frituurpan',
    'zijn fiets',
    'de vestingbar',
    'kunnen fietsen',
    'een koe',
    'de SmartXP',
    '130 rijden op de vluchtstrook',
    'de mac',
    'de mek',
  ]

  function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  /* Coockie clicker */
  let isClicking = false;

  let totalClicks = $page.data.clicks?._sum?.amount ?? 0;
  let sessionClicks = 0;

  $: satuationStyle = `filter: saturate(${Math.min(9, Math.max(1, sessionClicks / 100))})`

  let timeouts: NodeJS.Timeout[] = []
  let startTime: number;

  let record = $page.data.topclicker?.amount;
  let recordHolder = $page.data.topclicker?.firstName
  $: {
    if (totalClicks > record) {
      record = totalClicks;
      recordHolder = 'jou'
    }
  }

  async function coockieClick() {
    if (isClicking) {
      timeouts.forEach(clearTimeout);
    } else {
      isClicking = true;
      startTime = Date.now();
    }

    sessionClicks++;
    totalClicks++;

    const timeout = setTimeout(async() => {
      await endSession(startTime, sessionClicks)
    }, 5 * 1000);
    timeouts.push(timeout);
  }

  async function endSession(startTime: number, amount: number, endTime?: number) {
    isClicking = false;
    await fetch("/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({startTime, amount, endTime})
    });
    sessionClicks = 0;
  }

  export const snapshot: Snapshot = {
    capture: () => {
      return {
        startTime, sessionClicks, endTime: Date.now()
      };
    },
    restore: async ({startTime, sessionClicks, endTime}) => {
      totalClicks += sessionClicks;
      await endSession(startTime, sessionClicks, endTime);
    } 
  }
</script>

<h1>{getGreeting()}, {$page.data.user.firstName}!</h1>

<p>Welkom bij Invictus Bier Systeem</p>

<hr />

<div id="quote">
  <blockquote>"Ik ben toch wel zat ... ik zag dit toch wel aan voor Weezer" - Naut <i>over {getRandomWord()}</i></blockquote>
</div>

<div id="lid">
  <h1>Lid van de dag!</h1>

  <img src={env.PUBLIC_UPLOAD_URL + '/users/' + $page.data.member?.picture ?? 'diederik_cropped.jpg'} alt="Diederik?">
  <h2>{$page.data.member?.firstName}</h2>
</div>

<div id="coockie-clicker">
  <h1>Coockie clicker</h1>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <img
    style={satuationStyle}
    id="coockie"
    src={knoppers.replace("/@fs", "")}
    alt="knoppers"
    on:click={coockieClick}
  >
  <div id="coockieStats">
    <p>Totaal clicks: {totalClicks}</p>
    <p>Highscore: {record} door {recordHolder}</p>
  </div>
</div>

<style lang="scss">


  hr {
    margin: 2rem 0.5rem;

    @media screen and (max-width: 768px) {
      margin: 1rem 0;
    }
  }

  #quote {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;

    @media screen and (max-width: 768px) {
      margin-top: 1rem;
    }
  }

  #lid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;

    @media screen and (max-width: 768px) {
      margin-top: 0.5rem;
      gap: 0.5rem;
    }
  }

  #lid > img {
    border: 2px solid var(--primary-color);
    border-radius: 100%;
    width: 100%;
    max-width: 500px;

    @media screen and (max-width: 768px) {
      margin-top: 1rem;
      max-width: 65vw;
    }
  }

  #coockie-clicker {
    display: flex;
    margin: 3rem 0;
    align-items: center;
    flex-direction: column;

    #coockie {
      width: 20rem;
      cursor: pointer;
    }

    #coockieStats {
      text-align: center;
    }
  }
</style>