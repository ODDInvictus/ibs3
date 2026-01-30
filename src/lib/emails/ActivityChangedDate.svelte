<script lang="ts">
	import Base from './Base.svelte'
	import { env } from '$env/dynamic/private'
	import type { Activity } from '$lib/server/prisma/client'

	export let activity: Activity
	export let oldDate: Date

	function time(d: Date) {
		return (
			activity.startTime.toLocaleDateString('nl-NL', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
			}) +
			' om ' +
			activity.startTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
		)
	}
</script>

<Base {...$$props}>
	<p>
		{activity.name} is verplaatst naar {time(activity.startTime)}
	</p>
	<p>
		De oude datum was: {time(oldDate)}
	</p>

	<div>
		<!--[if true]>
			<div style='margin-bottom: 16px;'>
  			Iets aanpassen aan je beschikbaarheid?
				<a href={env.ORIGIN + '/activiteit/' + activity.id} + activity.id style='color:#551b8a;'>
          Klik dan hier!
				</a>
			</div>
		<!--[endif]-->
		<!--[if !true]><!-->
		<div>
			Iets aanpassen aan je beschikbaarheid?
			<a href={env.ORIGIN + '/activiteit/' + activity.id} style="color:#551b8a; display:inline;">Klik dan hier!</a>
		</div>
		<!--[endif]-->
	</div>
</Base>
