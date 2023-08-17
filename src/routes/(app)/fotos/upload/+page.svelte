<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';
	import { imagePreview } from '$lib/imagePreviewStore';
	import './style.scss';
	import type { PageData } from './$types';
	import { toast } from '$lib/notification';
	import { string } from 'zod';

	export let data: PageData;

	let creator: string = data.user.ldapId;

	let input: HTMLInputElement;
	let previewContainer: HTMLDivElement;
	let submit: HTMLButtonElement;

	let images: FileList | null;

	function onChange() {
		images = input.files;
	}

	function removeImages() {
		previewContainer.innerHTML = '';
	}

	function removeImage(name: string) {
		if (!images) return;

		if (images && images.length === 1) {
			input.value = '';
			images = null;
			return;
		}

		let arr = Array.from(images);

		for (const f of arr) {
			console.log(f, name);
			if (f.name === name) {
				arr = arr.filter((file) => file.name !== name);
				break;
			}
		}
		const dt = new DataTransfer();

		arr.forEach((f) => dt.items.add(f));

		input.files = dt.files;
		images = dt.files;
	}
</script>

<Title
	title="Upload fotos"
	underTitle="Hier kan je foto's uploaden van Invictus. Doe dit alsjeblieft op desktop, of in ieder geval met goed internet, aangezien het echt een bakbeest van een proces is."
/>

<form
	method="POST"
	class="image-upload--form"
	enctype="multipart/form-data"
	use:enhance={() => {
		// Disable the button
		submit.disabled = true;
		submit.classList.add('btn-disabled');

		return ({ result, update }) => {
			console.log(result);
			if (result.type === 'failure') {
				const msg = result.data?.message ?? 'Er is iets misgegaan';

				toast({
					title: 'Fotos uploaden mislukt',
					// @ts-ignore
					message: msg,
					type: 'danger'
				});
			} else {
				update();
			}
		};
	}}
>
	<div class="buttons">
		<label class="button btn-info" for="fotos">Selecteer fotos</label>
		<input
			bind:this={input}
			on:change={onChange}
			accept="image/*"
			type="file"
			id="fotos"
			name="fotos"
			multiple
			required
		/>
		<button class="btn-danger" type="reset" on:click={removeImages}>Reset</button>
		<button class="btn-primary" type="submit" bind:this={submit}>Upload</button>
		{#if submit && submit.disabled}
			<p>Bezig met uploaden, je wordt doorgestuurd zodra dit klaar is.</p>
		{/if}
	</div>

	<div class="creator">
		<label for="creator">Wie heeft deze fotos gemaakt?</label>
		<select id="creator" name="creator" bind:value={creator}>
			{#each data.users as u}
				<option value={u.ldapId}>{u.firstName}</option>
			{/each}
			<option value={'other'}>Anders, namelijk...</option>
		</select>

		{#if creator === 'other'}
			<input
				type="text"
				id="creator"
				name="creator-other"
				placeholder="Voor- en achternaam"
				required
			/>
		{/if}
	</div>
</form>

<div bind:this={previewContainer} id="image-preview-container">
	{#if !images || images.length === 0}
		<p>Geen fotos geselecteerd</p>
	{:else}
		<p>{images.length} {images.length === 1 ? 'foto' : 'fotos'} geselecteerd!</p>
		<p>Verwijder foto's die je niet wil uploaden, zodra je klaar bent klik dan op upload!</p>
		<small>(Je kan op een foto klikken om hem op ware grootte te bekijken)</small>
		{#each images as file}
			{@const url = URL.createObjectURL(file)}
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<div class="image-upload--preview">
				<button type="button" on:click={() => removeImage(file.name)}>Verwijder</button>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<img src={url} alt="plaatje" on:click={() => imagePreview({ image: url })} />
			</div>
		{/each}
	{/if}
</div>
