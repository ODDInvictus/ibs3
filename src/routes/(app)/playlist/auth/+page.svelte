<script lang="ts">
	import { page } from '$app/stores'
	import Title from '$lib/components/title.svelte'
	import Login from './Login.svelte'
	import { onMount } from 'svelte'
	import { toast } from '$lib/notification'
	import { goto } from '$app/navigation'
	import Loader from '$lib/components/Loader.svelte'
	import Copy from '~icons/tabler/Copy.svelte'

	const searchParams = $page.url.searchParams
	const tokens: {
		access_token: string
		refresh_token: string
		expires_in: number
	} | null = searchParams.has('data') ? JSON.parse(searchParams.get('data')!) : null
	const error = searchParams.get('error')

	let mounted = false

	onMount(() => {
		if (error)
			toast({
				title: 'Error',
				message: error,
				type: 'danger',
			})

		if (tokens) {
			goto('/playlist/auth')
		}

		mounted = true
	})

	const syncPlaylist = async () => {
		try {
			const res = await fetch('/playlist', { method: 'PUT' })
			if (!res.ok) throw new Error()
			toast({
				type: 'success',
				message: 'De playlist is gesynchroniseerd',
				title: 'Success',
			})
		} catch (error) {
			toast({
				type: 'danger',
				message: 'De playlist kon niet gesynchroniseerd worden',
				title: 'Error',
			})
		}
	}
</script>

<Title title="Playlist" />
<main>
	{#if mounted}
		{#if tokens}
			<p>{tokens.refresh_token.slice(0, 4)}...{tokens.refresh_token.slice(-4)}</p>

			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					navigator.clipboard.writeText(tokens.refresh_token)
					toast({
						title: 'Copied',
						message: 'Refresh token copied to clipboard',
						type: 'success',
					})
				}}>
				<p>Copy to clipboard</p>
				<i>
					<Copy />
				</i>
			</div>
		{:else}
			<p>
				Dit is alleen bestemd voor IBS admins.
				<br /><br />
				Zorg ervoor dat je inlogt met het Invictus account
			</p>
			<Login />
		{/if}
		<button on:click={async () => await syncPlaylist()}> Sync playlist </button>
	{:else}
		<Loader />
	{/if}
</main>

<style lang="scss">
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: calc(100vh - 400px);
		gap: 15px;
		text-align: center;

		div {
			display: flex;
			align-items: center;
			cursor: pointer;
			color: var(--color-primary);

			&:hover {
				text-decoration: underline;
			}
		}
	}

	button {
		background-color: #1db954;
		padding: 1rem;
		color: white;
		border-radius: 2rem;
		text-decoration: none;
		margin-top: 20px;
		font-size: 2rem;

		&:hover {
			background-color: #1ed760;
		}
	}
</style>
