<script lang="ts">
	interface Props {
		size: number
		p: number
		sizes?: any
		url: string
	}

	let { size, p, sizes = [10, 20, 30, 50, 100], url }: Props = $props()
</script>

<div class="nav">
	<p class="pageSize">
		Paginagrootte
		{#each sizes as newSize}
			<a href="{url}?size={newSize}&p={p}" class={newSize == size ? 'underline' : ''}>{newSize}</a>
		{/each}
	</p>
	<a href="{url}?size={size}&p={p - 2}">{'<<'}</a>
	<a href="{url}?size={size}&p={p - 1}">{'<'}</a>
	<p>{p + 1}</p>
	<a href="{url}?size={size}&p={p + 1}">{'>'}</a>
	<a href="{url}?size={size}&p={p + 2}">{'>>'}</a>
</div>

<style lang="scss">
	.nav {
		font-size: 1.2rem;
		display: flex;
		gap: 1rem;
		width: 100%;
		justify-content: center;
		padding: 1rem;
		position: relative;

		.pageSize {
			position: absolute;
			top: 1rem;
			left: 0;
			font-size: 1rem;

			@media screen and (max-width: 780px) {
				display: none;
			}

			a {
				margin: 0 1ex;
			}
		}

		.underline {
			text-decoration: underline;
		}
	}
</style>
