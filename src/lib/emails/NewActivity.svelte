<script lang="ts">
	import Base from './Base.svelte'
	import { env } from '$env/dynamic/private'
	import type { Activity, ActivityLocation } from '$lib/server/prisma/client'
	import { markdown, stripMarkdown } from '$lib/utils'

	interface Props {
		activity: Activity
		location: ActivityLocation
		[key: string]: any
	}

	let { ...props }: Props = $props()

	let time =
		props.activity.startTime.toLocaleDateString('nl-NL', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
		}) +
		' om ' +
		props.activity.startTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
</script>

<Base {...props}>
	<p>
		Iemand heeft een nieuwe activiteit aangemaakt in IBS genaamd: {stripMarkdown(props.activity.name)}. Deze activiteit vind plaats op {time}
		{#if props.location}
			te {props.location.name}
		{/if}
	</p>
	<p>
		Omschrijving: {@html markdown(props.activity.description)}
	</p>

	<div>
		<!--[if true]>
			<div style='margin-bottom: 16px;'>
				<p>Ben jij ook bij?</p>
				<a href={env.ORIGIN + '/activiteit/' + props.activity.id} style='color:#551b8a;'>
					Meld je dan nu aan!
				</a>
			</div>
		<!--[endif]-->
		<!--[if !true]><!-->
		<div>
			<p style="display:inline;">Ben jij ook bij?</p>
			<a href={env.ORIGIN + '/activiteit/' + props.activity.id} style="color:#551b8a; display:inline;"> Meld je dan nu aan! </a>
		</div>
		<!--[endif]-->
	</div>
</Base>
