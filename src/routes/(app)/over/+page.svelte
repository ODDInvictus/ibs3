<script lang="ts">
	import { env } from '$env/dynamic/public'
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Title title="Over IBS" />

<p>Invictus Bier Systeem is <i>de</i> webapp voor alles O.D.D. Invictus</p>

<p>
	Deze app is gemaakt door <a href="https://github.com/Nierot">Niels Rotmensen</a>,
	<a href="https://github.com/Astronautilus14">Naut de Vroome</a>,
	<a href="https://github.com/SimplyPancake">Daniel Jonker</a>,
	<a href="https://github.com/jacktjong">Jack 't Jong</a>, en
	<a href="https://github.com/ODDInvictus/ibs3/graphs/contributors">andere contributors</a>
</p>

<br />

<p>
	© 2023 - {new Date().getFullYear()} - versie {data.version}
	<a href={data.githubLink + '/tree/' + data.gitCommit}>({data.gitCommit})</a>
</p>

<br />

<img src="/no-activity.jpeg" alt="Minions?" />
