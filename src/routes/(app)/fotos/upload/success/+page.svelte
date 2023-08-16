<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import type { PageData } from './$types';
	import EditIcon from '~icons/tabler/edit.svelte';
	import ArrowBackUp from '~icons/tabler/arrow-back-up.svelte';
	import SaveIcon from '~icons/tabler/device-floppy.svelte';
	import TagIcon from '~icons/mdi/tag-add.svelte';
	import CirclePlus from '~icons/tabler/circle-plus.svelte';

	export let data: PageData;

	type Field = {
		field: string;
		value: string;
	};

	let editFields: Record<number, Field> = {};

	console.log(data);

	$: console.log(editFields);

	function edit(field: string, photo: number) {
		if (editFields[photo] && editFields[photo].field === field) {
			// Discard edit
			editFields[photo].field = '';
			editFields[photo].value = '';
		} else {
			// Start edit
			editFields[photo] = {
				field: field,
				value: ''
			};
		}
	}

	function removeTag(photoId: number, tagId: number) {
		if (tagId == -1) {
			alert('Oei! Dat kan nog niet');
			return;
		}

		const p = data.photos.find((p) => p.id === photoId);

		console.log(`Removing tag ${tagId} from photo ${photoId}!`);

		p?.tags.splice(
			p.tags.findIndex((t) => t.photoTag.id === tagId),
			1
		);

		// @ts-expect-error Kan gewoon niet piepen
		data.photos = data.photos.map((photo) => {
			if (photo.id === photoId) {
				return p;
			} else {
				return photo;
			}
		});
	}

	function addTag(photoId: number) {
		const tagId = parseInt(editFields[photoId].value);

		console.log(editFields[photoId].value);

		if (tagId == -1) {
			alert('Oei! Dat kan nog niet');
			return;
		}

		data.photos = data.photos.map((p) => {
			if (p.id === photoId) {
				const photoTag = data.tags.find((t) => t.id === tagId);

				const tag = { photoTag };

				console.log('Adding tag', tag);

				const tags = p.tags;
				// @ts-expect-error Ja ja
				tags.push(tag);

				p.tags = tags;
			}
			return p;
		});

		editFields[photoId].field = '';
		editFields[photoId].value = '';
	}

	function save(field: string, photo: number) {
		const value = editFields[photo].value;

		if (!value) {
			editFields[photo].field = '';
			return;
		}

		console.log(`Field ${field} of photo ${photo} changed to ${value}!`);

		// find the photo
		for (const p of data.photos) {
			if (p.id === photo) {
				// @ts-ignore
				switch (field) {
					case 'date':
						p.date = new Date(value);
						break;
					case 'name':
						// @ts-expect-error kan gewoon
						p.creator = data.photoCreators.find((c) => c.id === parseInt(value));
						break;
					case 'description':
						p.description = value;
						break;
				}
			}
		}

		editFields[photo].field = '';
		editFields[photo].value = '';
	}
</script>

<Title
	title="Success! Uploaden gelukt"
	shortTitle="Tag foto's"
	underTitle="De backend is nog bezig met het verwerken van alle foto's, maar in de tussentijd kan je wel alvast metadata specificeren."
/>

<div class="image-container">
	{#each data.photos as photo}
		<div class="image">
			<div class="options">
				<table class="equal-width">
					<thead>
						<tr>
							<th colspan="3">Metadata</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Gemaakt door</td>
							{#if editFields[photo.id] && editFields[photo.id].field === 'name'}
								<td>
									<select
										value={photo.creator.id}
										on:change={(e) => {
											if (e) {
												// @ts-ignore
												editFields[photo.id].value = e.target?.value;
											}
										}}
									>
										{#each data.photoCreators as creator}
											<option value={creator.id}>{creator.name}</option>
										{/each}
									</select>
								</td>
								<td>
									<button class="btn-a" on:click={() => edit('name', photo.id)}>
										<i><ArrowBackUp /></i>
									</button>
									<button class="btn-a" on:click={() => save('name', photo.id)}>
										<i><SaveIcon /></i>
									</button>
								</td>
							{:else}
								<td>
									{photo.creator.name}
								</td>
								<td>
									<button class="btn-a" on:click={() => edit('name', photo.id)}>
										<i><EditIcon /></i>
									</button>
								</td>
							{/if}
						</tr>
						<tr>
							<td>Datum</td>
							{#if editFields[photo.id] && editFields[photo.id].field === 'date'}
								<td>
									<input
										type="date"
										value={photo.date?.toISOString().substring(0, 10)}
										on:change={(e) => {
											if (e) {
												// @ts-ignore
												editFields[photo.id].value = e.target?.value;
											}
										}}
									/>
								</td>
								<td>
									<button class="btn-a" on:click={() => edit('date', photo.id)}>
										<i><ArrowBackUp /></i>
									</button>
									<button class="btn-a" on:click={() => save('date', photo.id)}>
										<i><SaveIcon /></i>
									</button>
								</td>
							{:else}
								<td>
									<time datetime={photo.date?.toLocaleDateString('nl')}>
										{photo.date?.toLocaleDateString('nl')}
									</time>
								</td>
								<td>
									<button class="btn-a" on:click={() => edit('date', photo.id)}>
										<i><EditIcon /></i>
									</button>
								</td>
							{/if}
						</tr>
						<tr>
							<td>Beschrijving</td>
							{#if editFields[photo.id] && editFields[photo.id].field === 'description'}
								<td>
									<textarea
										value={photo.description}
										on:change={(e) => {
											if (e) {
												// @ts-ignore
												editFields[photo.id].value = e.target?.value;
											}
										}}
									/>
								</td>
								<td>
									<button class="btn-a" on:click={() => edit('description', photo.id)}>
										<i><ArrowBackUp /></i>
									</button>
									<button class="btn-a" on:click={() => save('description', photo.id)}>
										<i><SaveIcon /></i>
									</button>
								</td>
							{:else}
								<td>
									{photo.description ?? 'Geen beschrijving'}
								</td>
								<td>
									<button class="btn-a" on:click={() => edit('description', photo.id)}>
										<i><EditIcon /></i>
									</button>
								</td>
							{/if}
						</tr>
						<tr>
							<td>Tags</td>
							{#if editFields[photo.id] && editFields[photo.id].field === 'tags'}
								{@const tags = data.tags.filter(
									(t) => photo.tags.find((pt) => pt.photoTag.id === t.id) === undefined
								)}
								<td>
									<select
										value={0}
										on:change={(e) => {
											if (e) {
												// @ts-ignore
												editFields[photo.id].value = e.target?.value;
											}
										}}
									>
										{#each tags as tag}
											<option value={tag.id}>{tag.name}</option>
										{/each}
										<option value="-1">Nieuwe tag aanmaken</option>
									</select>
								</td>
								<td>
									<button class="btn-a" on:click={() => edit('tags', photo.id)}>
										<i><ArrowBackUp /></i>
									</button>
									<button class="btn-a" on:click={() => addTag(photo.id)}>
										<i><CirclePlus /></i>
									</button>
								</td>
							{:else}
								<td>
									{#each photo.tags as tag}
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<span
											role="button"
											tabindex="0"
											on:click={() => removeTag(photo.id, tag.photoTag.id)}
											class="ibs-chip removable">{tag.photoTag.name}</span
										>
									{/each}
								</td>
								<td>
									<button class="btn-a" on:click={() => edit('tags', photo.id)}>
										<i><TagIcon /></i>
									</button>
								</td>
							{/if}
						</tr>
						<tr>
							<td>Mensen</td>
							<td>{photo.peopleTagged.map((p) => p.user.firstName).join(', ')}</td>
							<td><button class="btn-a"><i><EditIcon /></i></button></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="photo">
				<img src="/upload/fotos/{photo.photo}" alt="Foto van {photo.creator.name}" />
			</div>
		</div>

		<hr />
	{/each}
</div>

<style lang="scss">
	$img-height: 300px;

	.image-container {
		display: grid;

		gap: 1rem;

		grid-template-columns: 1fr;
	}

	.image {
		display: grid;
		grid-template-columns: 1fr auto;

		height: $img-height;
	}

	.options {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		min-width: 100%;
		table {
			table-layout: fixed;

			width: 100%;

			textarea {
				width: 100%;
				text-align: start;
			}
		}
	}

	.photo {
		display: flex;
		justify-content: flex-start;

		img {
			height: $img-height;
		}
	}

	.options {
		width: 50%;
	}
</style>
