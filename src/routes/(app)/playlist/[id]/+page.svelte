<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import UserList from './UserList.svelte';
	import { env } from '$env/dynamic/public';
	import { browser } from '$app/environment';
	import Play from '~icons/tabler/playerPlayFilled';
	import Pause from '~icons/tabler/playerPauseFilled';
	import BrandSpotify from '~icons/tabler/brandSpotify';
	import BrandWhatsapp from '~icons/tabler/brandWhatsapp';
	import Like from '~icons/tabler/thumbUp';
	import LikeFilled from '~icons/tabler/thumbUpFilled';
	import Dislike from '~icons/tabler/thumbDown';
	import DislikeFilled from '~icons/tabler/thumbDownFilled';
	import { toast } from '$lib/notification';

	const MIN_LIKES = Number.isNaN(Number(env.PUBLIC_MIN_LIKES)) ? 4 : Number(env.PUBLIC_MIN_LIKES);

	export let data;

	let likes = data.reactions?.likes?.filter((r) => r.liked)?.map((r) => r.user) ?? [];
	let dislikes = data.reactions?.likes?.filter((r) => !r.liked)?.map((r) => r.user) ?? [];

	const getSmallestImageAbove110px = (images: SpotifyApi.ImageObject[]) => {
		return images.reduce((smallest, image) => {
			if (
				image.height! < smallest.height! &&
				image.width! < smallest.width! &&
				image.height! >= 110 &&
				image.width! >= 110
			)
				return image;
			return smallest;
		}, images[0]);
	};

	const getDaysSince = (date: Date) => {
		const diff = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
		return diff === 1 ? `${diff} dag` : `${diff} dagen`;
	};

	const generateWhatsappUrl = () => {
		if (!browser || !data.track) return '';

		return `https://api.whatsapp.com/send?text=${encodeURIComponent(
			`Wat vind je van ${data.track.body.name} van ${data.track.body.artists
				.map((a) => a.name)
				.join(' en ')} voor in de Invictus playlist?\n\n${window.location.href}`
		)}`;
	};

	$: console.log(data);

	const react = async (liked: boolean) => {
		if (!data.track) return;

		if (liked) {
			if (likes.find((l) => l.id === data.user.id)) return;
			dislikes = dislikes.filter((d) => d.id !== data.user.id);
			likes = [...likes, data.user];

			if (likes.length === MIN_LIKES) {
				toast({
					title: 'Nieuw hitje',
					message: `${data.track.body.name} van ${data.track.body.artists
						.map((a) => a.name)
						.join(' en ')} is toegevoegd aan de playlist!}`,
					type: 'success'
				});

				data.reactions!.inPlaylist = true;
				data.reactions!.updatedAt = new Date();
			}
		} else {
			if (dislikes.find((d) => d.id === data.user.id)) return;
			likes = likes.filter((l) => l.id !== data.user.id);
			dislikes = [...dislikes, data.user];
		}

		await fetch(`/playlist`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				liked,
				trackId: data.track.body.id,
				trackUri: data.track.body.uri
			})
		});
	};

	let player: HTMLAudioElement;
	let isPaused = true;

	let progress = 2;
	setInterval(() => {
		if (!player || isPaused) return;
		progress = (player.currentTime / 30) * 27 + 3;
	}, 100);
</script>

{#if data.error}
	<Title title="Playlist" />
	<p class="error">Error: {data.error}</p>
{:else if data.track}
	<audio bind:this={player} src={data.track.body.preview_url} loop />
	<Title title={data.track.body.name} underTitle={data.track.body.artists[0].name} />
	<main>
		<div class="info">
			<img src={getSmallestImageAbove110px(data.track.body.album.images).url} alt="Album cover" />
			<div class="added">
				{#if data.reactions}
					{#if data.reactions.inPlaylist}
						<p>In de playlist sinds</p>
						<p class="light">{getDaysSince(data.reactions.updatedAt)}</p>
					{:else}
						<p>Benodigde likes</p>
						<p class="light">
							{MIN_LIKES - likes.length} Like{MIN_LIKES - likes.length === 1 ? '' : 's'}
						</p>
					{/if}
				{:else}
					<p>Benodigde likes</p>
					<p class="light">
						{MIN_LIKES - likes.length} Like{MIN_LIKES - likes.length === 1 ? '' : 's'}
					</p>
				{/if}
			</div>
			<div class="audio">
				{#if data.track.body.preview_url && player}
					{#if isPaused}
						<button
							on:click={() => {
								isPaused = false;
								player.play();
							}}
						>
							<Play color="#8b5cf6" height="2rem" width="2rem" />
						</button>
					{:else}
						<button
							on:click={() => {
								isPaused = true;
								player.pause();
							}}
						>
							<Pause color="#8b5cf6" height="2rem" width="2rem" />
						</button>
					{/if}
					<progress value={progress} max="30" />
				{:else}
					<p>Geen preview</p>
				{/if}
			</div>
		</div>
		<div class="links">
			<button on:click={async () => await react(true)} class="link">
				{#if likes.find((l) => l.id === data.user.id)}
					<LikeFilled color="white" />
				{:else}
					<Like color="white" />
				{/if}
				<p>{likes.length}</p>
			</button>
			<button on:click={async () => await react(false)} class="link">
				{#if dislikes.find((d) => d.id === data.user.id)}
					<DislikeFilled color="white" />
				{:else}
					<Dislike color="white" />
				{/if}
				<p>{dislikes.length}</p>
			</button>
			<a
				href={data.track.body.external_urls.spotify}
				target="_blank"
				rel="noopener noreferrer"
				class="link"
			>
				<BrandSpotify color="white" />
				<p>Open</p>
			</a>
			<a href={generateWhatsappUrl()} class="link">
				<BrandWhatsapp color="white" />
				<p>Delen</p>
			</a>
		</div>
		<div class="users">
			<UserList users={dislikes} mode="dislikes" />
			<UserList users={likes} mode="likes" />
		</div>
	</main>
{/if}

<style lang="scss">
	.error {
		color: red;
	}

	main {
		display: flex;
		flex-direction: column;
		margin-top: 20px;
		gap: 20px;
		max-width: 20rem;
		margin-left: auto;
		margin-right: auto;
	}

	.info {
		display: grid;
		grid-template-areas:
			'img added'
			'img audio';
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 50% 50%;

		img {
			grid-area: img;
			place-self: center;
			max-width: 110px;

			@media (max-width: 300px) {
				max-width: 80px;
			}
		}

		.added {
			grid-area: added;

			.light {
				opacity: 0.6;
			}
		}

		.audio {
			grid-area: audio;
			display: flex;
			align-items: center;
			gap: 10px;

			progress[value]::-webkit-progress-value::after {
				content: '';
				width: 6px;
				height: 6px;
				position: absolute;
				border-radius: 100%;
				right: 7px;
				top: 7px;
				background-color: white;
			}

			progress::-webkit-progress-bar {
				background-color: #eee;
				border-radius: 1rem;
				box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
			}

			progress[value]::-webkit-progress-value {
				background-color: var(--primary-light-color);
				border-radius: 1rem;
				background-size: 35px 20px, 100% 100%, 100% 100%;
			}
		}
	}

	.links {
		display: flex;
		gap: 10px;
		overflow-x: scroll;
		scrollbar-width: none;
		-ms-overflow-style: none;

		&::-webkit-scrollbar {
			display: none;
		}

		button.link p {
			margin-right: 2px;
		}

		.link {
			display: flex;
			padding: 7px;
			gap: 7px;
			border-radius: 1rem;
			background-color: var(--primary-light-color);
			align-items: center;
			color: white;

			&:hover {
				text-decoration: none;
				background-color: var(--primary-color);
			}
		}
	}

	.users {
		display: flex;
		justify-content: space-around;

		@media (max-width: 300px) {
			flex-direction: column;
		}
	}
</style>
