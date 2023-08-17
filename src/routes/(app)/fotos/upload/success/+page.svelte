<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import type { PageData } from './$types';
	import EditIcon from '~icons/tabler/edit.svelte';
	import ArrowBackUp from '~icons/tabler/arrow-back-up.svelte';
	import SaveIcon from '~icons/tabler/device-floppy.svelte';
	import TagIcon from '~icons/mdi/tag-add.svelte';
	import CirclePlus from '~icons/tabler/circle-plus.svelte';
	import UserPlus from '~icons/tabler/user-plus.svelte';
	import CalenderPlus from '~icons/tabler/calendar-plus.svelte';
	import { prompt } from '$lib/prompt';
	import { toast } from '$lib/notification';
	import { imagePreview } from '$lib/imagePreviewStore';
	import { stripMarkdown } from '$lib/utils';
	import { getDutchMonth } from '$lib/dateUtils';

	export let data: PageData;

	type Field = {
		field: string;
		value: string;
	};

	let editFields: Record<number, Field> = {};

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

	async function createTag(newTag: string, photoId: number) {
		const tag = await fetch('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ type: 'new_tag', tag: newTag })
		}).catch((err) => {
			toast({
				title: 'Oei!',
				message: err.message,
				type: 'danger'
			});
		});

		if (tag) {
			// Now add it to the local options
			const res = await tag.json();
			data.tags = [...data.tags, res.data];

			// And add it to the photo
			data.photos = data.photos.map((p) => {
				if (p.id === photoId) {
					const photoTag = data.tags.find((t) => t.id === res.data.id);

					const tag = { photoTag };

					const tags = p.tags;
					// @ts-expect-error Ja ja
					tags.push(tag);

					p.tags = tags;
				}
				return p;
			});

			editFields[photoId].field = '';
			editFields[photoId].value = '';

			toast({
				title: 'Gelukt!',
				message: 'De tag is aangemaakt',
				type: 'success'
			});
		}
	}

	function addTag(photoId: number) {
		const tagId = parseInt(editFields[photoId].value);

		if (isNaN(tagId) || tagId == -1 || tagId == -2) {
			editFields[photoId].field = '';
			editFields[photoId].value = '';
			return;
		}

		data.photos = data.photos.map((p) => {
			if (p.id === photoId) {
				const photoTag = data.tags.find((t) => t.id === tagId);

				const tag = { photoTag };

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
					case 'people':
						const newArr: any[] = [];

						(value as unknown as string[]).forEach((personSelected) => {
							const person = data.people.find((p) => p.ldapId === personSelected);

							newArr.push({ user: person });
							p.peopleTagged = newArr;
						});
						break;
					case 'activity':
						// @ts-expect-error kan gewoon
						p.activity = data.activities.find((a) => a.id === parseInt(value));
						break;
				}
			}
		}

		editFields[photo].field = '';
		editFields[photo].value = '';
	}

	let linkAllPhotosToActivity = true;
	let selectedActivityAll = data.activities[0].id;

	function saveActivity() {
		if (linkAllPhotosToActivity) {
			const activity = data.activities.find((a) => a.id === selectedActivityAll);

			if (!activity) return;
			data.photos = data.photos.map((photo) => {
				photo.activity = activity;
				return photo;
			});
		}
	}
</script>

<Title
	title="Success! Uploaden gelukt"
	shortTitle="Tag foto's"
	underTitle="De backend is nog bezig met het verwerken van alle foto's, maar in de tussentijd kan je wel alvast metadata specificeren."
/>

<div class="top">
	<div class="activity-options">
		<label for="link-all-to-activity">Alle foto's zijn van dezelfde activiteit?</label>
		<input type="checkbox" id="link-all-to-activity" bind:checked={linkAllPhotosToActivity} />
		{#if linkAllPhotosToActivity}
			<select bind:value={selectedActivityAll}>
				{#each data.activities as activity}
					<option value={activity.id}
						>{`${stripMarkdown(activity.name)} (${getDutchMonth(
							activity.endTime
						)} ${activity.endTime.getFullYear()})`}</option
					>
				{/each}
			</select>
			<button class="btn-a" on:click={saveActivity}>
				<i><SaveIcon /></i>
			</button>
		{/if}
	</div>
	<small class="tip">Tip: Klik op een plaatje om hem groter te maken.</small>
</div>

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
										value={photo.creator?.id}
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
									{photo.creator?.name}
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
										value={-1}
										on:change={(e) => {
											if (e) {
												// @ts-expect-error Bestaat gewoon
												if (e.target?.value == -2) {
													prompt({
														title: 'Nieuwe tag',
														message: 'Wat is de naam van de nieuwe tag?',
														cb: async (newTag) => {
															await createTag(newTag, photo.id);
														}
													});
												}

												// @ts-ignore
												editFields[photo.id].value = e.target?.value;
											}
										}}
									>
										<option value={-1}>Selecteer een tag</option>
										<option value={-2}>Nieuwe tag aanmaken</option>
										{#each tags as tag}
											<option value={tag.id}>{tag.name}</option>
										{/each}
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
									{#if photo.tags && photo.tags.length > 0}
										{#each photo.tags as tag}
											<!-- svelte-ignore a11y-click-events-have-key-events -->
											<span
												role="button"
												tabindex="0"
												on:click={() => removeTag(photo.id, tag.photoTag.id)}
												class="ibs-chip removable">{tag.photoTag.name}</span
											>
										{/each}
									{:else}
										Geen tags geselecteerd
									{/if}
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
							{#if editFields[photo.id] && editFields[photo.id].field === 'people'}
								<td>
									<select
										multiple
										on:change={(e) => {
											if (e) {
												// @ts-expect-error Kijk heel grappig, maar SvelteKit ondersteund dus geen TS hiero, dus we doen het ermaar mee
												const selectedElements = Array.from(e.target?.selectedOptions ?? []);

												// @ts-expect-error Idem dito
												const selection = selectedElements.map((el) => el.value);

												// @ts-expect-error Idem dito
												editFields[photo.id].value = selection;
											}
										}}
									>
										{#each data.people as person}
											{@const selected =
												photo.peopleTagged.find((pt) => pt.user.ldapId === person.ldapId) !==
												undefined}
											<option {selected} value={person.ldapId}>{person.firstName}</option>
										{/each}
									</select>
								</td>
								<td>
									<button class="btn-a" on:click={() => edit('people', photo.id)}>
										<i><ArrowBackUp /></i>
									</button>
									<button class="btn-a" on:click={() => save('people', photo.id)}>
										<i><CirclePlus /></i>
									</button>
								</td>
							{:else}
								<td>
									{photo.peopleTagged.length === 0
										? 'Geen mensen getagd'
										: photo.peopleTagged.map((p) => p.user.firstName).join(', ')}
								</td>
								<td>
									<button class="btn-a" on:click={() => edit('people', photo.id)}>
										<i><UserPlus /></i>
									</button>
								</td>
							{/if}
						</tr>
						<tr>
							<td>Activiteit</td>
							{#if editFields[photo.id] && editFields[photo.id].field === 'activity'}
								<td>
									<select
										value={photo.activity?.id ?? -1}
										on:change={(e) => {
											if (e) {
												if (e.target?.value == -1) return;

												// @ts-ignore
												editFields[photo.id].value = e.target?.value;
											}
										}}
									>
										<option value={-1}>Selecteer een activiteit</option>
										{#each data.activities as activity}
											<option value={activity.id}
												>{`${stripMarkdown(activity.name)} (${getDutchMonth(
													activity.endTime
												)} ${activity.endTime.getFullYear()})`}</option
											>
										{/each}
									</select>
								</td>
								<td>
									<button class="btn-a" on:click={() => edit('activity', photo.id)}>
										<i><ArrowBackUp /></i>
									</button>
									<button class="btn-a" on:click={() => save('activity', photo.id)}>
										<i><SaveIcon /></i>
									</button>
								</td>
							{:else}
								<td>{photo.activity?.name ?? 'Geen activiteit gelinkt'}</td>
								<td>
									<button class="btn-a" on:click={() => edit('activity', photo.id)}>
										<i><CalenderPlus /></i>
									</button>
								</td>
							{/if}
						</tr></tbody
					>
				</table>
			</div>
			<div class="photo">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					role="button"
					tabindex="0"
					on:click={() => imagePreview({ image: '/upload/fotos/' + photo.photo })}
				>
					<img src="/upload/fotos/{photo.photo}" alt="Foto van {photo.creator?.name}" />
				</div>
			</div>
		</div>

		<hr />
	{/each}
</div>

<style lang="scss">
	$img-height: 300px;
	$img-width: 300px;

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

	.top {
		display: flex;
		width: 100%;
		height: 2.5rem;
		line-height: 2.5rem;
		justify-content: space-between;
		margin-bottom: 1rem;

		.activity-options {
			display: flex;
			align-items: center;

			input[type='checkbox'],
			button {
				margin: 0 0.5rem 0 0.5rem;
			}
		}
	}
</style>
