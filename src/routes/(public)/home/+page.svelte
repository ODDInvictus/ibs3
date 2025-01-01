<script lang="ts">
	import { signIn } from '@auth/sveltekit/client'
	import MoveDown from '~icons/tabler/circle-arrow-down'
	import MoveUp from '~icons/tabler/circle-arrow-up'
	import type { PageData } from './$types'
	import { onMount } from 'svelte'

	export let data: PageData

	let currentElem = 0
	const elements = ['main', 'temp', 'group', 'lichtingen', 'contact']

	function scroll() {
		const scrollButton = document.querySelector('.scroll')
		currentElem++

		console.log(scrollButton)

		scrollButton?.classList.remove('rotate')

		if (currentElem > elements.length - 1) {
			currentElem = 0
		} else if (currentElem > elements.length - 2) {
			scrollButton?.classList.add('rotate')
		}

		console.log('huts', elements[currentElem])
		const elem = document.querySelector(`#${elements[currentElem]}`)

		console.log(elem)
		elem?.scrollIntoView()
	}

	function login() {
		if (data.name) {
			window.location.href = '/'
		} else {
			signIn('authentik')
		}
	}

	function getPhoto(photo) {}
</script>

<!-- heerlijke hack -->
<!-- de laatste css regel die geladen wordt is een display:none, die haalt dit weg -->
<!-- Voorkomt een content flash -->
<div id="overlay" style="position:absolute;top:0px;left:0px;background-color:#551b8a;width:100vw;height:100vh;z-index:9999;"></div>

<main>
	<section class="center first" id="main">
		<img src="logo.png" alt="invictus logo" />
		<button on:click={login}>
			{data.name ? `Welkom, ${data.name}` : 'Login'}
		</button>
		<div class="text">
			<h1>Wij zijn O.D.D. Invictus</h1>
			<h3>Onafhankelijk dispuut uit Enschede</h3>
		</div>

		<div class="scroll" role="button" aria-pressed="false" tabindex={0} on:click={scroll}>
			<i>
				{#if currentElem < elements.length - 1}
					<MoveDown />
				{:else}
					<MoveUp />
				{/if}
			</i>
		</div>
	</section>

	<div class="rest">
		{#if data.temp}
			<section id="temp">
				<img src="no-activity.jpeg" alt="invictus logo" />
				Temp
			</section>
		{/if}

		<section id="group">
			<img src="no-activity.jpeg" alt="invictus logo" />
			Groep
		</section>

		<section id="lichtingen">
			<img src="no-birthday.jpeg" alt="invictus logo" />
			lichtingen
		</section>

		<section id="contact">
			<img src="logo_griffin.svg" alt="invictus logo" />
			deze zo van de zijkant is nice Contact
		</section>
	</div>
</main>

<style lang="scss">
	$scroll-btn-size: 3rem;
	$anim-h1-time: 2s;
	$anim-h3-time: 3s;
	$anim-scroll-delay: 4s;

	:root {
		width: 100vw;
		height: auto;

		scroll-snap-type: y mandatory;
		scroll-behavior: smooth;

		overflow-y: auto;
	}

	main {
		height: 100%;
		width: 100%;
		color: var(--color-text-light);

		h1,
		h3 {
			color: var(--color-text-light);
		}
	}

	.rest {
		background: rgb(85, 27, 138);
		background: linear-gradient(180deg, rgba(85, 27, 138, 1) 0%, rgba(85, 27, 138, 0.8) 100%);
	}

	section {
		scroll-snap-align: start;
	}

	section.first {
		height: 100vh;
		background: rgb(85, 27, 138);

		& > .text {
			display: flex;
			flex-direction: column;

			h1,
			h3 {
				overflow: hidden;
				white-space: nowrap;
				margin: 0 auto;
			}

			h1 {
				animation: scroll $anim-h1-time;
			}

			h3 {
				animation: scroll-later $anim-h3-time;
			}
		}

		& > button {
			all: unset;

			cursor: pointer;

			background-color: white;
			color: var(--color-text);
			padding: 1rem;

			border-radius: var(--border-radius);

			position: absolute;
			top: 20px;
			right: 20px;
		}

		& > .scroll {
			position: fixed;
			bottom: 1rem;
			color: white;

			animation: bounce 0.5s;
			animation-delay: $anim-scroll-delay;
			animation-iteration-count: 1;

			&:hover {
				color: rgb(224, 191, 255);
			}

			i:hover {
				cursor: pointer;
			}

			i :global(svg) {
				width: $scroll-btn-size;
				height: $scroll-btn-size;
			}
		}

		h1 {
			font-size: xxx-large;
		}

		h3 {
			font-size: x-large;
		}
	}

	.rotate {
		animation: rotate 0.5s !important;
		color: red !important;
	}

	.rotate:hover {
		color: red;
	}

	@keyframes bounce {
		0% {
			transform: translateY(0px);
		}

		25% {
			transform: translateY(-10px);
		}

		75% {
			transform: translateY(10px);
		}

		100% {
			transform: translateY(0px);
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(180deg);
		}
	}

	@keyframes typing {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}

	@keyframes scroll {
		from {
			transform: translateX(50vw);
		}
		to {
			transform: translate(0);
		}
	}

	@keyframes scroll-later {
		0% {
			transform: translateX(50vw);
		}

		25% {
			transform: translateX(50vw);
		}

		100% {
			transform: translate(0);
		}
	}

	#overlay {
		display: none;
	}
</style>
