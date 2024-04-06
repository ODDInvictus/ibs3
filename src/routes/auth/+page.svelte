<script lang="ts">
	import { signIn } from '@auth/sveltekit/client'
	import Logo from '$lib/components/logo-v2-small.svelte'
	import LogoBig from '$lib/components/logo-v2.svelte'
	import Login from '~icons/tabler/login.svg'
	import OAuth from '~icons/tabler/brand-oauth.svg'
	import Register from '~icons/tabler/bookmark-edit.svg'
	import { env } from '$env/dynamic/public'

	let selection = 'login'
</script>

<main>
	<div class="container">
		<div class="welcome-card">
			<header class="ibs-card">
				<Logo />
				<LogoBig />
				<div class="spacer" />
				<div class="buttons">

					<button on:click={() => (selection = 'login')}>
						<i><Login /></i>
						Login
					</button>

					<button on:click={() => (selection = 'register')}>
						<i>
							<Register />
						</i>
						Registreer
					</button>
				</div>
			</header>
		</div>
		<div class="stripe" />
		<div class="login-card">
			<div class="ibs-card">
				{#if selection === 'login'}
					<h1>Login</h1>
					<p>Welkom bij Invictus Bier Systeem! </p>
					<button on:click={() => signIn('authentik')}>
						<i>
							<OAuth />
						</i>
						Login met Authentik
					</button>
					<button on:click={() => window.location.href = "https://www.youtube.com/watch?v=ENXvZ9YRjbo"}>
						<i>
							<Login />
						</i>
						Backdoor
					</button>
				{:else if selection === 'register'}
					<h1>Registreer</h1>
					<p>Gebruik de code die je hebt gekregen</p>
					<input name="username" type="text" placeholder="gebruikersnaam" />
					<input name="code" type="text" placeholder="code" />
					<button>Registreer</button>
				{/if}
			</div>
		</div>
		<footer>
			<p>O.D.D. Invictus</p>
			<p>
				v{env.PUBLIC_VERSION} -
				<a href={env.PUBLIC_GITHUB_LINK + '/tree/' + env.PUBLIC_GIT_REV}>
					({env.PUBLIC_GIT_REV_SHORT})
				</a>
			</p>
		</footer>
	</div>
</main>

<style lang="scss">
	$padding: 2rem;

	:global(body) {
		background-color: var(--color-bg-base);
	}

	main {
		height: 100%;
		width: 100%;

		overflow: auto;
	}

	.container {
		position: relative;
		z-index: 1;

		height: 100%;
		padding: 0 15%;

		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-rows: 1fr auto 1fr;
		align-items: center;
		column-gap: 4em;
	}

	.welcome-card {
		width: max-content;

		grid-row: 2;

		display: flex;
		justify-content: center;
		align-items: center;

		.ibs-card {
			padding: $padding;

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.spacer {
			height: 1.5rem;
		}

		.buttons {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			gap: 1rem;

			& > button {
				width: 100%;
			}
		}
	}

	.stripe {
		position: absolute;
		z-index: -1;
		top: 0;
		left: calc(15% - 1rem);
		width: 11em;
		height: 100%;

		background-color: var(--color-primary);
	}

	.login-card {
		grid-row: 2;

		display: flex;
		align-items: center;

		.ibs-card {
			padding: $padding;

			display: grid;
			gap: 1rem;
		}
	}

	footer {
		color: var(--color-text-muted);

		align-self: end;
		grid-column: span 2;
		grid-row: 3;
		padding-bottom: 2rem;

		text-align: center;

		a {
			text-decoration: none;
		}
	}

	@media (max-width: 600px) {
		.container {
			padding: 0 5%;
			padding-top: 1rem;

			display: grid;
			grid-template-columns: 1fr;
			grid-template-rows: 1fr;
			align-items: center;
			row-gap: 1rem;

			.welcome-card {
				grid-row: 1;

				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.ibs-card {
					width: calc(100% - 2 * #{$padding});

					button {
						padding: 0.5rem 0rem;
					}
				}

				.ibs-card :global(svg) {
					width: 60vw;
				}
			}

			.stripe {
				top: calc(15% - 1rem);
				left: 0;
				width: 100%;
				height: 5rem;
			}

			.login-card {
				grid-row: 2;
				display: flex;
				flex-direction: column;
				align-items: center;

				.ibs-card {
					width: calc(100% - 2 * #{$padding});
				}
			}

			footer {
				grid-column: span 1;
				grid-row: 3;
			}
		}
	}
</style>
