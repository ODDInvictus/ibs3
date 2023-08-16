<script>
	import { page } from '$app/stores';
</script>

<div id="main">
	<h1 class="error">{$page?.error?.message}</h1>
	<p>
		Daar is toch echt wel iets flink mis gegaan. Ik zou je een strafbak hiervoor geven maar helaas
		kan dat nog niet automatisch. Geluksvogel.
	</p>
</div>

<style>
	#main {
		width: 100%;
		height: calc(100vh - 12rem);

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.error {
		font-size: 2.5rem;
		margin: 0;
	}
</style>
