<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import Breadcrumps from '$lib/components/breadcrumps.svelte';
	import Logo from '$lib/components/logo-v2-small-white.svelte';
</script>

<div class="layout--topbar">
	<div class="breadcrumps">
		<Breadcrumps />
	</div>

	<div class="logo">
		<a href="/">
			<Logo />
		</a>
	</div>

	<div class="user">
		<div class="avatar">
			{#if $page.data.user.picture == null}
				<img src="https://avatars.githubusercontent.com/u/11670885?v=4" alt="user" />
			{:else}
				<img src={env.PUBLIC_UPLOAD_URL + 'users/' + $page.data.user.picture} alt="user" />
			{/if}
		</div>
		<div class="name">
			{$page.data.user.firstName}
			{$page.data.user.lastName}
		</div>
		<div class="role">
			{$page.data.topRole}
		</div>
	</div>
</div>

<style lang="scss">
	.breadcrumps {
		display: flex;
		align-items: center;
	}

	.logo {
		display: none;
	}

	.user {
		display: grid;
		grid-template-areas: 'name avatar' 'role avatar';
	}

	.name {
		grid-area: name;

		font-weight: 600;

		margin-top: 0.4rem;
		margin-bottom: -0.25rem;
		padding-right: 0.5rem;
	}

	.role {
		grid-area: role;
		font-size: smaller;
		text-align: end;

		padding-right: 0.5rem;
	}

	.avatar {
		grid-area: avatar;
		width: var(--topbar-avatar-size);
		height: var(--topbar-avatar-size);
		border-radius: 50%;
		overflow: hidden;
		margin-right: 10px;

		img {
			width: var(--topbar-avatar-size);
			height: var(--topbar-avatar-size);
			object-fit: cover;
			border-radius: 50%;
		}
	}

	@media (max-width: 600px) {
		.breadcrumps {
			display: none;
		}

		.name {
			grid-area: name;

			font-weight: 600;

			margin-top: 0rem;
		}

		.logo {
			display: block;
			a {
				display: flex;
				align-items: flex-start;
				justify-content: flex-start;

				& :global(svg) {
					width: var(--topbar-logo-width);
					height: var(--topbar-logo-height);
				}
			}
		}
	}
</style>
