<script lang="ts">
	import ProfileIcon from '$lib/components/profile-icon.svelte'
	import type { User, AttendingStatus } from '@prisma/client'

	export let user: User
	export let status: AttendingStatus

	const getStatus = () => {
		switch (status) {
			case 'ATTENDING':
				return 'positive'
			case 'NOT_ATTENDING':
				return 'negative'
			case 'UNSURE':
				return 'unsure'
			case 'NO_RESPONSE':
				return 'no-response'
		}
	}

	const statusTitle = () => {
		switch (status) {
			case 'ATTENDING':
				return 'Bij!'
			case 'NOT_ATTENDING':
				return 'Niet bij :('
			case 'UNSURE':
				return 'Weet het nog niet'
			case 'NO_RESPONSE':
				return 'Niet gereageerd :('
		}
	}
</script>

<div class="user-card" title={statusTitle()}>
	<div class="user-card-picture">
		<ProfileIcon height="50" width="50" filename={user.profilePicture} name={user.firstName + ' ' + user.lastName} />

		<div class="status">
			{#key status}
				{#if status !== 'UNSURE'}
					<div class="status-circle {getStatus()}" />
				{:else}
					<div class="status-circle unsure">?</div>
				{/if}
			{/key}
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

		@media (max-width: 600px) {
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
			background-color: white;
			text-align: center;
			font-size: 0.8rem;
			font-weight: 600;
			line-height: 12px;
			color: rgba(255, 0, 0, 0.733);
		}

		.no-response {
			background-color: rgba(128, 128, 128, 0.842);
		}

		.user-card-name {
			display: flex;
			align-items: center;
			padding-left: 0.5rem;
			justify-content: flex-start;
		}
	}
</style>
