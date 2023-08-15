<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import MapPin from '~icons/tabler/map-pin';
	import Clock from '~icons/tabler/clock';
	import Calendar from '~icons/tabler/calendar';
	import CalendarPlus from '~icons/tabler/calendar-plus';
	import Edit from '~icons/tabler/edit';
	import UsersGroup from '~icons/tabler/users-group';
	import ExternalLink from '~icons/tabler/external-link';
	import AccessibleOff from '~icons/tabler/accessible-off';
	import UserCard from './_user-card.svelte';
	import { generateICal, stripMarkdown } from '$lib/utils';
	import { toast } from '$lib/notification';
	import { markdown } from '$lib/utils';
	import Title from '$lib/components/title.svelte';

	const activity = $page.data.activity;
	let attending = $page.data.attending;
	$: bij = attending.filter((a: any) => a.isAttending).map((a: any) => a.user);
	$: unsure = attending
		.filter((a: any) => {
			if (bij.includes(a.user)) return false;

			let cr = new Date(a.createdAt);
			let ua = new Date(a.updatedAt);

			cr.setMilliseconds(0);
			ua.setMilliseconds(0);
			cr.setSeconds(0);
			ua.setSeconds(0);

			return cr.getTime() === ua.getTime();
		})
		.map((a: any) => a.user);

	$: notBij = attending
		.map((a: any) => a.user)
		.filter((u: any) => !bij.includes(u) && !unsure.includes(u));

	const nameWithoutMarkdown = stripMarkdown(activity.name);

	function formatTime(time: string) {
		const date = new Date(time);
		return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
	}

	function formatDate(time: string, endTime: string) {
		const date = new Date(time);
		const end = new Date(endTime);

		// If the activity is longer than 12 hours, show the end date
		if (end.getTime() - date.getTime() > 12 * 60 * 60 * 1000) {
			return (
				date.toLocaleDateString('nl-NL', {
					weekday: 'long',
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				}) +
				' - ' +
				end.toLocaleDateString('nl-NL', {
					weekday: 'long',
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				})
			);
		}

		return date.toLocaleDateString('nl-NL', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	async function setAttending(status: boolean) {
		// First check if the user is attending
		const a = attending.find((a: any) => a.user.ldapId == $page.data.user.ldapId);

		if (a.isAttending === status) {
			// The user is already attending/not attending, so do nothing
			return;
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
		})
			.then(() => {
				toast({
					title: status ? 'Gezellig!' : 'Jammer!',
					message: `Je  ${status ? 'aanwezigheid' : 'afwezigheid'} is opgeslagen`,
					type: status ? 'success' : 'info'
				});
			})
			.catch((err) => {
				toast({
					title: 'Oei!',
					message: 'Er ging iets mis bij het opslaan van je aanwezigheid',
					type: 'danger'
				});
				console.error(err);
			});

		// Update the attending status
		a.isAttending = status;
		attending = attending;
	}

	function generateIcal() {
		const startTime = new Date(activity.startTime);
		const endTime = new Date(activity.endTime);
		const ical = generateICal({
			title: activity.name,
			eventId: activity.id,
			description: activity.description,
			location: activity.location?.name,
			startTime,
			endTime,
			url: window.location.href
		});

		// now let's save the file
		const downloadLink = document.createElement('a');
		downloadLink.href = ical;
		downloadLink.download = `ibs-activiteit-${activity.id}.ical`;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}

	function generateGCal() {
		const activityUrl = $page.data.domain + '/activiteit/' + activity.id;
		let details = activity.description;
		details += `<br/><br/>Ben jij ook bij? <a href="${activityUrl}">Klik dan hier!</a>`;
		if (activity.url) details += `<br /><br/> Meer informatie <a href="${activity.url}">hier</a>`;

		const start = new Date(activity.startTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
		const end = new Date(activity.endTime).toISOString().replace(/-|:|\.\d\d\d/g, '');

		const dates = `${start}/${end}`;

		const uri = new URL('https://calendar.google.com/calendar/render');
		const search = new URLSearchParams({
			text: nameWithoutMarkdown,
			action: 'TEMPLATE',
			ctz: 'Europe/Amsterdam',
			details: stripMarkdown(details),
			location: activity.location?.name ?? 'Locatie nog onbekend',
			sprop: `name:{{Invictus Bier Systeem}},website:${activityUrl}`,
			add: bij.map((a: any) => a.email).join(','),
			dates
		});

		uri.search = search.toString();

		window.open(uri.toString());
	}
</script>

<div>
	<div class="title">
		<Title markdown title={markdown(activity.name) ?? activity.name} shortTitle={activity.name} />
	</div>

	<div class="cols">
		<div class="ibs-card outline">
			<div class="ibs-card--image">
				<img
					alt={nameWithoutMarkdown}
					src="/image/activities/{activity.image}?size=700x300"
					onerror="this.src='/image/activities/activiteit-0-logo.png?size=700x300'"
				/>
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
				<button on:click={async () => await setAttending(true)}>Ik ben 🐝</button>
				<button on:click={async () => await setAttending(false)}>Ik ben niet 🐝</button>
			</div>

			<div class="ibs-card--content users">
				{#each bij as user}
					<UserCard status="positive" {user} />
				{/each}
				{#each unsure as user}
					<UserCard status="unsure" {user} />
				{/each}
				{#each notBij as user}
					<UserCard status="negative" {user} />
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

	.cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-auto-rows: auto;
		margin: 0 $gap-side;

		& > .ibs-card {
			display: flex;
			flex-direction: column;

			margin: 0 $gap;
			@media (max-width: 640px) {
				margin: 0;
				margin-bottom: $gap;
				width: 90vw;
			}
		}

		@media (max-width: 640px) {
			grid-template-columns: 1fr;
			margin: 0;
			gap: $gap;
		}
	}

	#right {
		align-items: center;

		.users {
			display: grid;
			grid-template-columns: 1fr 1fr;
			margin: $gap auto;

			@media (max-width: 600px) {
				grid-template-columns: 1fr;
				width: 90%;
			}
		}
	}
</style>
