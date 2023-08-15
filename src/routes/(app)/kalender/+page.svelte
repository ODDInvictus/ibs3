<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import Title from '$lib/components/title.svelte';
	import { markdown } from '$lib/utils';
</script>

<Title title="Kalender" />
<a id="new-activity-link" href="/activiteit/nieuw">Activiteit aanmaken</a>

<div id="activities">
	{#each $page.data.activities as activity}
		<div class="row">
			<div class="image">
				{#if activity.image == null}
					<img src="/image/activities/activiteit-0-logo.png?size=500x250" alt="⏳" />
				{:else}
					<img
						src="/image/activities/{activity.image}?size=750x375"
						onerror="this.src='/image/activities/activiteit-0-logo.png?size=500x250';this.onerror=null;"
						alt="⏳"
						loading="lazy"
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
	$border-radius: var(--border-radius);
	$card-height: 250px;
	$card-height-sm: 100px;

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

	#new-activity-link {
		display: flex;
		flex-direction: column;
		align-items: center;

		margin-bottom: 1rem;
	}

	hr {
		margin: 0.5rem;
	}
</style>
