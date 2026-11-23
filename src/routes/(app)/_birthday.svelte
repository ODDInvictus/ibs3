<script lang="ts">
	import { daysLeftTill, toAge, toBirthday } from '$lib/dateUtils'
	import { imagePreview } from '$lib/imagePreviewStore'
	import type { User } from '$lib/server/prisma/client'
	import { getPictureUrl } from '$lib/utils'

	let { nextBirthdays }: { nextBirthdays: User[] } = $props()

	function birthdayImage(resize: boolean, picture: string | null) {
		let link = ''

		if (picture) {
			link = getPictureUrl(picture, resize ? 'thumbnail' : 'normal')
		} else {
			link = `/no-birthday.jpeg`
		}

		return link
	}

	let mulitpleBirthdays = $derived(nextBirthdays.length > 1)
	let names = $derived(nextBirthdays.map(u => u.firstName).join(' en '))
</script>

<div class="ibs-card birthdays">
	<div class="ibs-card--image">
		{#each nextBirthdays as u}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<img
				onclick={() => imagePreview({ image: birthdayImage(false, u.profilePicture) })}
				src={birthdayImage(true, u.profilePicture)}
				alt="⏳" />
		{/each}
	</div>
	{#if daysLeftTill(nextBirthdays[0].birthDate) > 0}
		<h2 class="ibs-card--title">
			Volgende jarige{mulitpleBirthdays ? 'n' : ''}: {names}
		</h2>
		<div class="ibs-card--content">
			<p>
				{names}
				{mulitpleBirthdays ? 'zijn ' : 'is '}
				jarig op {toBirthday(nextBirthdays[0].birthDate)} en
				{mulitpleBirthdays ? 'worden ' : 'wordt '}
				dan {mulitpleBirthdays ? nextBirthdays.map(u => toAge(u.birthDate) + 1).join(' en ') : toAge(nextBirthdays[0].birthDate) + 1} jaar!
			</p>
			<p>Dat is over {daysLeftTill(nextBirthdays[0].birthDate)} dagen.</p>
		</div>
	{:else}
		<h2 class="ibs-card--title">
			🎉 {names}
			{mulitpleBirthdays ? 'zijn' : 'is'} jarig! 🎉
		</h2>
		<div class="ibs-card--content">
			<p>Gefeliciteerd {names}!</p>
			<p>
				{names}
				{mulitpleBirthdays ? 'zijn' : 'is'}
				{mulitpleBirthdays ? nextBirthdays.map(u => toAge(u.birthDate)).join(' en ') : toAge(nextBirthdays[0].birthDate)} jaar geworden
			</p>
		</div>
	{/if}
	<div class="ibs-card--links">
		<a href="/verjaardagen">Wie zijn er nog meer binnenkort jarig?</a>
	</div>
</div>

<style lang="scss">
	.ibs-card.birthdays {
		.ibs-card--content {
			padding: 0 1rem;
			padding-bottom: 1rem;
		}

		& p:last-of-type {
			margin-bottom: 1.5rem;
		}
	}
</style>
