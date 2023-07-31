<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		if (noGeneration) return;

		const items = document.querySelectorAll(`.elements-${title} > *`) as NodeListOf<HTMLElement>;
		// const code = document.querySelector(`.code-${title} code`) as HTMLElement;
		const table = document.querySelector(`.items-${title}`) as HTMLElement;

		items.forEach((item) => {
			removeClasses(item);

			// if the item has children, add newlines to all children
			if (item.children.length > 0) {
				item.innerHTML = item.innerHTML.replace(/</g, '\n<');

				// also remove classes for children
				item.querySelectorAll('*').forEach((child) => {
					removeClasses(child);
				});
			}

			const html = item.outerHTML;

			const tr = document.createElement('tr');
			const tdCode = document.createElement('td');
			const tdElement = document.createElement('td');
			const code = document.createElement('code');

			code.innerText = html;
			tdCode.appendChild(code);

			tdElement.innerHTML = html;

			tr.appendChild(tdCode);
			tr.appendChild(tdElement);

			table.appendChild(tr);
		});
	});

	function removeClasses(element: Element) {
		element.classList.forEach((c) => {
			// Remove all classes that begin with s- or svelte- or data-svelte
			console.log(c);
			if (c.startsWith('s-') || c.includes('svelte')) {
				element.classList.remove(c);
			}
		});

		if (element.classList.length === 0) {
			// Remove the class=""
			element.removeAttribute('class');
		}
	}

	export let title: string;
	export let noGeneration = false;
</script>

<section>
	<h1>{title}</h1>

	{#if noGeneration}
		<div class="elements-{title} no-generation">
			<slot />
		</div>
	{:else}
		<div class="elements-{title}" style="display:none;">
			<slot />
		</div>

		<table>
			<thead>
				<tr>
					<th>Code</th>
					<th>Element</th>
				</tr>
			</thead>
			<tbody class="items-{title}" />
		</table>
	{/if}
</section>

<style>
	section {
		margin: 1rem;
	}

	.no-generation {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
</style>
