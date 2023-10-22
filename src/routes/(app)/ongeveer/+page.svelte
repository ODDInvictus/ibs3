<script lang="ts">
	import Title from '$lib/components/title.svelte';

	import Revolut from '~icons/tabler/brand-revolut';
	import Book from '~icons/tabler/book';
	import People from '~icons/tabler/users';
	import ArrowRight from '~icons/tabler/arrow-bar-right';
	import ArrowLeft from '~icons/tabler/arrow-bar-to-left';
</script>

<Title title="Ongeveer" shortTitle="Home" />
<main>
	<nav>
		<ul>
			<li>
				<a href="/ongeveer/bank" class="layout--navbar--item">
					<i><Revolut /></i>
					<span>Bank</span>
				</a>
			</li>
			<li>
				<a href="/ongeveer/purchases" class="layout--navbar--item">
					<i><ArrowLeft /></i>
					<span>Inkoop</span>
				</a>
			</li>
			<li>
				<a href="/ongeveer/sales" class="layout--navbar--item">
					<i><ArrowRight /></i>
					<span>Verkoop</span>
				</a>
			</li>
			<li>
				<a href="/ongeveer/ledger" class="layout--navbar--item">
					<i><Book /></i>
					<span>Grootboekrekeningen</span>
				</a>
			</li>
			<li>
				<a href="/ongeveer/relations" class="layout--navbar--item">
					<i><People /></i>
					<span>Relaties</span>
				</a>
			</li>
		</ul>
	</nav>
</main>

<style lang="scss">
	main {
		display: flex;
		justify-content: center;

		nav {
			margin-top: 2rem;

			ul {
				list-style: none;
				display: flex;
				flex-direction: column;
			}

			li {
				font-size: 1.5rem;

				a {
					display: flex;
					align-items: center;
				}

				i {
					display: flex;
					justify-self: center;
					transform: translateY(2px);
					margin-right: 1ex;
				}
			}
		}
	}
</style>
