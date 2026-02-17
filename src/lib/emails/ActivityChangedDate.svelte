<script lang="ts">
	import Base from './Base.svelte'
	import { env } from '$env/dynamic/private'
	import type { Activity } from '$lib/server/prisma/client'
	import { markdown } from '$lib/utils'

	interface Props {
		activity: Activity
		oldDate: Date
		[key: string]: any
	}

	let { ...props }: Props = $props()

	function time(d: Date) {
		return (
			d.toLocaleDateString('nl-NL', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
			}) +
			' om ' +
			d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
		)
	}
</script>

<Base {...props}>
	<p>
		{@html markdown(props.activity.name)} is verplaatst naar {time(props.activity.startTime)}
	</p>
	<p>
		De oude datum was: {time(props.oldDate)}
	</p>

	<div>
		<!--[if true]>
			<div style='margin-bottom: 16px;'>
  			Iets aanpassen aan je beschikbaarheid?
				<a href={env.ORIGIN + '/activiteit/' + props.activity.id} style='color:#551b8a;'>
          Klik dan hier!
				</a>
			</div>
		<!--[endif]-->
		<!--[if !true]><!-->
		<div>
			Iets aanpassen aan je beschikbaarheid?
			<a href={env.ORIGIN + '/activiteit/' + props.activity.id} style="color:#551b8a; display:inline;">Klik dan hier!</a>
		</div>
		<!--[endif]-->
	</div>
</Base>
