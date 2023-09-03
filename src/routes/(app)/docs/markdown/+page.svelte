<script lang="ts">
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';
	import Row from './Row.svelte';

	const examples = [
		'*schuingedrukt*',
		'**dikgedrukt**',
		'***dik- en schuingedrukt***',
		'~~doorgestreept~~',
		'++ondersteept++',
		'--> <==>',
		'`code` [[ctrl]]',
		$page.data.url,
		`[strafbakken](${$page.data.url}/strafbakken)`,
		':)  :clap:',
		'20^e^ H~2~O',
		'\\*geen markdown* *wel markdown*'
	];
</script>

<Title title="Markdown" />

<table class="equal-width small">
	<thead>
		<th>Markdown</th>
		<th>Resultaat</th>
	</thead>
	<tbody>
		{#each examples as example}
			<Row text={example} />
		{/each}
	</tbody>
</table>

<a
	href="https://gist.githubusercontent.com/roachhd/1f029bd4b50b8a524f3c/raw/baf369946a4f0d9127fcccef5581d6c34f39f0dc/README.md"
>
	Een lijst met alle emoji-codes zijn hier te vinden
</a>

<style>
	a {
		display: block;
		text-align: center;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
</style>
