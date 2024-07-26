<script lang="ts">
	import { page } from '$app/stores'
	import MapPin from '~icons/tabler/map-pin'
	import Clock from '~icons/tabler/clock'
	import Calendar from '~icons/tabler/calendar'
	import CalendarPlus from '~icons/tabler/calendar-plus'
	import Edit from '~icons/tabler/edit'
	import UsersGroup from '~icons/tabler/users-group'
	import ExternalLink from '~icons/tabler/external-link'
	import AccessibleOff from '~icons/tabler/accessible-off'
	import UserCard from './_user-card.svelte'
	import { generateICal, getPictureUrl, stripMarkdown } from '$lib/utils'
	import { toast } from '$lib/notification'
	import { markdown } from '$lib/utils'
	import Title from '$lib/components/title.svelte'
	import { imagePreview } from '$lib/imagePreviewStore'
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'
	import ProfileIcon from '$lib/components/profile-icon.svelte'
	import { formatDateTimeHumanReadable } from '$lib/dateUtils'
	import type { AttendingStatus } from '@prisma/client'
	import { promptCheckbox } from '$lib/promptCheckbox'

	export let data: PageData

	const STATUS_ORDER: Record<string, number> = {
		ATTENDING: 1,
		UNSURE: 2,
		NOT_ATTENDING: 3,
		NO_RESPONSE: 4,
	}

	const activity = data.activity
	let attending = sortAttending()
	let changed = 0

	const nameWithoutMarkdown = stripMarkdown(activity.name)

	$: if (changed > 0) {
		console.log('huts')
		attending = sortAttending()
	}

	function sortAttending() {
		return data.attending.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
	}

	function formatTime(time: Date) {
		return time.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
	}

	function formatDate(time: Date, endTime: Date) {
		const date = time
		const end = endTime

		// If the activity is longer than 12 hours, show the end date
		if (end.getTime() - date.getTime() > 12 * 60 * 60 * 1000) {
			return (
				date.toLocaleDateString('nl-NL', {
					weekday: 'long',
					day: 'numeric',
					month: 'long',
					year: 'numeric',
				}) +
				' - ' +
				end.toLocaleDateString('nl-NL', {
					weekday: 'long',
					day: 'numeric',
					month: 'long',
					year: 'numeric',
				})
			)
		}

		return date.toLocaleDateString('nl-NL', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		})
	}

	async function setAttending(status: string, ldapId: string) {
		// First check if the user is attending
		const a = attending.find((a: any) => a.user.ldapId == ldapId)

		// If a is undefined, then continue, since the backend will make it
		if (a && a.status === status) {
			// The user is already attending/not attending, so do nothing
			return
		}

		const isUser = data.user.ldapId === ldapId

		// Send a request to the server to update the attending status
		await fetch('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				status,
				ldapId,
				activityId: activity.id,
			}),
		})
			.then(async res => {
				let title, message
				let type: 'info' | 'success' | 'warning' | 'error' = 'info'

				if (!res.ok) {
					const body = await res.json()
					toast({
						title: 'Oeps',
						message: body.message,
						type: 'danger',
					})
					return
				}

				if (status === 'ATTENDING') {
					title = 'Gezellig!'
					message = isUser ? 'Je aanwezigheid is opgeslagen' : 'De aanwezigheid is opgeslagen'
					type = 'success'
				} else if (status === 'NOT_ATTENDING') {
					title = 'Jammer!'
					message = isUser ? 'Je afwezigheid is opgeslagen' : 'De afwezigheid is opgeslagen'
				} else {
					title = 'Opgeslagen'
					message = 'Vul je het later nog in?'
				}

				toast({
					title,
					message,
					type,
				})

				// Update the attending status
				if (!a) {
					location.reload()
					return
				}

				a.status = status
				changed++
				sortAttending()
			})
			.catch(err => {
				toast({
					title: 'Oei!',
					message: 'Er ging iets mis bij het opslaan van je aanwezigheid',
					type: 'danger',
				})
				console.error(err)
			})
	}

	function generateIcal() {
		const startTime = new Date(activity.startTime)
		const endTime = new Date(activity.endTime)
		const ical = generateICal({
			title: activity.name,
			eventId: activity.id.toString(),
			description: activity.description,
			location: activity.location?.name,
			startTime,
			endTime,
			url: window.location.href,
		})

		// now let's save the file
		const downloadLink = document.createElement('a')
		downloadLink.href = ical
		downloadLink.download = `ibs-activiteit-${activity.id}.ical`
		document.body.appendChild(downloadLink)
		downloadLink.click()
		document.body.removeChild(downloadLink)
	}

	function generateGCal() {
		const activityUrl = $page.data.domain + '/activiteit/' + activity.id
		let details = activity.description
		details += `<br/><br/>Ben jij ook bij? <a href="${activityUrl}">Klik dan hier!</a>`
		if (activity.url) details += `<br /><br/> Meer informatie <a href="${activity.url}">hier</a>`

		const start = new Date(activity.startTime).toISOString().replace(/-|:|\.\d\d\d/g, '')
		const end = new Date(activity.endTime).toISOString().replace(/-|:|\.\d\d\d/g, '')

		const dates = `${start}/${end}`

		const uri = new URL('https://calendar.google.com/calendar/render')
		const search = new URLSearchParams({
			text: nameWithoutMarkdown,
			action: 'TEMPLATE',
			ctz: 'Europe/Amsterdam',
			details: stripMarkdown(details),
			location: activity.location?.name ?? 'Locatie nog onbekend',
			sprop: `name:{{Invictus Bier Systeem}},website:${activityUrl}`,
			add: attending
				.filter(a => a.status === 'ATTENDING')
				.map((a: any) => a.email)
				.join(','),
			dates,
		})

		uri.search = search.toString()

		window.open(uri.toString())
	}

	function cardAction(ldapId: string, status: AttendingStatus) {
		console.log(ldapId, status)

		if (data.canEditAttending) {
			promptCheckbox({
				title: 'Status wijzigen',
				message: 'Is deze persoon aanwezig bij deze activiteit?',
				value: status === 'ATTENDING',
				cb: async value => {
					if (value === (status === 'ATTENDING')) return

					await setAttending(value ? 'ATTENDING' : 'NOT_ATTENDING', ldapId)
				},
			})
		} else {
			window.location.href = '/leden/' + ldapId
		}
	}
</script>

<div>
	<div class="title">
		<Title markdown title={activity.name} shortTitle={activity.name} />
	</div>

	<div class="cols">
		<div class="ibs-card outline">
			<div class="ibs-card--image">
				<img
					on:click={() => {
						if (activity.photo) {
							imagePreview({
								image: getPictureUrl(activity.photo, 'normal'),
							})
						}
					}}
					alt={nameWithoutMarkdown}
					src={getPictureUrl(activity.photo, 'normal')}
					onerror="this.src='/image/favicon-512.png?static=true';this.onerror=null;" />
			</div>

			<h2 class="ibs-card--title">{@html markdown(activity.name)}</h2>

			<p class="ibs-card--row">
				<i><UsersGroup /></i>
				Georganiseerd door:
				<a href="/leden/commissie/{activity.organisedBy.ldapId}">{activity.organisedBy.name}</a>
			</p>

			<p class="ibs-card--row">
				<i><MapPin /></i>
				{#if activity.location !== null}
					<a href="/locatie/{activity.location.id}">{activity.location.name}</a>
				{:else}
					Nog geen locatie bekend
				{/if}
			</p>

			<p class="ibs-card--row">
				<i><Calendar /></i>
				{formatDate(activity.startTime, activity.endTime)}
			</p>
			<p class="ibs-card--row">
				<i><Clock /></i>
				{formatTime(activity.startTime)} - {formatTime(activity.endTime)}
			</p>

			{#if activity.url}
				<p class="ibs-card--row">
					<i><ExternalLink /></i>
					<a href={activity.url} target="_blank">Meer informatie</a>
				</p>
			{/if}

			{#if activity.membersOnly}
				<p class="ibs-card--row">
					<i><AccessibleOff /></i>
					Alleen voor leden
				</p>
			{/if}

			<p class="ibs-card--row">
				<i><Edit /></i>
				<a href="/activiteit/nieuw?edit=true&id={activity.id}">Activiteit bewerken</a>
			</p>

			<p class="ibs-card--row">
				<i><CalendarPlus /></i>
				Opslaan als
				<button class="btn-a" on:click={generateIcal}>ical</button>
				of in
				<button class="btn-a" on:click={generateGCal}>google agenda</button>
			</p>

			<p class="ibs-card--content">
				{@html markdown(activity.description)}
			</p>
		</div>

		<div class="ibs-card outline" id="right">
			<h2 class="ibs-card--title">Wie komen er allemaal?</h2>

			<div class="ibs-card--buttons top">
				<button on:click={async () => await setAttending('ATTENDING', data.user.ldapId)}>Ik ben 🐝</button>
				<button on:click={async () => await setAttending('UNSURE', data.user.ldapId)}>Ik weet het nog niet</button>
				<button on:click={async () => await setAttending('NOT_ATTENDING', data.user.ldapId)}>Ik ben niet 🐝</button>
			</div>

			<div class="ibs-card--content users">
				{#each attending as a}
					<UserCard status={a.status} user={a.user} {cardAction} />
				{/each}
			</div>
		</div>

		<div class="ibs-card comments outline">
			<h2 class="ibs-card--title">Reaguursels</h2>

			<div class="ibs-card--content">
				<form
					method="POST"
					use:enhance={() => {
						return ({ result, update }) => {
							let title = 'Reactie plaatsen mislukt'
							let type = 'danger'

							if (result.status === 200) {
								title = 'Succes'
								type = 'success'

								// @ts-expect-error Ja weet je, ik snap dat je dit niet leuk vind, maar je doet het er maar mee typescript
								data.activity.comments = [...data.activity.comments, result.data.comment]
							}

							toast({
								title,
								message: result.data.message,
								type,
							})
							update()
						}
					}}>
					<input type="text" name="comment" placeholder="Typ een reactie..." />
					<button class="btn-a" type="submit">Plaats</button>
				</form>

				{#each data.activity.comments as comment}
					{@const u = comment.commenter}
					<div class="ibs-comment">
						<div class="ibs-comment--icon">
							<ProfileIcon filename={u.profilePicture} name={u.firstName + ' ' + u.lastName} height={50} width={50} />
						</div>
						<div class="ibs-comment--content">
							<a href="/leden/{u.ldapId}" class="ibs-comment--content--name">{u.firstName} {u.lastName}</a>
							<p class="ibs-comment--content--date">
								{formatDateTimeHumanReadable(comment.updatedAt)}
							</p>
							<div class="ibs-comment--content--comment">{comment.comment}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	$border-radius: 10px;
	$gap: 0.5rem;
	$gap-side: 2rem;

	@media (max-width: 600px) {
		.title {
			display: none;
		}
	}

	@media (max-width: 1350px) {
		.ibs-card--buttons {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
	}

	.cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: repeat(1fr, 10);

		gap: 1rem;

		& > .ibs-card {
			display: flex;
			flex-direction: column;

			@media (max-width: 600px) {
				margin: 0;
				margin-bottom: $gap;
				width: 90vw;
			}
		}

		@media (max-width: 600px) {
			grid-template-columns: 1fr;
			margin: 0;
			gap: $gap;
		}
	}

	#right {
		grid-row: span 2;

		align-items: center;

		.users {
			display: grid;
			grid-template-columns: 1fr 1fr;

			@media (max-width: 600px) {
				grid-template-columns: 1fr;
				width: 90%;
			}
		}
	}

	.comments {
		grid-row: span 3;
		@media (max-width: 600px) {
			.ibs-comment--content--date {
				display: none;
			}
		}
	}

	form {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-gap: 1rem;
		margin: 0.5rem 0;
	}
</style>
