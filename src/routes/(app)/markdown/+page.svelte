<script lang="ts">
  import Row from "./Row.svelte";

  const examples = [
    '*schuingedrukt*',
    '**dikgedrukt**',
    '***dik- en schuingedrukt***',
    '~~doorgestreept~~',
    '++ondersteept++',
    '--> <==>',
    '`code` [[ctrl]]',
    'oddinvictus.nl',
    '[strafbakken](http://oddinvictus.nl/strafbakken)',
    ':)  :clap:',
    '20^e^ H~2~O',
    '\\*geen markdown* *wel markdown*'
  ]
</script>

<h1>Markdown</h1>
<hr>

<table>
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

<style>
  h1 {
    text-align: center;
  }

  hr {
    margin: var(--hr-margin);
  }
</style>