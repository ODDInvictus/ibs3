<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { toast } from '$lib/notification';
	import { prompt } from '$lib/prompt';
	import { confirm } from '$lib/confirm';
	import Section from './_section.svelte';
	import { promptSelect } from '$lib/promptSelect';
	import { promptCheckbox } from '$lib/promptCheckbox';

	function testToast(toastType: 'success' | 'danger' | 'warning' | 'info') {
		toast({
			title: `Dit is een ${toastType} toast!`,
			message: 'Je kan hier allerlei dingen in zetten!',
			type: toastType
		});
	}
</script>

<Title title="IBS UI toolkit" />

<Section title="Buttons">
	<button> Button </button>
	<button class="btn-info"> Info button </button>
	<button class="btn-warning"> Warning button </button>
	<button class="btn-danger"> Danger button </button>
	<button class="btn-success"> Success button </button>
	<button class="btn-secondary"> Secondary button </button>
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
