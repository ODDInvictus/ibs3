<script lang="ts">
	import Title from '$lib/components/title.svelte';
</script>

<Title title="Help" />

<h2>Inkoop factuur</h2>
<p>
	Als je een factuur hebt ontvangen moet je deze inboeken in <a
		href="/ongeveer/purchases/create?type=INVOICE"
		target="_blank">factuur inboeken</a
	>. Hier vul je de volgende gegevens in:
</p>
<ol>
	<li>
		<b>Referentie:</b> Een naam zodat je makkelijk kan herkennen waar de factuur voor is. Bijvoorbeeld:
		bierbanken cantus
	</li>
	<li>
		<b>Factuurnummer:</b> Het nummer dat op de factuur staat.
	</li>
	<li>
		<b>Factuurdatum:</b> De datum die op de factuur staat.
	</li>
	<li>
		<b>Betalingstermijn:</b> Het aantal dagen dat je hebt om de factuur te betalen vanaf de factuurdatum.
		Dit staat ook op de factuur.
	</li>
	<li>
		<b>Type:</b> Kies hier voor <i>Factuur</i>
	</li>
	<li>
		<b>Tabel:</b> Splits hier de factuur uit over meerdere posten. Bijvoorbeeld:
		<table class="small striped">
			<tr>
				<th>Omschrijving</th>
				<th>Hoeveelheid</th>
				<th>Prijs</th>
				<th>Grootboek</th>
			</tr>
			<tr>
				<td>Huur bierbanksets</td>
				<td>2</td>
				<td>5</td>
				<td>Cantus</td>
			</tr>
			<tr>
				<td>Borg</td>
				<td>1</td>
				<td>50</td>
				<td>Borg</td>
			</tr>
		</table>
	</li>
</ol>

<h2>Verkoop factuur</h2>

<h2>Declaratie</h2>

<h2>PIN betaling Invictus bankpas</h2>

<style lang="scss">
	table {
		width: fit-content;
	}

	h2 {
		margin-top: 2rem;
	}

	ol {
		margin-left: 2rem;

		li {
			padding: 0.25rem;
		}
	}
</style>
