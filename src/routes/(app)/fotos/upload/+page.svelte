<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { imagePreview } from '$lib/imagePreviewStore';
	import type { PageData } from './$types';
	import './style.scss';

	let input: HTMLInputElement;
	let previewContainer: HTMLDivElement;
	let showImages = false;

	function onChange() {
		const files = input.files;

		if (files && files.length > 0) {
			showImages = true;
			for (const [idx, f] of Array.from(files).entries()) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const div = document.createElement('div');
					div.classList.add('image-preview');

					const btn = document.createElement('button');
					btn.type = 'button';
					btn.textContent = 'Verwijder';
					btn.onclick = () => {
						div.remove();
						console.log(idx);
						removeFileFromFileList(idx);
					};

					div.appendChild(btn);

					const img = document.createElement('img');
					img.src = e.target.result as string;

					img.onclick = () => {
						imagePreview({ image: e.target.result as string });
						console.log('huts');
					};

					div.appendChild(img);
					previewContainer.appendChild(div);
				};
				reader.readAsDataURL(f);
			}
			return;
		}
		showImages = false;
	}

	function removeImages() {
		previewContainer.innerHTML = '';
	}

	function removeFileFromFileList(index) {
		const dt = new DataTransfer();
		const files = input.files!;

		if (files.length === 1) {
			input.value = '';
			return;
		}

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (index !== i) dt.items.add(file); // here you exclude the file. thus removing it.
		}

		input.files = dt.files; // Assign the updates list
	}
</script>

<Title title="Upload fotos" />

<form method="POST">
	<input bind:this={input} on:change={onChange} type="file" name="fotos" multiple />
	<p>{input?.files?.length ?? 0}</p>
	<button class="btn-secondary" type="reset" on:click={removeImages}>Reset</button>
	<button type="submit">Upload</button>
</form>

{#if showImages}
	<div bind:this={previewContainer} id="image-preview-container" />
{:else}
	<p>Hier komen je plaatjes te staan, zodat je kan zien welke je wil uploaden.</p>
{/if}
