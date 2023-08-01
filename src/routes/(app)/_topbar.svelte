<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import Breadcrumps from '$lib/components/breadcrumps.svelte';
</script>

<div class="layout--topbar">
	<Breadcrumps />

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
	.layout--topbar {
		display: flex;
		justify-content: space-between;
		margin: 0.5rem;
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
		width: var(--topbar-height);
		height: var(--topbar-height);
		border-radius: 50%;
		overflow: hidden;
		margin-right: 10px;

		img {
			width: var(--topbar-height);
			height: var(--topbar-height);
			object-fit: cover;
			border-radius: 50%;
		}
	}
</style>
