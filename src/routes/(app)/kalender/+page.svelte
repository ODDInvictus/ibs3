<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { getPictureUrl, markdown } from '$lib/utils'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
	const calendarItems = $derived(
		[
			...data.activities.map(activity => ({
				type: 'activity' as const,
				key: `activity-${activity.id}`,
				startTime: activity.startTime,
				activity,
			})),
			...data.calendarEvents.map(event => ({
				type: 'calendarEvent' as const,
				key: `calendar-event-${event.id}`,
				startTime: event.startTime,
				event,
			})),
		].sort((left, right) => left.startTime.getTime() - right.startTime.getTime()),
	)
</script>

<Title title="Kalender" />
<div class="topbar">
	<a href="/activiteit/nieuw">Activiteit aanmaken</a>
	<a href="/kalender/agenda">Agenda item aanmaken</a>
	<a href="/kalender/oud">Oude activiteiten</a>
	<a href="/kalender/link">Download .ics</a>
</div>

<div data-testid="activities" id="activities">
	{#each calendarItems as item (item.key)}
		{#if item.type === 'activity'}
			{@const activity = item.activity}
			<div class="row {activity.isDies ? 'dies' : ''}">
				<div class="image">
					{#if !activity.activityPhotoId}
						<img src="/favicon-512.png" alt="⏳" />
					{:else}
						<img
							src={getPictureUrl(activity.activityPhoto?.file.filename, 'normal')}
							onerror={() => {
								this.src = '/favicon-512.png'
								this.onerror = null
							}}
							alt="⏳"
							loading="lazy" />
					{/if}
					<div class="date-tag">
						<div class="day">
							{new Date(activity.startTime).toLocaleDateString('nl-NL', { day: '2-digit' })}
						</div>
						<div class="month">
							{new Date(activity.startTime).toLocaleDateString('nl-NL', { month: 'short' })}
						</div>
					</div>
				</div>

				<div class="info">
					<h2 class="activity-title">{@html markdown(activity.name)}</h2>
					<p class="activity-description">{@html markdown(activity.description)}</p>
					<p class="activity-date">{new Date(activity.startTime).toLocaleDateString('nl-NL')}</p>
					<p class="activity-time">
						{new Date(activity.startTime).toLocaleTimeString('nl-NL', {
							hour: '2-digit',
							minute: '2-digit',
						})} @ {activity.location?.name ?? 'Nog niet bepaald'}
					</p>
					<a href="/activiteit/{activity.id}">Meer informatie</a>
				</div>
			</div>
		{:else}
			{@const event = item.event}
			<div class="row">
				<div class="image">
					<img src="/favicon-512.png" alt="" />
					<div class="date-tag">
						<div class="day">
							{new Date(event.startTime).toLocaleDateString('nl-NL', { day: '2-digit' })}
						</div>
						<div class="month">
							{new Date(event.startTime).toLocaleDateString('nl-NL', { month: 'short' })}
						</div>
					</div>
				</div>

				<div class="info">
					<h2 class="activity-title">
						Agenda-item: {event.title}
					</h2>
					<p class="activity-description">{event.description}</p>
					<p class="activity-date">{new Date(event.startTime).toLocaleDateString('nl-NL')}</p>
					<p class="activity-time">
						{new Date(event.startTime).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
						-
						{new Date(event.endTime).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
						{#if event.location}
							@ {event.location}{/if}
					</p>
					<a href="/kalender/agenda/{event.id}">Meer informatie</a>
				</div>
			</div>
		{/if}
		<hr />
	{/each}
</div>

<style lang="scss">
	$border-radius: var(--border-radius);
	$card-height: 250px;
	$card-height-sm: 100px;

	.topbar {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1rem;

		@media (max-width: 600px) {
			flex-direction: column;
			align-items: center;
			gap: 0;
		}
	}

	#activities {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		margin: 0 40px;

		@media screen and (max-width: 600px) {
			margin: 0 10px !important;
		}
	}

	.dies {
		background-image: url('/vlaggen.svg');
		background-repeat: repeat-x;
		background-size: 200px;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr 2fr;
		height: $card-height;
		width: 100%;

		@media screen and (max-width: 600px) {
			height: $card-height-sm;
		}

		border-radius: $border-radius;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

		.image {
			position: relative;

			@media screen and (max-width: 600px) {
				.date-tag {
					display: none !important;
				}
			}

			img {
				height: $card-height;

				@media screen and (max-width: 600px) {
					height: $card-height-sm;
				}

				width: 100%;
				object-fit: cover;
				border-top-left-radius: $border-radius;
				border-bottom-left-radius: $border-radius;
			}

			.date-tag {
				border-bottom-left-radius: $border-radius;
				border-bottom-right-radius: $border-radius;

				background-color: var(--color-card);

				position: absolute;
				z-index: 1;
				top: 0;
				left: 30px;

				.month {
					padding: 5px 10px;
					text-align: center;
				}

				.day {
					font-size: 1.5rem;
					text-align: center;
				}
			}
		}

		.info {
			display: grid;
			padding: 0 10px;
			grid-template-rows: 1fr 4fr 1fr 1fr;
			height: $card-height;

			.activity-title {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.activity-description {
				overflow-x: hidden;
				overflow-y: auto;
			}

			.activity-time {
				align-self: self-end;
				padding-bottom: 5px;
			}

			a {
				align-self: self-end;
				padding-bottom: 10px;
			}

			.activity-date {
				display: none;
			}

			@media screen and (max-width: 600px) {
				grid-template-rows: 1fr 1fr 1fr;
				height: $card-height-sm;

				.activity-description,
				.activity-time {
					display: none;
				}

				.activity-date {
					display: block;
				}

				h2 {
					overflow: hidden;
				}
			}
		}
	}

	hr {
		margin: 0.5rem;
	}
</style>
