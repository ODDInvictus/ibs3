<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import { markdown } from '$lib/utils';
</script>

<div id="top">
	<h1>Kalender</h1>
	<a href="/activiteit/nieuw">Activiteit aanmaken</a>
</div>

<hr />

<div id="activities">
	{#each $page.data.activities as activity}
		<div class="row">
			<div class="image">
				{#if activity.image == null}
					<img
						src={env.PUBLIC_UPLOAD_URL + 'activities/activiteit-0-logo.png'}
						alt="Placeholder mist?"
					/>
				{:else}
					<img
						src={env.PUBLIC_UPLOAD_URL + 'activities/' + activity.image}
						alt="Geen plaatje geupload :("
					/>
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
						minute: '2-digit'
					})} @ {activity.location?.name ?? 'Nog niet bepaald'}
				</p>
				<a href="/activiteit/{activity.id}">Meer informatie</a>
			</div>
		</div>
		<hr />
	{/each}
</div>

<style lang="scss">
	$border-radius: 10px;
	$card-height: 250px;
	$card-height-sm: 100px;

	#activities {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		margin: 0 40px;

		@media screen and (max-width: 640px) {
			margin: 0 10px !important;
		}
	}

	.row {
		display: grid;
		grid-template-columns: 1fr 2fr;
		height: $card-height;
		width: 100%;

		@media screen and (max-width: 640px) {
			height: $card-height-sm;
		}

		border-radius: $border-radius;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

		.image {
			position: relative;

			@media screen and (max-width: 640px) {
				.date-tag {
					display: none !important;
				}
			}

			img {
				height: $card-height;

				@media screen and (max-width: 640px) {
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

				background-color: var(--card-color);

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

			.activity-description {
				overflow-x: hidden;
				overflow-y: scroll;
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

			@media screen and (max-width: 640px) {
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

	#top {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;

		h1 {
			text-align: center;
		}
	}

	hr {
		margin: var(--hr-margin);
	}
</style>
