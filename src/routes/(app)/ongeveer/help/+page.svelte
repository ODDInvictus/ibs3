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
<p>
	Om iemand te factureren maak je een factuur aan onder <a href="/ongeveer/sales/create"
		>Verkopen {'>'} Nieuw factuur aanmaken</a
	>. Hier vul je de volgende gegevens in:
</p>
<ol>
	<li><b>Omschrijving:</b> de omschrijving die op de factuur komt</li>
	<li><b>Referentie:</b> eigen referentie, dit is hoe de factuur heet wanneer je er naar zoekt</li>
	<li><b>Betalingstermijn:</b> aantal dagen</li>
	<li>
		<b>Relatie:</b> voor wie de factuur bedoeld is. Deze naam en addressgegevens indien bekend komen
		op de factuur.
	</li>
	<li>
		<b>T.a.v.:</b> De naam die op de factuur komt. Bijvoorbeeld de naam van een contact persoon bij een
		organizatie
	</li>
</ol>
<p>
	<b>Factuur regels: </b> Hier komen alle regels die op de factuur komen. Je vult hier in per regel:
</p>
<ol>
	<li>
		<b>Aantal:</b> het aantal keer dat deze regel op de factuur komt, bijvoorbeeld bij 5 bier vul je
		hier 5 in.
	</li>
	<li><b>Prijs:</b> het bedrag van 1x deze regel. Bijvoorbeeld de prijs van 1 bier</li>
	<li><b>Omschrijving:</b> omschrijving van de regel, bvb de naam van een product</li>
	<li><b>Grootboek:</b> onder welke grootboekrekening dit valt.</li>
	<li><b>Product:</b> optioneel kan je een regel linken aan een product.</li>
</ol>
<p>
	Hierna is de factuur opgeslagen als concept. Om de factuur als pdf op te slaan ga je naar <a
		href="/ongeveer/sales">Verkoop</a
	>
	en klik je op de factuur die staat aangegeven als <code>(id) - (referentie)</code><br />Controleer
	of alles klopt, want na het verwerken kan je de factuur niet meet bewerken. Klik op
	<code>verwerken</code> Vanwege de factuurdatum en betalingstermijn die nu vast staan moet je de factuur
	op de zelfde dag nog versturen.
</p>
<h3>Een lid met saldo laten betalen</h3>
<p>
	Om een lid een factuur met saldo te laten betalen maak je een handmatige saldo transactie. Dit doe
	je bij <a href="/ongeveer/saldo/transactions/create">Saldo {'>'} Transactie maken</a>
	Vul hier in:
</p>
<ol>
	<li><b>Van:</b> het betreffende lid</li>
	<li><b>Naar:</b> Invictus</li>
	<li>
		<b>Beschrijving:</b> waar het lid voor betaald. Zonder ze factuur op te sturen is deze omschijving
		het enige wat het lid ziet, dus zorg dat het duidelijk is.
	</li>
	<li><b>Bedrag:</b> het totaal van de factuur</li>
</ol>
<p>
	Ga vervolgens naar het transactie overzicht <a href="/ongeveer/saldo/transactions"
		>Saldo {'>'} Transacties overzicht</a
	>
	en klik op de zojuist aangemaakt transactie,deze staat bovenaan en klik op <code>Match</code><br
	/>Maak een regel en vul hier een omschrijving in en het bedrag van de factuur. Selecteer bij
	boekstuk de factuur en klik op opslaan. De factuur is nu betaald en gematcht.
</p>

<h2>PIN betaling Invictus bankpas</h2>

<h3>Banktransacties uploaden</h3>
<p>
	Eens in de zoveel tijd moet je alle pin transacties synchroniseren met ongeveer. Dit doe je door
	te navigeren naar <a href="/ongeveer/bank/upload">Bank {'>'} Upload banktransacties</a>. Log in
	bij Revolut en exporteer alle transacties (het maakt niet uit als deze al eerder zijn geupload)
	als csv en upload deze.
</p>

<h3>Aankopen inboeken</h3>
<p>
	Zorg dat je betalngsbewijzen hebt van alle transacties. Dit kan een factuur zijn zoals onder
	inkoop factuur of een pin bon. Ga vervolgens naar <a href="/ongeveer/purchases/create"
		>Inkoop {'>'} Factuur inboeken</a
	>. Vul hier in:
</p>
<ol>
	<li><b>Referentie:</b> een omschijving van de aankoop</li>
	<li><b>Factuur datum:</b> datum van de aankoop</li>
	<li>
		<b>Betalingstermijn:</b> dit maakt niet uit gezien de inkoop al betaald is. Vul hier iets in als
		30 ofzo.
	</li>
	<li><b>Type:</b> aankoop</li>
</ol>
<p>
	Vul vervolgens alle regels in zoals beschreven in het kopje 'Inkoop factuur' en upload het
	bonnetje onder bijlagen.
</p>

<h3>Transactie matchen</h3>
<p>
	Ga naar <a href="/ongeveer/bank">Bank</a> en selecteer de juist transactie. Je kan nu een referentie
	en relatie invullen, dit is alleenmaar zodat je de transactie makkelijker terug kan vinden. Maak een
	nieuwe regel aan en vul daar in:
</p>
<ol>
	<li><b>Omschrijving:</b> omschrijving van wat er is gekocht</li>
	<li><b>Bedrag:</b> het bedrag van de transactie</li>
	<li><b>Boekstuk:</b> selecteer de aankoop die je hebt aangemaakt</li>
	<li><b>Voeg toe aan saldo:</b> nee</li>
</ol>
<p>De PIN betaling is nu ingeboekt en gematcht.</p>

<h2>Declaratie</h2>
<p>
	Leden kunnen declaraties doen in <a href="/financieel/declaraties/indienen"
		>Financieel {'>'} Declaratie indienen</a
	>. Deze komen autmatisch in je <a href="/ongeveer/purchases">inkopen overzicht</a>. Het is dus
	belangrijk dit in de gaten te houden.<br />Klik in dit overzicht op de declaratie en klik op
	<code>bewerken</code>. Controleer de declaratie en split deze uit over meerdere posten indien
	nodig. Als je iets veranderd hebt klik dan eerst op <code>opslaan</code>.<br />Klik vervolgens op
	<code>Goedkeuren en transactie maken</code>. De transactie wordt gemaakt en automatich gematcht.
	Wanneer je de declaratie afwijzt verdwijnt deze uit je inkopen overzicht en zal als afgewezen
	komen in het <a href="/financieel/declaraties">declaratieoverzicht</a> van de indiener.
</p>

<h2>Steeplijst verwerken</h2>
<p>
	Ga naar <a href="/ongeveer/tallysheet/create">Verkoop {'>'} Streeplijst verwerken</a> Vul hier
	alles in. Zorg ervoor dat je geen lege regels meer hebt en klik dan op <code>opslaan</code>.<br />
	Hierna kan je de streeplijst bewerken door de streeplijst te zoeken in
	<a href="/ongeveer/tallysheet">het overzicht</a> en naar de automatisch aangemaakte boekstukken te
	gaan en deze te bewerken. Als je alles hebt gecontroleerd zoek je de steeplijst in het overzicht
	klik je op <code>Maak transacties</code>. Dit matcht en maakt automatisch saldo transacties.<br
	/>Je kan ook (een deel van) de boekstukken handmatig matchen als bijvoorbeeld een streeplijst niet
	met saldo is betaald. Match dan eerst het deel dat niet op saldo gaat en klik dan op
	<code>Transacties maken</code>
</p>

<style lang="scss">
	table {
		width: fit-content;
	}

	h2,
	h3 {
		margin-top: 2rem;
	}

	ol {
		margin-left: 2rem;

		li {
			padding: 0.25rem;
		}
	}
</style>
