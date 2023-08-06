<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import knoppers from '$lib/assets/knoppers.png';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';

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
		'de mek'
	];

	function getRandomWord() {
		return words[Math.floor(Math.random() * words.length)];
	}

	/* Cookie clicker */
	const localStorageKey = 'ibs::clicks';
	let isClicking = false;

	let totalClicks = $page.data.clicks?._sum?.amount ?? 0;
	let sessionClicks = 0;

	$: satuationStyle = `filter: saturate(${Math.min(9, Math.max(1, sessionClicks / 100))})`;

	let timeout: NodeJS.Timeout | undefined = undefined;
	let startTime: number;

	let record = $page.data.topclicker?.amount;
	let recordHolder = $page.data.topclicker?.firstName;
	$: {
		if (totalClicks > record) {
			record = totalClicks;
			recordHolder = 'jou';
		}
	}

	async function cookieClick() {
		if (isClicking) {
			if (timeout) clearTimeout(timeout);
		} else {
			isClicking = true;
			startTime = Date.now();
		}

		sessionClicks++;
		totalClicks++;

		timeout = setTimeout(async () => {
			await endSession(startTime, sessionClicks);
		}, 2 * 1000);
	}

	async function endSession(startTime: number, amount: number, endTime?: number) {
		console.log('Posting ' + sessionClicks + ' clicks');
		isClicking = false;
		if (timeout) clearTimeout(timeout);
		if (amount) return;

		await fetch('/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ startTime, amount, endTime })
		});
		sessionClicks = 0;
	}

	onDestroy(() => {
		if (!browser || !sessionClicks) return;
		localStorage.setItem(
			localStorageKey,
			JSON.stringify({ startTime, sessionClicks, endTime: Date.now() })
		);
	});

	onMount(async () => {
		if (!browser) return;

		const data = localStorage.getItem(localStorageKey);
		if (!data) return;

		const { startTime, sessionClicks, endTime } = JSON.parse(data);
		if (sessionClicks == 0) return;
		totalClicks += sessionClicks;
		localStorage.removeItem(localStorageKey);
		await endSession(startTime, sessionClicks, endTime);
	});
</script>

<svelte:head>
	<title>Invictus Bier Systeem</title>
</svelte:head>

<h1>{getGreeting()}, {$page.data.user.firstName}!</h1>

<p>Welkom bij Invictus Bier Systeem</p>

<hr />

<div id="quote">
	<blockquote>
		"Ik ben toch wel zat ... ik zag dit toch wel aan voor Weezer" - Naut <i
			>over {getRandomWord()}</i
		>
	</blockquote>
</div>

<div id="lid">
	<h1>Lid van de dag!</h1>

	<img
		src={env.PUBLIC_UPLOAD_URL + '/users/' + $page.data.member?.picture ?? 'diederik_cropped.jpg'}
		alt="Diederik?"
	/>
	<h2>{$page.data.member?.firstName}</h2>
</div>

<div id="cookie-clicker">
	<h1>Knoppers klikker</h1>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<img style={satuationStyle} id="cookie" src={knoppers} alt="knoppers" on:click={cookieClick} />
	<div id="cookieStats">
		<p>Totaal clicks: {totalClicks}</p>
		{#if record && recordHolder}
			<p>Highscore: {record} door {recordHolder}</p>
		{/if}
		<a href="/knoppers">Meer informatie</a>
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

	#cookie-clicker {
		display: flex;
		margin: 3rem 0;
		align-items: center;
		flex-direction: column;

		#cookie {
			width: 20rem;
			cursor: pointer;
			-webkit-tap-highlight-color: transparent;
		}

		#cookieStats {
			text-align: center;

			a {
				color: var(--primary-color);
			}
		}
	}
</style>
