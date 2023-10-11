<script>
	import { env } from '$env/dynamic/public';
	import Title from '$lib/components/title.svelte';
</script>

<Title title="Over IBS" />

<p>Invictus Bier Systeem is <i>de</i> webapp voor alles O.D.D. Invictus</p>

<p>
	Deze app is gemaakt door <a href="https://github.com/Nierot">Niels Rotmensen</a>,
	<a href="https://github.com/Astronautilus14">Naut de Vroome</a>,
	<a href="https://github.com/SimplyPancake">Daniel Jonker</a>
	en <a href="https://github.com/ODDInvictus/ibs3/graphs/contributors">andere contributors</a>
</p>
<p>
	© 2023 - {new Date().getFullYear()} - versie {env.PUBLIC_VERSION}
	<a href={env.PUBLIC_GITHUB_LINK + '/tree/' + env.PUBLIC_GIT_REV}>({env.PUBLIC_GIT_REV_SHORT})</a>
</p>
