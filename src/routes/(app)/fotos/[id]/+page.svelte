<script lang="ts">
	import { enhance } from '$app/forms'
	import ProfileIcon from '$lib/components/profile-icon.svelte'
	import Title from '$lib/components/title.svelte'
	import { formatDateHumanReadable, formatDateTimeHumanReadable } from '$lib/dateUtils'
	import { imagePreview } from '$lib/imagePreviewStore'
	import { toast } from '$lib/notification'
	import { promptSelect } from '$lib/promptSelect'
	import { confirm } from '$lib/confirm'
	import type { PageData } from './$types'
	import Star from '~icons/tabler/star'

	interface Props {
		data: PageData
	}

	let { data = $bindable() }: Props = $props()

	let rating = $state(data.avgRating ?? 0)
	let starHovered = $state(rating)

	async function rate() {
		let newRating = starHovered

		await fetch('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				type: 'rating',
				rating: newRating,
			}),
		})
			.then(res => res.json())
			.then(res => {
				if (res.success) {
					rating = newRating
					starHovered = newRating
					data.avgRating = res.data
				} else {
					toast({
						title: 'Opslaan mislukt',
						message: res.message,
						type: 'danger',
					})
				}
			})
	}

	async function tag() {
		await promptSelect({
			title: 'Tag toevoegen',
			message: 'Selecteer een tag',
			options: (data.tags || []).map(tag => ({
				key: tag.name,
				value: String(tag.id),
			})),
			cb: async val => {
				if (!val) return

				console.log(val)

				await fetch('', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						type: 'tag',
						tag: val,
					}),
				})
					.then(res => res.json())
					.then(res => {
						if (res.success) {
							if (data.photo && data.photo.tags) data.photo.tags = [res.data, ...data.photo?.tags]
							data.tags = data.tags?.filter(t => {
								return t.id !== res.data.photoTag.id
							})
						} else {
							toast({
								title: 'Opslaan mislukt',
								message: res.message,
								type: 'danger',
							})
						}
					})
			},
		})
	}

	async function removeTag(tid: number) {
		await confirm({
			title: 'Tag verwijderen',
			message: 'Weet je zeker dat je deze tag wilt verwijderen?',
			cb: async val => {
				if (val) {
					fetch('', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							type: 'remove-tag',
							tag: tid,
						}),
					})
						.then(res => res.json())
						.then(res => {
							if (res.success) {
								if (data.photo && data.photo.tags) data.photo.tags = data.photo?.tags.filter(t => t.photoTag.id !== tid) ?? []
								if (data.tags) data.tags = [...data.tags, res.data]
							} else {
								toast({
									title: 'Opslaan mislukt',
									message: res.message,
									type: 'danger',
								})
							}
						})
				}
			},
		})
	}
</script>

{#if !data.photo}
	<Title title="Foto niet gevonden" />
{:else}
	<Title
		shortTitle={!data.photo.description ? `Foto ${data.photo.id}` : `${data.photo.description} - Foto`}
		title={data.photo.description ? `${data.photo.description}` : `Foto ${data.photo.id}`} />

	<div class="root">
		<div class="details-container">
			<hr />

			<div>
				<h2>Details</h2>
				<p>Beschrijving: {data.photo.description}</p>
				<p>Gemaakt door: {data.photo.creator?.firstName}</p>
				{#if data.photo.date}
					<p>Datum: {formatDateHumanReadable(data.photo.date)}</p>
				{/if}
				<p>
					Invicti in deze foto:
					{#if data.photo.peopleTagged.length === 0}
						niemand
					{:else}
						{#each data.photo.peopleTagged as person}
							<a href="/leden/{person.user.ldapId}">{person.user.firstName}</a>&nbsp;
						{/each}
					{/if}
				</p>
				<p class="mb-1">Tags:</p>
				{#each data.photo.tags as tag}
					<span onclick={() => removeTag(tag.photoTag.id)} class="ibs-chip removable">
						{tag.photoTag.name}
					</span>
				{/each}
				{#if data.photo.tags && data.photo.tags.length > 0}
					<br />
				{/if}
				<button onclick={tag} class="btn-a">Toevoegen</button>
			</div>

			<div class="rating-container">
				<hr />
				<h2>Wat vind je van deze foto?</h2>
				<div class="stars" data-hovered={starHovered}>
					{#each Array.from(Array(5).keys()) as idx}
						<i
							onfocus={() => (starHovered = idx + 1)}
							onmouseover={() => (starHovered = idx + 1)}
							onfocusout={() => (starHovered = rating)}
							onmouseleave={() => (starHovered = rating)}
							onclick={rate}
							data-filled={starHovered >= idx + 1}><Star /></i>
					{/each}
				</div>
				<small>
					{#if isNaN(data.avgRating)}
						Nog geen stemmen. Wees de eerste!
					{:else}
						Gemiddelde mening: {data.avgRating}
					{/if}
				</small>
			</div>

			<div class="quality-container">
				<hr />

				<h2>Kwaliteit</h2>
				<a href="?quality=klein" class="btn-a">Klein</a>
				<a href="?quality=normaal" class="btn-a">Normaal</a>
				<a href="?quality=origineel" class="btn-a">Origineel</a>
			</div>
			<small> Met rechtermuisknop -> opslaan kan je deze downloaden in de geselecteerde kwaliteit </small>

			<div class="comment-container">
				<hr />

				<h2>Reacties</h2>

				<form
					method="POST"
					use:enhance={() => {
						return ({ result, update }) => {
							let title = 'Reactie plaatsen mislukt'
							let type = 'danger'

							if (result.status === 200) {
								title = 'Succes'
								type = 'success'

								// @ts-expect-error Ja weet je, ik snap dat je dit niet leuk vind, maar je doet het er maar mee typescript
								data.photo.comments = [...data.photo.comments, result.data.comment]
							}

							toast({
								title,
								message: result.data.message,
								type,
							})
							update()
						}
					}}>
					<input type="text" name="comment" placeholder="Typ een reactie..." />
					<button type="submit">Plaats</button>
				</form>

				{#each data.photo.comments as comment}
					{@const u = comment.commenter}
					<div class="ibs-comment">
						<div class="ibs-comment--icon">
							<ProfileIcon filename={u.profilePicture} name={u.firstName + ' ' + u.lastName} height={50} width={50} />
						</div>
						<div class="ibs-comment--content">
							<a href="/leden/{u.ldapId}" class="ibs-comment--content--name">{u.firstName} {u.lastName}</a>
							<p class="ibs-comment--content--date">
								{formatDateTimeHumanReadable(comment.updatedAt)}
							</p>
							<div class="ibs-comment--content--comment">{comment.comment}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="image-container">
			<img
				onclick={() =>
					imagePreview({
						image: data.photoUrl ?? '',
					})}
				src={data.photoUrl}
				alt="Foto {data.photo.id}" />
		</div>
	</div>
{/if}

<style lang="scss">
	.root {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 1rem;

		h2 {
			margin-bottom: 0.25rem;
		}
	}

	.details-container {
		p {
			margin: 0.25rem 0;
		}

		& > hr:first-child {
			display: none;
		}
	}

	.comment-container {
		max-width: 100%;
		form {
			display: grid;
			grid-template-columns: 1fr auto;
			grid-gap: 1rem;
			margin: 0.5rem 0;
		}
	}

	.image-container {
		grid-column: span 2;

		img {
			max-width: 100%;
			max-height: calc(100vh - var(--topbar-height) - 10rem);
		}
	}

	.rating-container {
		.stars {
			i {
				color: var(--color-primary);
			}

			i[data-filled='true'],
			i:hover {
				& :global(path) {
					fill: var(--color-primary);
				}
			}
		}
	}

	@media (max-width: 600px) {
		$mw: calc(100vw - 2rem);

		.root {
			grid-template-columns: 1fr;

			& > div {
				max-width: $mw;
			}
		}

		.details-container {
			grid-row: 2;
			grid-column: span 1;

			display: grid;
			grid-template-columns: 1fr;

			margin-bottom: 20vh;

			& > hr:first-child {
				display: block;
			}
		}

		.comment-container {
			grid-row: 4;
			form {
				grid-template-columns: minmax(0, 1fr);
				margin-bottom: 1rem;
			}
		}

		.image-container {
			grid-row: 1;
			grid-column: span 1;

			max-width: $mw;
		}
	}
</style>
