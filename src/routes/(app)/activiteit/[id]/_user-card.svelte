<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { User } from '@prisma/client';

	export let user: User;
	export let status: 'positive' | 'negative' | 'unsure';
</script>

<div class="user-card">
	<div class="user-card-picture">
		{#if user.picture == null}
			<img src="https://avatars.githubusercontent.com/u/11670885?v=4" alt="user" />
			<!-- <img src={env.PUBLIC_UPLOAD_URL + 'users/miel.jpg'} alt={user.firstName} /> -->
		{:else}
			<img src={env.PUBLIC_UPLOAD_URL + 'users/' + user.picture} alt={user.firstName} />
		{/if}

		<div class="status">
			<div class="status-circle {status}" />
		</div>
	</div>

	<div class="user-card-name">
		<a href="/leden/{user.ldapId}">{user.firstName + ' ' + user.lastName}</a>
	</div>
</div>

<style lang="scss">
	$bg-color: var(--color-bg-base);

	.user-card {
		--img-size: 50px;
		--status-size: 12px;
		--status-x: -2px;
		--status-y: 3px;

		@media (max-width: 640px) {
			--img-size: 35px;
			--status-size: 10px;
			--status-x: -3px;
			--status-y: 7px;
		}

		display: grid;
		grid-template-columns: 50px 1fr;

		padding: 0.5rem;
		margin: 0.5rem;
		border-radius: 10px;
		background-color: $bg-color;
		box-shadow: 0 0 5px $bg-color;

		.user-card-picture {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
		}

		.status {
			z-index: 10;
			position: absolute;
			background-color: $bg-color;

			bottom: var(--status-x);
			right: var(--status-y);

			padding: 2px;

			border-radius: 50%;
		}

		.status-circle {
			width: var(--status-size);
			height: var(--status-size);
			border-radius: 50%;
		}

		.positive {
			background-color: rgba(0, 128, 0, 0.842);
		}

		.negative {
			background-color: rgba(255, 0, 0, 0.733);
		}

		.unsure {
			background-color: rgba(128, 128, 128, 0.842);
		}

		img {
			width: var(--img-size);
			height: var(--img-size);
			object-fit: cover;
			border-radius: 50%;
			margin-right: 0.5rem;
		}

		.user-card-name {
			display: flex;
			align-items: center;
			justify-content: flex-start;
		}
	}
</style>
