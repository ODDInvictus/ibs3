<script lang="ts">
	import '../app.scss';
</script>

<svelte:head>
	<meta name="description" content="IBS is het websysteem voor alles Invictus!" />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://dev.oddinvictus.nl/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Invictus Bier Systeem" />
	<meta property="og:description" content="IBS is het websysteem voor alles Invictus!" />
	<meta property="og:image" content="https://static.oddinvictus.nl/static/icon-512x512.png" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="dev.oddinvictus.nl" />
	<meta property="twitter:url" content="https://dev.oddinvictus.nl/" />
	<meta name="twitter:title" content="Invictus Bier Systeem" />
	<meta name="twitter:description" content="IBS is het websysteem voor alles Invictus!" />
	<meta name="twitter:image" content="https://static.oddinvictus.nl/static/icon-512x512.png" />
</svelte:head>

<div id="content" class="dark">
	<slot />
</div>

<style>
	#content {
		width: 100vw;
		height: 100vh;
	}
</style>
