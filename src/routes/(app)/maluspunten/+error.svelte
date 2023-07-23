<script>
	import Title from '$lib/components/title.svelte';
	import knoppers from '$lib/assets/knoppers.png';
</script>

<Title title="Maluspunten" />

<p>Leuk geprobeerd hoor</p>

<p>Hier heb je een knopper</p>

<div><img src={knoppers} alt="Knopper" /></div>

<style>
	p {
		text-align: center;
	}

	div {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
	}
</style>
