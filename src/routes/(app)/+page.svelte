<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import knoppers from '$lib/assets/knoppers.png';
	import { toast } from '$lib/notification';
	import type { Snapshot } from './$types';

	/* Cookie clicker */
	let isClicking = false;

	let totalClicks = $page.data.clicks?._sum?.amount ?? 0;
	let sessionClicks = 0;

	$: satuationStyle = `filter: saturate(${Math.min(9, Math.max(1, sessionClicks / 100))})`;

	let timeouts: NodeJS.Timeout[] = [];
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
			timeouts.forEach(clearTimeout);
		} else {
			isClicking = true;
			startTime = Date.now();
		}

		sessionClicks++;
		totalClicks++;

		const timeout = setTimeout(async () => {
			await endSession(startTime, sessionClicks);
		}, 5 * 1000);
		timeouts.push(timeout);
	}

	async function endSession(startTime: number, amount: number, endTime?: number) {
		isClicking = false;
		await fetch('/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ startTime, amount, endTime })
		});
		sessionClicks = 0;
	}

	export const snapshot: Snapshot = {
		capture: () => {
			return {
				startTime,
				sessionClicks,
				endTime: Date.now()
			};
		},
		restore: async ({ startTime, sessionClicks, endTime }) => {
			if (!sessionClicks) return;
			totalClicks += sessionClicks;
			await endSession(startTime, sessionClicks, endTime);
		}
	};
</script>

<svelte:head>
	<title>Invictus Bier Systeem</title>
</svelte:head>

<h1>{$page.data.greeting}</h1>

<p>Welkom bij Invictus Bier Systeem</p>

<hr />

<div id="quote">
	<blockquote>
		"Ik ben toch wel zat ... ik zag dit toch wel aan voor Weezer" - Naut <i
			>over {$page.data.nautWord}</i
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
		}
	}
</style>
