<script lang="ts">
	import Base from './Base.svelte'
	import { env } from '$env/dynamic/private'
	import type { Activity, ActivityLocation } from '$lib/server/prisma/client'

	export let activity: Activity
	export let location: ActivityLocation

	let time =
		activity.startTime.toLocaleDateString('nl-NL', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
		}) +
		' om ' +
		activity.startTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
</script>

<Base {...$$props}>
	<p>
		Iemand heeft een nieuwe activiteit aangemaakt in IBS genaamd: {activity.name}. Deze activiteit vind plaats op {time}
		{#if location}
			te {location.name}
		{/if}
	</p>
	<p>
		Omschrijving: {activity.description}
	</p>

	<div>
		<!--[if true]>
			<div style='margin-bottom: 16px;'>
				<p>Ben jij ook bij?</p>
				<a href={env.ORIGIN + '/activiteit/' + activity.id} + activity.id style='color:#551b8a;'>
					Meld je dan nu aan!
				</a>
			</div>
		<!--[endif]-->
		<!--[if !true]><!-->
		<div>
			<p style="display:inline;">Ben jij ook bij?</p>
			<a href={env.ORIGIN + '/activiteit/' + activity.id} style="color:#551b8a; display:inline;"> Meld je dan nu aan! </a>
		</div>
		<!--[endif]-->
	</div>
</Base>
