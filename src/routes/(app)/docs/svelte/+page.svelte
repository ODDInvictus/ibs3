<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { toast } from '$lib/notification';
	import { prompt } from '$lib/prompt';
	import { confirm } from '$lib/confirm';
	import Section from './_section.svelte';
	import { promptSelect } from '$lib/promptSelect';
	import InformationCircle from '~icons/tabler/info-circle';
	import { promptCheckbox } from '$lib/promptCheckbox';
	import { onMount } from 'svelte';
	import Table from '$lib/components/table.svelte';

	function testToast(toastType: 'success' | 'danger' | 'warning' | 'info') {
		toast({
			title: `Dit is een ${toastType} toast!`,
			message: 'Je kan hier allerlei dingen in zetten!',
			type: toastType
		});
	}

	let contents = '';

	onMount(() => {
		const sections = document.querySelectorAll('section');

		sections.forEach((section) => {
			contents += `
				<a href="#${section.id}">${section.id}</a>
			`;
		});
	});
</script>

<Title
	title="IBS UI toolkit"
	underTitle="Gegenereerde documentatie voor onze UI components. Deze pagina zal niet zo best werken op mobiel"
/>

<div class="table-of-contents">
	<p>Spring gelijk naar:</p>
	{@html contents}
</div>

<Section title="Helpers" noGeneration>
	<p>Er zijn nog een paar veel gebruikte classes hieronder beschreven</p>
	<table class="equal-width striped">
		<thead>
			<tr>
				<th>Class</th>
				<th>Functie</th>
				<th>Uitleg</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th><code>.center</code></th>
				<td><code>display: flex; justify-content: center; align-items: center;</code></td>
				<td>Centreer die div's!</td>
			</tr>

			<tr>
				<th><code>.column</code></th>
				<td><code>flex-direction: column;</code></td>
				<td>Ja gewoon column</td>
			</tr>

			<tr>
				<th><code>.mt-[1-20]</code></th>
				<td><code>margin-top: [i * 0.25]rem;</code></td>
				<td>
					Net zoals in tailwind, bestaan er een boel margin helpers. <code>.mt-4</code> staat voor margin-top:
					1rem; Je kan ipv mt ook [mb|ml|mr|mx|my|m] gebruiken
				</td>
			</tr>

			<tr>
				<th><code>.pt=[1-20]</code></th>
				<td><code>padding-top: [i * 0.25]rem;</code></td>
				<td>Idem dito, maar dan met padding-*</td>
			</tr>
		</tbody>
	</table>
</Section>

<Section title="Tables">
	<table class="small">
		<thead>
			<tr>
				<th>Naam</th>
				<th>Strafbakken</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Niels</td>
				<td>38</td>
			</tr>
			<tr class="highlight">
				<td>Naut</td>
				<td>50</td>
			</tr>
			<tr>
				<td>Daniel</td>
				<td>12</td>
			</tr>
		</tbody>
	</table>

	<table class="equal-width striped">
		<thead>
			<tr>
				<th>Lorem</th>
				<th>Ipsum</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td
					>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur rem sit harum
					veritatis illum provident molestiae, quia earum inventore alias dicta corporis officiis
					consectetur ratione sapiente eos temporibus adipisci quis?</td
				>
				<td>38</td>
			</tr>
			<tr>
				<td>nog een cel</td>
				<td>38</td>
			</tr>
			<tr>
				<td>nog een cel</td>
				<td>38</td>
			</tr>
		</tbody>
	</table>
</Section>

<Section title="Table (extras)" noGeneration>
	<h2>Table opties</h2>
	<p>Op de tabel kan je een aantal dingen doen</p>
	<table class="equal-width striped">
		<thead>
			<tr>
				<th>Class</th>
				<th>Element</th>
				<th>Functie</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th><code>.equal-width</code></th>
				<td>table</td>
				<td>Maakt alle kolommen even breed</td>
			</tr>

			<tr>
				<th><code>.striped</code></th>
				<td>table</td>
				<td>Maakt de rijen om en om een beetje donkerder</td>
			</tr>

			<tr>
				<th><code>.small</code></th>
				<td>table</td>
				<td>Halveert de cel hoogte</td>
			</tr>

			<tr>
				<th><code>.not-full-width</code></th>
				<td>table</td>
				<td>Forceert geen <code>width: 100%;</code></td>
			</tr>

			<tr>
				<th><code>.highlight</code></th>
				<td>tr</td>
				<td>Laat een rij eruit springen</td>
			</tr>
		</tbody>
	</table>

	<h2>Table component</h2>
	<p>Hiermee kan je een standaard tabel genereren, inclusief actie icoontjes</p>

	Kijk even in<code>$lib/components/Table.svelte</code> hoe je dit moet gebruiken
	<Table
		tableId="huts"
		rows={[
			['1', 'Niels', '38'],
			['2', 'Naut', '50'],
			['3', 'Daniel', '12']
		]}
		actions={[
			{
				type: 'edit',
				action: () => {},
				title: 'Bewerken'
			},
			{
				type: 'delete',
				action: () => {},
				title: 'Verwijderen'
			}
		]}
		columns={['Naam', 'Strafbakken', 'Acties']}
	/>
</Section>

<Section title="Cards">
	<div class="ibs-card"><p class="ibs-card--content">Meest simpele card</p></div>

	<div class="ibs-card outline"><p class="ibs-card--content">Card met outline</p></div>

	<div class="ibs-card">
		<img class="ibs-card--image" src="https://picsum.photos/500/200" alt="plaatje" />
		<h2 class="ibs-card--title">Card met plaatje en tekst</h2>
		<p class="ibs-card--content">
			Het is het best als je plaatje 5:2 is, anders wordt er een stuk afgeknipt. Lorem ipsum dolor
			sit amet consectetur adipisicing elit. Rem fugit quis, officiis perferendis voluptates saepe
			sapiente voluptas ea dolores cumque omnis vel quibusdam,
		</p>
	</div>

	<div class="ibs-card outline">
		<h2 class="ibs-card--title">Card met tekst en knopjes!</h2>
		<div class="ibs-card--content">
			<p>Iets wat handig is om te onthouden is dat deze subclasses niet verplicht zijn.</p>
			<br />
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem fugit quis, officiis
				perferendis voluptates saepe sapiente voluptas ea dolores cumque omnis vel quibusdam,
			</p>
		</div>

		<div class="ibs-card--buttons">
			<button> Actie 1 </button>
			<button class="btn-secondary">Actie 2</button>
		</div>
	</div>

	<div class="ibs-card outline">
		<img class="ibs-card--image" src="https://picsum.photos/500/200" alt="plaatje" />
		<h2 class="ibs-card--title">Card met een tabel</h2>

		<p class="ibs-card--row">
			<i>
				<InformationCircle />
			</i>
			Met icon
		</p>
		<p class="ibs-card--row">Zonder icon</p>
		<p class="ibs-card--row">Zonder icon</p>

		<p class="ibs-card--content">
			Gebruik ook altijd content als je rows gebruikt! Daarnaast, row komt eerst
		</p>
	</div>
</Section>

<Section title="Buttons">
	<button> Button </button>
	<button class="btn-info"> Info button </button>
	<button class="btn-warning"> Warning button </button>
	<button class="btn-danger"> Danger button </button>
	<button class="btn-success"> Success button </button>
	<button class="btn-secondary"> Secondary button </button>
	<button class="btn-a"> Button dat eruit ziet als een anchor tag </button>
</Section>

<hr />

<Section title="Typography">
	<h1>Dit is een heading in h1</h1>
	<h2 style="text-decoration: none;">Dit is een heading in h2</h2>
	<h3>Dit is een heading in h3</h3>
	<h4>Dit is een heading in h4</h4>
	<h5>Dit is een heading in h5</h5>
	<h6>Dit is een heading in h6</h6>
	<p>Dit is een paragraph</p>

	<a href="/docs/svelte">Dit is een anchor</a>
</Section>

<Section title="Form">
	<input type="text" placeholder="text" />
	<input type="number" placeholder="number" />
	<input type="password" placeholder="password" />
	<input type="email" placeholder="email" />

	<textarea placeholder="textarea" />

	<input type="checkbox" />
	<input type="checkbox" checked />

	<select>
		<option>option 1</option>
		<option>option 2</option>
		<option>option 3</option>
	</select>

	<input type="radio" />

	<input type="file" />

	<input type="date" />

	<input type="time" />

	<input type="datetime-local" />

	<input type="color" />

	<input type="range" />
</Section>

<Section title="HR">
	<hr />

	<hr class="hr-light" />
</Section>

<Section title="Toasts" noGeneration>
	<button class="btn-info" on:click={() => testToast('info')}> Klik voor info toast </button>
	<button class="btn-danger" on:click={() => testToast('danger')}> Klik voor danger toast </button>
	<button class="btn-warning" on:click={() => testToast('warning')}>
		Klik voor warning toast
	</button>
	<button class="btn-success" on:click={() => testToast('success')}>
		Klik voor success toast
	</button>
</Section>

<Section title="Confirm, Prompt, Select, etc." noGeneration>
	<button
		class="btn-info"
		on:click={() =>
			prompt({
				title: 'Dit is een prompt',
				message: 'Dit is een prompt message',
				cb: async () => {}
			})}
	>
		Klik hier voor prompt()
	</button>

	<button
		class="btn-info"
		on:click={() =>
			confirm({
				title: 'Dit is een confirm',
				message: 'Dit is een confirm message',
				cb: async () => {}
			})}
	>
		Klik hier voor confirm()
	</button>

	<button
		class="btn-info"
		on:click={() =>
			promptSelect({
				title: 'Dit is een promptSelect',
				message: 'Dit is een promptSelect message',
				options: ['option 1', 'option 2', 'option 3'],
				cb: async () => {}
			})}
	>
		Klik hier voor promptSelect()
	</button>

	<button
		class="btn-info"
		on:click={() =>
			promptCheckbox({
				title: 'Dit is een promptCheckbox',
				message: 'Dit is een promptCheckbox message',
				value: true,
				cb: async () => {}
			})}
	>
		Klik hier voor promptCheckbox()
	</button>
</Section>

<hr />

<style>
	.table-of-contents {
		display: flex;
		flex-direction: column;
	}
</style>
