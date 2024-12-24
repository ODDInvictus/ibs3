<script lang="ts">
	import { page } from '$app/stores'
</script>

<main>
	<h1>OAuth error</h1>

	<p>Iets is stuk gegaan bij de authenticatie.</p>
	<p>Dit hoort natuurlijk niet, dus stuur Niels even een appje svp.</p>
	<p>Error-code: {$page.url.searchParams.get('error')}</p>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		height: 100vh;

		color: white;

		background-color: var(--color-primary);
	}

	h1 {
		color: white;
		font-size: 5rem;
	}

	p {
		font-size: 2rem;
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 2rem;
		}

		p {
			font-size: 1rem;
		}
	}
</style>
