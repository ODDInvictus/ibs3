<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumps from '$lib/components/breadcrumps.svelte';
	import Logo from '$lib/components/logo-v2-small-white.svelte';
	import ProfileIcon from '$lib/components/profile-icon.svelte';
	import { confirm } from '$lib/confirm';
	import { signOut } from '@auth/sveltekit/client';

	function logout() {
		confirm({
			title: 'Uitloggen?',
			message: 'Weet je zeker dat je wil uitloggen?',
			cb: (success) => {
				if (success) signOut();
			}
		});
	}
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

	<div class="user" on:click={logout}>
		<div class="avatar">
			<ProfileIcon
				uid={$page.data.user.profilePictureId}
				name={`${$page.data.user.firstName} ${$page.data.user.lastName}`}
			/>
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
