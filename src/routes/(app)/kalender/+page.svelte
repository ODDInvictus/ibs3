<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { getPictureUrl, markdown } from '$lib/utils'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Title title="Kalender" />
<div class="topbar">
	<a href="/activiteit/nieuw">Activiteit aanmaken</a>
	<a href="/kalender/oud">Oude activiteiten</a>
</div>

<div id="activities">
	{#each data.activities as activity}
		<div class="row">
			<div class="image">
				{#if !activity.photo}
					<img src="/image/favicon-512.png?static=true" alt="⏳" />
				{:else}
					<img
						src={getPictureUrl(activity.photo)}
						onerror="this.src='/image/favicon-512.png?static=true';this.onerror=null;"
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
