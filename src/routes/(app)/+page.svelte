<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import knoppers from '$lib/assets/knoppers.png';
	import { formatDateHumanReadable } from '$lib/textUtils';
	import { formatDate, markdown } from '$lib/utils';
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

<div class="main">
	<div class="ibs-card activity">
		<div class="ibs-card--image">
			<img
				alt={$page.data.activity.name}
				src={env.PUBLIC_UPLOAD_URL +
					'activities/' +
					($page.data.activity.image ?? 'activiteit-0-logo.png')}
			/>
		</div>
		<h2 class="ibs-card--title">
			{@html markdown($page.data.activity.name)}
		</h2>
		<div class="ibs-card--content">
			<time datetime={$page.data.activity.startTime}>
				{formatDateHumanReadable($page.data.activity.startTime)}
			</time>
		</div>
		<div class="mt-4" />
		<div class="ibs-card--links">
			<a href="/activiteit/{$page.data.activity.id}">Meer informatie</a>
		</div>
	</div>

	<div class="ibs-card quote">
		<h2 class="ibs-card--title">Quote</h2>
		<blockquote class="ibs-card--content">
			<p>{@html markdown($page.data.quote)}</p>
		</blockquote>
		<div class="ibs-card--links">
			<a href="/quotes">Meer quotes</a>
		</div>
	</div>

	<div class="ibs-card strafbakken">
		<h2 class="ibs-card--title">Strafbakken</h2>
		<div class="ibs-card--content">
			<p>Jij hebt op dit moment</p>
			<h1>{$page.data.strafbakken}</h1>
			<p>strafbakken!</p>
		</div>
		<div class="ibs-card--links">
			<a href="/strafbakken/{$page.data.user.ldapId}">Waarom?</a>
		</div>
	</div>

	<div class="ibs-card cookie-clicker">
		<h2 class="ibs-card--title">Knoppers klikker</h2>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="ibs-card--content">
			<img
				style={satuationStyle}
				id="cookie"
				role="button"
				tabindex="0"
				src={knoppers}
				alt="knoppers"
				on:click={cookieClick}
			/>
			<div id="cookieStats">
				<p>Totaal clicks: {totalClicks}</p>
				{#if record && recordHolder}
					<p>Highscore: {record} door {recordHolder}</p>
				{/if}
				<a href="/knoppers">Meer informatie</a>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	hr {
		margin: 1rem 0.5rem 2rem 0.5rem;

		@media (max-width: 600px) {
			margin: 1rem 0;
		}
	}

	.main {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 1rem;

		.ibs-card {
			border-radius: 0.5rem;
			background-color: var(--color-card);
			box-shadow: 0 0 0.5rem var(--color-box-shadow);
		}

		.ibs-card.strafbakken {
			.ibs-card--content {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
			}

			h1 {
				font-size: 5rem;
				margin: 0;
			}
		}

		.ibs-card.activity {
			.ibs-card--content {
				padding: 0 1rem;
				padding-bottom: 1rem;
			}

			time {
				display: block;
				margin-bottom: 0.5rem;
			}
		}

		.ibs-card.cookie-clicker {
			grid-column: span 2;

			.ibs-card--content {
				display: flex;
				align-items: center;
				flex-direction: column;
			}

			#cookie {
				width: 20rem;
				cursor: pointer;
				-webkit-tap-highlight-color: transparent;
			}

			#cookieStats {
				text-align: center;
			}
		}

		@media (max-width: 600px) {
			grid-template-columns: 1fr;
			grid-gap: 0;

			.ibs-card {
				width: calc(100vw - 2rem);

				&.quote,
				&.strafbakken,
				&.cookie-clicker {
					margin-top: 1rem;
				}

				&.cookie-clicker {
					grid-column: span 1;
				}

				&.activity {
					.ibs-card--title::before {
						content: '🗓️ ';
					}
				}
			}
		}

		@media (min-width: 600px) {
			.ibs-card.activity {
				.ibs-card--title::before {
					content: 'Volgende activiteit: ';
				}
			}
		}
	}
</style>
