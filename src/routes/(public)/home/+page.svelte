<script lang="ts">
	import LogoWhite from '$lib/components/logo-v2-small-white.svelte'
	import { signIn } from '@auth/sveltekit/client'
	import Beer from '~icons/tabler/beer'
	import Calendar from '~icons/tabler/calendar'
	import AlertTriangle from '~icons/tabler/alert-triangle'
	import MapPin from '~icons/tabler/map-pin'
	import Mail from '~icons/tabler/mail'
	import FileEuro from '~icons/tabler/file-euro'
	import Info from '~icons/tabler/info-circle'
	import Stopwatch from '~icons/tabler/stopwatch'
	import { calcLeaderboardTime } from '$lib/leaderboards'
	import type { PageProps } from './$types'

	let { data }: PageProps = $props()

	type Pijler = {
		icon: typeof Beer
		titel: string
		tekst?: string
		getal?: string
		regels?: { icon: typeof Beer; tekst: string }[]
	}

	const pijlers: Pijler[] = $derived([
		{
			icon: Calendar,
			titel: 'Volgende borrel',
			regels: [
				{ icon: Calendar, tekst: 'Donderdag' },
				{ icon: MapPin, tekst: 'Locatie: ergens?' },
			],
		},
		{
			icon: Beer,
			titel: 'Waar is de adtmeister?',
			regels: [{ icon: MapPin, tekst: 'Geen idee' }],
		},
		{
			icon: AlertTriangle,
			titel: 'Openstaande strafbakken',
			getal: data.openstaandeStrafbakken.toLocaleString('nl-NL'),
		},
	])
</script>

<svelte:head>
	<title>O.D.D. Invictus</title>
</svelte:head>

<main>
	<section class="hero">
		<div class="hero-content">
			<div class="logo">
				<LogoWhite />
			</div>
			<h1>O.D.D. Invictus</h1>
			<p class="tagline">Dé vereniging voor bier, bier en bier.</p>
			<div class="hero-buttons">
				<button class="button" onclick={() => signIn('authentik')}>Login</button>
				<a class="button outline" href="https://www.youtube.com/watch?v=ENXvZ9YRjbo">Wat doen we?</a>
			</div>
		</div>
	</section>

	<div class="container">
		<section class="pijlers" id="wat-doen-we">
			{#each pijlers as pijler}
				{@const Icon = pijler.icon}
				<div class="ibs-card pijler">
					<div class="icon"><Icon /></div>
					<h2>{pijler.titel}</h2>
					{#if pijler.tekst}
						<p>{pijler.tekst}</p>
					{/if}
					{#if pijler.getal}
						<p class="getal">{pijler.getal}</p>
					{/if}
					{#if pijler.regels}
						<ul class="regels">
							{#each pijler.regels as regel}
								{@const RegelIcon = regel.icon}
								<li><i class="small"><RegelIcon /></i> {regel.tekst}</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</section>

		<section class="onderkant">
			<div class="ibs-card record">
				<div class="icon"><Stopwatch /></div>
				{#if data.snelsteTijd}
					<p class="label">Snelste tijd</p>
					<p class="ranglijst">{data.snelsteTijd.ranglijst}</p>
					<p class="tijd">{calcLeaderboardTime(data.snelsteTijd.waarde, data.snelsteTijd.type)}</p>
					<p class="houder">door {data.snelsteTijd.naam}</p>
				{:else}
					<p class="label">Snelste tijd</p>
					<p class="houder">Nog geen tijden gezet. Wie durft?</p>
				{/if}
			</div>

			<div class="ibs-card gegevens">
				<h2><i><Info /></i> Gegevens</h2>
				<dl>
					<dt>Volledige naam</dt>
					<dd>Onafhankelijk Drienerloos Dispuut Invictus</dd>

					<dt><i class="small"><FileEuro /></i> KvK-nummer</dt>
					<dd>42210872</dd>

					<dt><i class="small"><MapPin /></i> Vestigingsplaats</dt>
					<dd>Enschede</dd>

					<dt><i class="small"><Mail /></i> Contact</dt>
					<dd><a href="mailto:info@oddinvictus.nl">info@oddinvictus.nl</a></dd>
				</dl>
			</div>
		</section>
	</div>

	<footer>
		<p>Onafhankelijk Drienerloos Dispuut Invictus</p>
		<p>
			v{data.version} -
			<a href={data.githubLink + '/tree/' + data.gitCommit}>
				({data.gitCommit})
			</a>
		</p>
	</footer>
</main>

<style lang="scss">
	// Vaste kleuren: deze pagina volgt het thema van de gebruiker niet
	$paars: #551b8a;
	$paars-licht: rgba(85, 27, 138, 0.1);
	$licht: #f0f0f0;
	$wit: #ffffff;
	$tekst: #0c0c0c;
	$grijs: #5d656b;
	$achtergrond: #f4eeff;

	:global(body) {
		background-color: $achtergrond;
	}

	main {
		height: 100%;
		width: 100%;
		overflow: auto;
		scroll-behavior: smooth;

		// Kolom zodat de footer onderaan kan blijven plakken
		display: flex;
		flex-direction: column;

		background-color: $achtergrond;
		color: $tekst;

		& > * {
			flex-shrink: 0;
		}
	}

	/* Hero met de schuine paarse stripe */
	.hero {
		position: relative;
		background-color: $paars;
		color: $licht;

		padding: 4rem 15% 7rem;
		clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
	}

	.hero-content {
		position: relative;
		z-index: 1;

		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;

		max-width: 40rem;

		h1 {
			justify-content: flex-start;
			margin: 0;
			font-size: 3rem;
			font-weight: 500;
			color: $licht;
		}
	}

	.logo :global(svg) {
		width: 9rem;
		height: auto;
	}

	.tagline {
		margin: 0;
		font-size: 1.4rem;
	}

	.hero-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 1rem;

		.button {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			background-color: $wit;
			color: $paars;
		}

		.button.outline {
			background-color: transparent;
			color: $licht;
			box-shadow: inset 0 0 0 2px $licht;
		}
	}

	.container {
		padding: 0 15%;
		margin-top: -3rem;

		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.ibs-card {
		background-color: $wit;
		box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.1);

		// Geen hover-effect (de globale .ibs-card heeft er wel een)
		&:hover {
			box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.1);
			transition: none;
		}

		h2 {
			color: $tekst;
		}
	}

	/* Pijlers */
	.pijlers {
		position: relative;
		z-index: 2;

		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	.pijler {
		padding: 1.5rem;

		h2 {
			justify-content: flex-start;
			margin: 0.75rem 0 0.5rem;
		}

		p {
			margin: 0;
			color: $grijs;
			line-height: 1.5;
		}

		p.getal {
			margin-top: 0.5rem;
			text-align: center;
			font-size: 2.75rem;
			font-weight: 500;
			line-height: 1;
			font-variant-numeric: tabular-nums;
			color: $paars;
		}

		.regels {
			margin: 0;
			padding: 0;
			list-style: none;

			display: flex;
			flex-direction: column;
			gap: 0.4rem;

			li {
				color: $grijs;
				line-height: 1.5;
			}

			i {
				color: $paars;
			}
		}

		.icon {
			width: 3rem;
			height: 3rem;
			border-radius: 50%;

			display: flex;
			align-items: center;
			justify-content: center;

			background-color: $paars-licht;
			color: $paars;

			:global(svg) {
				width: 1.6rem;
				height: 1.6rem;
			}
		}
	}

	/* Onderkant: proost + gegevens */
	.onderkant {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 1.5rem;
	}

	.record {
		padding: 1.5rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;

		.icon {
			width: 3rem;
			height: 3rem;
			margin-bottom: 0.75rem;
			border-radius: 50%;

			display: flex;
			align-items: center;
			justify-content: center;

			background-color: $paars-licht;
			color: $paars;

			:global(svg) {
				width: 1.6rem;
				height: 1.6rem;
			}
		}

		p {
			margin: 0;
		}

		.label {
			font-size: 0.8rem;
			letter-spacing: 0.15em;
			text-transform: uppercase;
			color: $grijs;
		}

		.ranglijst {
			margin-top: 0.25rem;
			font-weight: 500;
		}

		.tijd {
			margin: 0.5rem 0 0.25rem;
			font-size: 2.75rem;
			font-weight: 500;
			line-height: 1;
			font-variant-numeric: tabular-nums;
			color: $paars;
		}

		.houder {
			color: $grijs;
		}
	}

	.gegevens {
		padding: 1.5rem;

		h2 {
			justify-content: flex-start;
			gap: 0.5rem;
			margin: 0 0 1rem;
		}

		dl {
			display: grid;
			grid-template-columns: max-content 1fr;
			gap: 0.75rem 1.5rem;
			margin: 0;
		}

		dt {
			color: $grijs;
		}

		dd {
			margin: 0;
			overflow-wrap: anywhere;
		}

		a {
			color: $paars;
		}
	}

	footer {
		margin-top: auto;
		padding: 3rem 0 2rem;
		text-align: center;
		color: $grijs;

		p {
			margin: 0.25rem 0;
		}

		a {
			color: $paars;
		}
	}

	@media (max-width: 900px) {
		.pijlers {
			grid-template-columns: 1fr;
		}

		.onderkant {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 600px) {
		.hero {
			padding: 2.5rem 1.25rem 5rem;

			.hero-content h1 {
				font-size: 2.2rem;
			}
		}

		.tagline {
			font-size: 1.15rem;
		}

		.container {
			padding: 0 1rem;
		}

		.gegevens dl {
			grid-template-columns: 1fr;
			gap: 0.2rem;

			dd {
				margin-bottom: 0.6rem;
			}
		}
	}
</style>
