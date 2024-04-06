<script lang="ts">
	export let categories: { id: number; name: string }[] = []
</script>

<table class="small">
	<thead>
		<th>ID</th>
		<th>Naam</th>
	</thead>
	<tbody>
		{#each categories as category}
			<tr>
				<td>
					<a href="/ongeveer/products/category/{category.id}">
						{category.id}
					</a>
				</td>
				<td>
					{category.name}
				</td>
			</tr>
		{/each}
		{#if categories.length === 0}
			<tr>
				<td colspan="2">Geen categorieën gevonden</td>
			</tr>
		{/if}
	</tbody>
</table>
