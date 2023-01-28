<script lang="ts">
	import '../app.css'
</script>

<div id="content" class="dark">
  <slot />
</div>

<style>
	#content {
		width: 100vw;
		height: 100vh;
	}
</style>