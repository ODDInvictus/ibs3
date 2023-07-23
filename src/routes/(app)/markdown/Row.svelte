<script lang='ts'>
	import { markdown } from "$lib/utils";

  export let text: string;
</script>

<tr>
  <td>{text}</td>
  <td>{@html markdown(text)}</td>
</tr>

<style>
</style>