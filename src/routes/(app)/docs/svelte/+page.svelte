<script>
	import Title from '$lib/components/title.svelte';
	import Section from './_section.svelte';
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

<hr />
