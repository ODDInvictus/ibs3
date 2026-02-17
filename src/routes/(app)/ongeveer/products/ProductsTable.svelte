<script lang="ts">
	export let products: { id: number; name: string }[] = []
</script>

<table class="ongeveer-table">
	<thead>
		<tr>
			<th>ID</th>
			<th>Naam</th>
		</tr>
	</thead>
	<tbody>
		{#each products as product}
			<tr>
				<td><a href="/ongeveer/products/{product.id}">{product.id}</a></td>
				<td>{product.name}</td>
			</tr>
		{/each}
		{#if products.length === 0}
			<tr>
				<td colspan="2">Geen producten gevonden</td>
			</tr>
		{/if}
	</tbody>
</table>
