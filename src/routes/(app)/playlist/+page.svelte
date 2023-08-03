<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import Title from '$lib/components/title.svelte';
	import Heart from '$lib/components/icons/Heart.svelte';
	import Cross from '$lib/components/icons/Cross.svelte';
	import Arrow from '$lib/components/icons/Arrow.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { toast } from '$lib/notification';
	import { PUBLIC_MIN_LIKES } from '$env/static/public';

	export let data: PageServerData;

	const MIN_LIKES = Number.isNaN(Number(PUBLIC_MIN_LIKES)) ? 4 : Number(PUBLIC_MIN_LIKES);

	let current: SpotifyApi.SingleTrackResponse | undefined = undefined;
	let tracks: SpotifyApi.SingleTrackResponse[] = [];
	let skipped: SpotifyApi.SingleTrackResponse[] = [];
	let audioPlayer: HTMLAudioElement;
	let previewSrc = '';

	let mounted = false;

	onMount(async () => {
		if (data.toReact.length == 0) return (mounted = true);

		try {
			current = await fetchNextTrack();
			previewSrc = current.preview_url ?? '';

			const toLoad = Math.min(3, data.toReact.length);
			for (let i = 0; i < toLoad; i++) {
				tracks = [...tracks, await fetchNextTrack()];
			}
		} catch (error: any) {
			toast({
				title: 'Error',
				message: 'Error tijdens het ophalen van de eerste track',
				type: 'error'
			});
		}

		mounted = true;
	});

	const fetchNextTrack = async () => {
		const next = data.toReact.shift();
		if (!next) throw new Error('Geen tracks meer om te laden');

		const res: SpotifyApi.SingleTrackResponse | undefined = await (
			await fetch(`/playlist?id=${next.id}`)
		).json();
		if (!res) throw new Error('Error tijdens het ophalen van de volgende track');

		// @ts-ignore
		res.likes = next.likes;
		return res;
	};

	const getSmallestImageAbove300 = (images: SpotifyApi.ImageObject[]): SpotifyApi.ImageObject => {
		let smallestImage = images[0];
		for (const image of images) {
			if (image.width! > 300 && image.width! < smallestImage.width!) smallestImage = image;
		}
		return smallestImage;
	};

	$: if (audioPlayer && mounted) {
		if (previewSrc == '') audioPlayer.pause();
		else {
			audioPlayer.src = previewSrc;
			audioPlayer.play();
		}
	}

	const formatArtists = (artists: SpotifyApi.ArtistObjectSimplified[]) => {
		return artists.map((artist) => artist.name).join(', ');
	};

	const next = async () => {
		if (tracks.length > 0) current = tracks.shift();
		else {
			const nextSkipped = skipped.shift();
			if (!nextSkipped || nextSkipped.id === current?.id) current = undefined;
			else current = nextSkipped;
		}

		audioPlayer.pause();
		previewSrc = '';
		if (current?.preview_url) previewSrc = current.preview_url;
		if (data.toReact.length) tracks = [...tracks, await fetchNextTrack()];
	};

	const react = async (track: SpotifyApi.SingleTrackResponse, liked: boolean) => {
		try {
			await fetch('', {
				method: 'POST',
				body: JSON.stringify({
					trackId: track.id,
					liked
				})
			});

			skipped = [...skipped.filter((t) => t.id !== track.id)];
		} catch (error) {
			console.error(error);
			toast({
				title: 'Error',
				message: 'Er is iets fout gegaan, probeer het later opnieuw',
				type: 'error'
			});
			return;
		}

		// @ts-expect-error
		const likes: { user: { firstName: string; nickname?: string } }[] = track.likes;

		if (!liked || likes.length !== MIN_LIKES - 1) return;

		toast({
			title: 'Nieuw hitje',
			message: `${track.name} is toegevoegd aan de playlist dankzij ${
				likes.map((like) => like.user.nickname ?? like.user.firstName).join(', ') + ' en jij!'
			}`,
			type: 'success'
		});
	};
</script>

<svelte:head>
	<title>IBS :: Playlist</title>
</svelte:head>

<audio src="" bind:this={audioPlayer} />
{#if !mounted}
	<div class="load">
		<Loader />
	</div>
{:else if !current}
	<Title title="Playlist" />
	<div>
		<h1>Geen tracks meer...</h1>
		<a href="/playlist/zoek">Zoek naar nieuwe</a>
	</div>
{:else}
	<content>
		<div class="card">
			<img
				src={getSmallestImageAbove300(current.album.images).url}
				alt={`${current.name} album cover`}
			/>
			<div class="info">
				<div class="top">
					<p class={current.name.replace(' ', '').length > 30 ? 'slide' : ''}>{current.name}</p>
					<p class={formatArtists(current.artists).length > 35 ? 'slide artists' : 'artists'}>
						{formatArtists(current.artists)}
					</p>
				</div>
			</div>
			<div class="links">
				<a href={current.external_urls.spotify} target="_blank" rel="noopener noreferrer"
					>Open in Spotify</a
				>
				<a href="/playlist/zoek">Nieuwe track</a>
			</div>
			<div class="actions">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<i
					class="dislike"
					on:click={async () => {
						if (!current) return;
						await Promise.all([react(current, false), next()]);
					}}
				>
					<svelte:component this={Cross} width="70" height="70" />
				</i>

				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<i
					on:click={async () => {
						await next();
						if (!current) return;
						skipped = [...skipped, current];
					}}
				>
					<Arrow width="50" height="50" />
				</i>

				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<i
					class="like"
					on:click={async () => {
						if (!current) return;

						await Promise.all([react(current, true), next()]);
					}}
				>
					<Heart width="70" height="70" />
				</i>
			</div>
		</div>
	</content>
{/if}

<style lang="scss">
	content {
		display: flex;
		justify-content: center;
		height: calc(100vh - 240px);

		@media screen and (min-width: 640px) {
			height: 100%;
		}
	}

	.card {
		transition: transform 0.2s ease-in-out;

		&:has(i.like:active) {
			transform: rotate(5deg);
		}

		&:has(i.dislike:active) {
			transform: rotate(-5deg);
		}

		@media screen and (max-width: 640px) {
			max-width: 300px;
		}

		max-width: 500px;

		display: flex;
		flex-direction: column;

		.top {
			font-size: 1.3rem;
			overflow: hidden;
			white-space: nowrap;

			@keyframes slide {
				from {
					transform: translateX(50%);
					opacity: 0;
				}

				5% {
					opacity: 1;
				}

				95% {
					opacity: 1;
				}

				to {
					transform: translateX(-70%);
					opacity: 0;
				}
			}

			.slide {
				animation: slide 10s linear infinite;
			}

			.artists {
				font-size: 1rem;
				opacity: 0.6;
			}
		}

		.actions {
			display: flex;
			height: 100%;
			justify-content: space-around;
			align-items: center;

			i:hover {
				cursor: pointer;
				opacity: 0.8;
			}
		}

		.links {
			font-size: 0.8rem;
			display: flex;
			justify-content: space-between;
		}
	}

	.load {
		display: flex;
		justify-content: center;
		align-items: center;
		height: calc(100vh - 240px);
	}
</style>
