<script>
	// @ts-nocheck

	function back() {
		history.back()
	}
</script>

<main>
	<h1>Oei! Die link bestaat niet</h1>

	<p>Doe je niks aan.</p>

	<button onclick={() => back()}>Ga terug</button>
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

	button {
		font-size: 1.5rem;
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 2rem;
		}

		p,
		button {
			font-size: 1rem;
		}
	}
</style>
