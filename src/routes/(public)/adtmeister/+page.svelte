<script lang="ts">
	import type { PageData } from './$types'
	import Menu from '~icons/tabler/menu-2'

	export let data: PageData
</script>

<div class="root">
	<header>O.D.D. Invictus Adtmeister klassement</header>

	<main>Content hier</main>

	<nav>
		Navigatie hier
		<div id="hamburger">
			<button class="btn-a"><Menu /></button>
		</div>
	</nav>
</div>

<style lang="scss">
	.root {
		display: grid;
		height: 100dvh;
		grid-template-rows: 2rem 1fr 2rem;
		grid-template-columns: 1fr;
	}

	nav {
		display: grid;
		height: 100px;
		grid-template-columns: 1fr 1fr;

		#hamburger {
			display: block;
			text-align: end;
			padding: 10px;
		}
	}
</style>
