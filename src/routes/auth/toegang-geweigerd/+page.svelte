<main>
	<h1>Toegang geweigerd</h1>

	<p>Je hebt op dit moment geen toegang tot IBS.</p>
	<p>Mocht dit niet kloppen, neem dan contact op met de senaat</p>
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
