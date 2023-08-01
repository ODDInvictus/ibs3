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

<Title title="IBS UI toolkit" />

<div class="table-of-contents">
	<p>Spring gelijk naar:</p>
	{@html contents}
</div>

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
