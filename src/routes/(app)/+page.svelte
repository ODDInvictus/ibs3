<script lang="ts">
	import knoppers from '$lib/assets/knoppers.png';
	import { daysLeftTill, formatDateHumanReadable, toAge, toBirthday } from '$lib/dateUtils';
	import { markdown } from '$lib/utils';
	import type { PageData } from './$types';
	import type { Snapshot } from './$types';

	export let data: PageData;

	/* Cookie clicker */
	let isClicking = false;

	let totalClicks = data.clicks?._sum?.amount ?? 0;
	let sessionClicks = 0;

	$: satuationStyle = `filter: saturate(${Math.min(9, Math.max(1, sessionClicks / 100))})`;

	let timeouts: NodeJS.Timeout[] = [];
	let startTime: number;

	let record = data.topclicker?.amount;
	let recordHolder = data.topclicker?.firstName;
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

<h1>{data.greeting}</h1>

<p>Welkom bij Invictus Bier Systeem</p>

<hr />

<div class="main">
	<div class="ibs-card activity">
		<div class="ibs-card--image">
			<img
				alt={data.activity?.name ?? 'Geen activiteit gepland'}
				src={data.activity
					? `/image/activities/${data.activity?.image}?size=750x375`
					: '/image/no-activity.jpeg?size=750x375&static=true'}
			/>
		</div>
		<h2 class="ibs-card--title">
			{@html markdown(data.activity?.name ?? 'Niks!')}
		</h2>
		{#if data.activity}
			<div class="ibs-card--content">
				<time datetime={formatDateHumanReadable(data.activity.startTime ?? new Date())}>
					{formatDateHumanReadable(data.activity.startTime)}
				</time>
			</div>
			<div class="mt-4" />
			<div class="ibs-card--links">
				<a href="/activiteit/{data.activity.id}">Meer informatie</a>
			</div>
		{:else}
			<div class="ibs-card--content">
				<p>Er is geen activiteit gepland</p>
			</div>
			<div class="ibs-card--links">
				<a href="/activiteit/nieuw">Plan er een!</a>
			</div>
		{/if}
	</div>

	<div class="ibs-card quote">
		<h2 class="ibs-card--title">Quote</h2>
		<blockquote class="ibs-card--content">
			<p>{@html markdown(data.quote)}</p>
		</blockquote>
		<div class="mt-6" />
		<div class="ibs-card--links">
			<a href="/quotes">Meer quotes</a>
		</div>
	</div>

	<div class="ibs-card strafbakken">
		<h2 class="ibs-card--title">Strafbakken</h2>
		<div class="ibs-card--content">
			<p>Jij hebt op dit moment</p>
			<h1>{data.strafbakken}</h1>
			<p>strafbakken!</p>
		</div>
		<div class="mt-6" />
		<div class="ibs-card--links">
			<a href="/strafbakken/{data.user.ldapId}">Waarom?</a>
		</div>
	</div>

	<div class="ibs-card cookie-clicker">
		<h2 class="ibs-card--title">Knoppers klikker</h2>
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

	<div class="ibs-card birthdays">
		<div class="ibs-card--image">
			<img src="/image/users/{data.nextBirthday?.picture}?size=750x375" alt="⏳" />
		</div>
		{#if daysLeftTill(data.nextBirthday.birthDate) > 0}
			{@const birthday = data.nextBirthday.birthDate}
			<h2 class="ibs-card--title">Volgende jarige: {data.nextBirthday?.firstName}</h2>
			<div class="ibs-card--content">
				<p>
					Hij is jarig op {toBirthday(birthday)} en wordt dan {toAge(birthday) + 1} jaar!
				</p>
				<p>Dat is over {daysLeftTill(birthday)} dagen.</p>
			</div>
		{:else}
			{@const birthday = data.nextBirthday.birthDate}
			<h2 class="ibs-card--title">🎉 {data.nextBirthday.firstName} is jarig! 🎉</h2>
			<div class="ibs-card--content">
				<p>Gefeliciteerd {data.nextBirthday.firstName}!</p>
				<p>
					Hij is {toAge(birthday) + 1} jaar geworden
				</p>
			</div>
		{/if}
		<div class="ibs-card--links">
			<a href="/verjaardagen">Wie zijn er nog meer binnenkort jarig?</a>
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

		.ibs-card.activity,
		.ibs-card.birthdays {
			.ibs-card--content {
				padding: 0 1rem;
				padding-bottom: 1rem;
			}

			& p:last-of-type {
				margin-bottom: 1.5rem;
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
