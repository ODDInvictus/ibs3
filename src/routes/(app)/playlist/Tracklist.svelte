<script lang="ts">
	import Pause from '~icons/tabler/playerPauseFilled';
	import Play from '~icons/tabler/playerPlayFilled';
	import Heart from '~icons/tabler/heart';
	import HeartFilled from '~icons/tabler/heart-filled';
	import { toast } from '$lib/notification';

	export let search = '';
	export let tracks: SpotifyApi.TrackObjectFull[];
	export let liked: string[];
	export let playlist: string[];

	const getSmallestImage = (images: SpotifyApi.ImageObject[]) => {
		return images.reduce((smallest, image) => {
			if (image.height! < smallest.height! && image.width! < smallest.width!) return image;
			return smallest;
		}, images[0]);
	};

	const formatArtists = (artists: SpotifyApi.ArtistObjectSimplified[]) => {
		return artists.map((artist) => artist.name).join(', ');
	};

	let previewSrc = '';
	let audioPlayer: HTMLAudioElement;

	$: {
		if (audioPlayer) {
			audioPlayer.src = previewSrc;
			audioPlayer.play();
		}
	}

	let hovering = '';

	$: onChange(search);
	const onChange = (...args: any[]) => {
		if (audioPlayer) audioPlayer.pause();
		previewSrc = '';
	};

	const toggleLike = async (track: SpotifyApi.TrackObjectFull) => {
		let isLiked = false;
		if (liked.includes(track.id)) {
			liked = liked.filter((id) => id !== track.id);
		} else {
			liked = [...liked, track.id];
			isLiked = true;
		}

		try {
			await fetch('/playlist', {
				method: 'POST',
				body: JSON.stringify({
					trackId: track.id,
					liked: isLiked,
					trackUri: track.uri
				})
			});
		} catch (error: any) {
			toast({
				title: 'Error',
				message: error,
				type: 'error'
			});
		}
	};
</script>

<audio src={previewSrc} bind:this={audioPlayer} />
<ul>
	{#each tracks as track}
		<li class={playlist.includes(track.id) ? 'highlight' : ''}>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={async () => {
					await toggleLike(track);
				}}
				role="button"
				tabindex="0"
				class="like"
			>
				{#if liked.includes(track.id)}
					<HeartFilled color="#1db954" />
				{:else}
					<Heart />
				{/if}
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				role="button"
				tabindex="0"
				on:click={() => {
					hovering = 'een trigger zodat svelte het weer snapt';
					hovering = track.preview_url ?? '';
					if (track.preview_url === previewSrc) {
						if (audioPlayer.paused) audioPlayer.play();
						else audioPlayer.pause();
					} else {
						if (track.preview_url) previewSrc = track.preview_url;
					}
				}}
				class={`${track.preview_url ? 'clickable' : ''}`}
				on:mouseenter={() => (hovering = track.preview_url ?? '')}
				on:mouseleave={() => (hovering = '')}
			>
				<img
					src={getSmallestImage(track.album.images).url}
					alt={'Album cover ' + track.name}
					class={`${previewSrc === track.preview_url && !audioPlayer.paused ? 'highlight' : ''}`}
				/>
				{#if track.preview_url}
					{#if (hovering === track.preview_url && (previewSrc !== track.preview_url || audioPlayer.paused)) || (previewSrc === track.preview_url && audioPlayer.paused)}
						<Play style="position: absolute; top: 16px; left: 16px; height: 26px; width: 26px;" />
					{:else if previewSrc === track.preview_url && !audioPlayer.paused}
						<Pause style="position: absolute; top: 16px; left: 16px; height: 26px; width: 26px;" />
					{/if}
				{/if}
			</div>
			<div class="info">
				<a class="title" href={`/playlist/${track.id}`}>{track.name}</a>
				<p class="artists">{formatArtists(track.artists)}</p>
			</div>
		</li>
	{/each}
</ul>

<style lang="scss">
	$highlight-opacity: 0.7;

	ul {
		li {
			display: grid;
			grid-template-columns: 20px 58px 1fr;
			grid-template-rows: 58px;
			align-items: center;
			gap: 20px;

			&.highlight {
				$hightlight-color: var(--primary-light-color);

				background-color: $hightlight-color;
				box-shadow: $hightlight-color -20px 0px 0px 5px, $hightlight-color 20px 0px 0px 5px;

				a,
				p,
				* {
					color: white !important;
				}
			}

			.like {
				user-select: none;

				transform-origin: center;

				&:active {
					transform: scale(1.15);
				}
			}

			img {
				-webkit-tap-highlight-color: none;
				height: 58px;
				width: 58px;

				&.highlight {
					opacity: $highlight-opacity;
				}
			}

			.clickable {
				cursor: pointer;
				display: inline-block;
				position: relative;

				&:hover:not(.highlight) img {
					opacity: $highlight-opacity;
				}
			}

			.info {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

				a {
					color: var(--text-color);
				}

				.artists {
					font-size: 0.8rem;
					color: #888;
					width: calc(100vw - 180px);
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.title:hover {
					text-decoration: underline;
					cursor: pointer;
				}
			}

			&:not(:last-child) {
				margin-bottom: 10px;
			}
		}
	}
</style>
