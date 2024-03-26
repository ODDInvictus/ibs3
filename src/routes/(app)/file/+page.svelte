<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Mongo test pagina</h1>

<form method="post" enctype="multipart/form-data">
	<label for="file">
		<span>Bestand</span>
		<input type="file" name="file" required />
	</label>
	<button type="submit">Opslaan</button>
</form>
