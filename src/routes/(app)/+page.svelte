<script lang="ts">
	import knoppers from '$lib/assets/knoppers.png'
	import { onDestroy, onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { daysLeftTill, formatDateHumanReadable, toAge, toBirthday } from '$lib/dateUtils'
	import { imagePreview } from '$lib/imagePreviewStore'
	import { toast } from '$lib/notification'
	import { getPictureUrl, markdown } from '$lib/utils'
	import type { PageData } from './$types'
		let currentDate = new Date();
	export let data: PageData

	/* Cookie clicker */
	const localStorageKey = 'ibs::clicks'
	let isClicking = false

	let totalClicks = data.clicks?._sum?.amount ?? 0
	let sessionClicks = 0

	$: satuationStyle = `filter: saturate(${Math.min(9, Math.max(1, sessionClicks / 100))})`

	let timeout: NodeJS.Timeout | undefined = undefined
	let startTime: number

	let record = data.topclicker?.amount
	let recordHolder = data.topclicker?.firstName
	$: {
		if (totalClicks > record) {
			record = totalClicks
			recordHolder = 'jou'
		}
	}

	async function cookieClick() {
		if (isClicking) {
			if (timeout) clearTimeout(timeout)
		} else {
			isClicking = true
			startTime = Date.now()
		}

		sessionClicks++
		totalClicks++

		timeout = setTimeout(async () => {
			await endSession(startTime, sessionClicks)
		}, 2 * 1000)
	}

	async function endSession(startTime: number, amount: number, endTime?: number) {
		console.log('Posting ' + sessionClicks + ' clicks')
		isClicking = false
		if (timeout) clearTimeout(timeout)
		if (!amount) return

		await fetch('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ startTime, amount, endTime }),
		})
		sessionClicks = 0
	}

	onDestroy(() => {
		if (!browser || !sessionClicks) return
		localStorage.setItem(localStorageKey, JSON.stringify({ startTime, sessionClicks, endTime: Date.now() }))
	})

	onMount(async () => {
		if (!browser) return

		const data = localStorage.getItem(localStorageKey)
		if (!data) return

		const { startTime, sessionClicks, endTime } = JSON.parse(data)
		if (sessionClicks == 0) return
		totalClicks += sessionClicks
		localStorage.removeItem(localStorageKey)
		await endSession(startTime, sessionClicks, endTime)
	})

	function activityImage(resize: boolean) {
		let link = ''

		if (data.activity) {
			if (data.activity.photo) {
				link = getPictureUrl(data.activity.photo, resize ? 'thumbnail' : 'normal')
			} else {
				link = `/image/logo${resize ? '' : '@2'}.png?static=true`
			}
		} else {
			link = `/image/no-activity.jpeg?static=true`
		}

		return link
	}

	function birthdayImage(resize: boolean) {
		let link = ''

		if (data.nextBirthday.profilePicture) {
			link = getPictureUrl(data.nextBirthday.profilePicture, resize ? 'thumbnail' : 'normal')
		} else {
			link = `/image/no-birthday.jpeg?static=true`
		}

		return link
	}

	async function bij() {
		fetch(`/activiteit/${data.activity?.id}/bij`, {
			method: 'POST',
		}).then(async res => {
			if (res.status !== 200) {
				const body = await res.json()
				toast({
					title: 'Oeps!',
					message: body.message,
					type: 'danger',
				})
			} else {
				toast({
					title: 'Gezellig!',
					message: 'Je bent aangemeld voor de activiteit',
					type: 'success',
				})
			}
		})
	}
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
				on:click={() =>
					imagePreview({
						image: activityImage(false),
					})}
				src={activityImage(true)} />
		</div>
		<h2 class="ibs-card--title" data-testid="next-activity-name">
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
				<button class="btn-a" on:click={bij}>Ik ben 🐝</button>
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
		<h2 class="ibs-card--title">Citaat</h2>
		<blockquote class="ibs-card--content">
			<p>{@html markdown(data.quote)}</p>
		</blockquote>
		<div class="mt-6" />
		<div class="ibs-card--links">
			<a href="/citaten">Meer citaten</a>
		</div>
	</div>

	<div class="ibs-card strafbakken">
		<h2 class="ibs-card--title">Strafbakken</h2>
		<div class="ibs-card--content">
			<p>Jij hebt op dit moment</p>
			<h1 data-testid="strafbakken">{data.strafbakken}</h1>
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
			<img style={satuationStyle} id="cookie" role="button" tabindex="0" src={knoppers} alt="knoppers" on:click={cookieClick} />
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
			<img on:click={() => imagePreview({ image: birthdayImage(false) })} src={birthdayImage(true)} alt="⏳" />
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
					Hij is {toAge(birthday)} jaar geworden
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

		.ibs-card.ibs-card.activity {
			.ibs-card--links {
				width: 100%;

				display: flex;
				flex-direction: row;
				justify-content: space-between;

				padding-right: 1rem;
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
				&.cookie-clicker,
				&.birthdays {
					margin-top: 1rem;
				}

				&.cookie-clicker {
					grid-column: unset;
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
