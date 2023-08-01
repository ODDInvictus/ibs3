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

				item.querySelectorAll('*').forEach((child) => {
					removeClasses(child);
				});
			}

			const html = item.outerHTML;
			const svgRegex = new RegExp(/<svg.*<\/svg>/gms);
			const commentRegex = new RegExp(/\<\!\-\-.*\-\-\>/gms);
			const svelteRegex1 = new RegExp(/data-svelte.*\"/gm);

			let text = html;
			text = text.replaceAll(svelteRegex1, '');
			text = text.replaceAll(svgRegex, '"icon"');
			text = text.replaceAll(commentRegex, '');

			const tr = document.createElement('tr');
			const tdCode = document.createElement('td');
			const tdElement = document.createElement('td');
			const code = document.createElement('code');

			code.innerText = text;
			tdCode.appendChild(code);

			tdElement.innerHTML = html;

			tr.appendChild(tdCode);
			tr.appendChild(tdElement);

			table.appendChild(tr);
		});
	});

	function removeClasses(element: Element) {
		element.classList.forEach((c) => {
			console.log(c);
			if (c.startsWith('s-')) {
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

<section id={title}>
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
	<td style="display: none;" />
</section>

<style>
	section {
		margin: 1rem;
	}

	th,
	td {
		width: 50%;
	}

	.no-generation {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
</style>
