<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import Tracklist from '../Tracklist.svelte';
	import { navigating, page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import { toast } from '$lib/notification';
	import { env } from '$env/dynamic/public';

	export let data;
	$: tracks = data.tracks;

	// Pagination
	let pageNo = 0;
	const shouldLoad = (elem: HTMLElement) => {
		if (!elem || pageNo < 2) return false;
		return (
			elem.getBoundingClientRect().top <=
			(document.documentElement.clientHeight || window.innerHeight)
		);
	};

	let loading = false;
	const loadNextPage = async () => {
		if (loading) return;
		loading = true;
		pageNo++;
		const res = await fetch(`?u=${users.join('&u=')}&p=${pageNo}`);
		if (!res.ok) {
			return toast({
				title: 'Error',
				message: await res.text(),
				type: 'error'
			});
		}
		const data = await res.json();
		if (data.length === 0) return clearInterval(interval);
		tracks = [...tracks, ...data];
		loading = false;
	};

	onMount(async () => {
		await loadNextPage();
	});

	let bottom: HTMLElement;
	const interval = setInterval(async () => {
		console.log(shouldLoad(bottom));
		if (shouldLoad(bottom)) {
			console.log('should load');
			await loadNextPage();
		}
	}, 1000);

	onDestroy(() => clearInterval(interval));

	// New user
	const url = new URL($page.url);
	let users = url.searchParams.getAll('u').map(Number).filter(Number.isInteger);
	$: includedUsers = data.users.filter((u) => users.includes(u.id));
	$: excludedUsers = data.users.filter((u) => !users.includes(u.id));

	$: if ($navigating) {
		const url = new URL($page.url);
		users = url.searchParams.getAll('u').map(Number).filter(Number.isInteger);
		newUser = '';
	}

	let newUser: string;

	$: newUserObj = excludedUsers.find((u) => u.nickname === newUser || u.firstName === newUser);
	$: newUserImg = newUserObj?.picture
		? env.PUBLIC_UPLOAD_URL + 'users/' + newUserObj.picture
		: null;
</script>

<Title title="Playlist maken" />
<div class="users">
	{#each includedUsers as user}
		<div class="user">
			<img
				src={user.picture
					? env.PUBLIC_UPLOAD_URL + 'users/' + user.picture
					: 'https://avatars.githubusercontent.com/u/11670885?v=4'}
				alt={user.firstName}
			/>
			<p>{user.nickname ?? user.firstName}</p>
			<a
				href={`/playlist/create?u=${includedUsers
					.filter((u) => u.id !== user.id)
					.map((u) => u.id)
					.join('&u=')}`}>x</a
			>
		</div>
	{/each}
	<div class="user">
		<img
			src={newUserImg ?? 'https://avatars.githubusercontent.com/u/11670885?v=4'}
			alt="New user"
		/>
		<input list="users" placeholder="Gebruiker" bind:value={newUser} />
		<datalist id="users">
			{#each excludedUsers as user}
				<option value={user.nickname ?? user.firstName} />
			{/each}
		</datalist>
		{#if newUserObj}
			<a
				href={`/playlist/create?u=${[...includedUsers.map((u) => u.id), newUserObj.id].join(
					'&u='
				)}`}
				class="plus">+</a
			>
		{:else}
			<p class="plus disabled">+</p>
		{/if}
	</div>
</div>
{#if tracks.length}
	<Tracklist {tracks} liked={data.liked} playlist={data.playlist} />
{:else}
	<p>Geen resultaten</p>
{/if}
<div bind:this={bottom} />

<style lang="scss">
	$margin: 10px;
	$img-size: 2.5rem;

	.users {
		display: flex;
		flex-wrap: wrap;
		padding: calc(2 * $margin);
		gap: $margin;

		.user {
			display: flex;
			gap: $margin;
			align-items: center;
			background-color: var(--primary-color);
			color: white;
			padding: 5px;
			padding-right: $margin;
			border-radius: $img-size;

			img {
				height: $img-size;
				width: $img-size;
				object-fit: cover;
				border-radius: 100%;
			}

			a,
			.disabled {
				background-color: transparent;
				border: none;
				color: #eee;
				cursor: pointer;
				font-family: monospace;

				&.plus {
					font-size: 1.5rem;
					color: white;
				}

				&.disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}
			}

			input {
				background: transparent;
				border: none;
				color: white;
				padding: 0;
				margin: 0;
				width: 6rem;

				&:focus {
					box-shadow: none !important;
				}

				&::placeholder {
					color: #eee;
				}
			}
		}
	}
</style>
