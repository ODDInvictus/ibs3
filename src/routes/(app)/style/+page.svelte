<script>
	import Title from '$lib/components/title.svelte';
</script>

<Title title="IBS UI toolkit" />

<section>
	<h2>Typography</h2>

	<div>
		<div>
			<code>&lt;h1&gt;Dit is een titel in h1&lt;/h1&gt;</code>
			<code>&lt;h2&gt;Dit is een titel in h2&lt;/h2&gt;</code>
			<code>&lt;h3&gt;Dit is een titel in h3&lt;/h3&gt;</code>
			<code>&lt;h4&gt;Dit is een titel in h4&lt;/h4&gt;</code>
		</div>
		<div>
			<h1>Dit is een titel in h1</h1>
			<h2>Dit is een titel in h2</h2>
			<h3>Dit is een titel in h3</h3>
			<h4>Dit is een titel in h4</h4>
			<h5>Dit is een titel in h5</h5>
			<h6>Dit is een titel in h6 (meer een ondertitel)</h6>
			<p>Dit is een paragraph</p>
		</div>
	</div>
</section>

<hr />

<section>
	<h2>Knoppen</h2>

	<div>
		<div>
			<code> &lt;button&gt; Button &lt;/button&gt; </code>
		</div>
		<div>
			<button> Button </button>
			<button class="btn-info"> Info button </button>
			<button class="btn-warning"> Warning button </button>
			<button class="btn-danger"> Danger button </button>
			<button class="btn-success"> Success button </button>
			<button class="btn-secondary"> Secondary button </button>
		</div>
	</div>
</section>

<hr />

<section>
	<h2>Form</h2>
	<div>
		<div>code enzo</div>
		<div>
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
		</div>
	</div>
</section>

<hr />

<style lang="scss">
	section {
		margin: 1rem 2rem;

		& > div {
			display: grid;
			grid-template-columns: 1fr 1fr;

			& > div {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				gap: 1rem;
			}
		}

		h2 {
			text-decoration: underline;
		}
	}
</style>
