<script lang="ts">
	import { page } from '$app/state'
	import Title from '$lib/components/title.svelte'
	let location = page.data.location
</script>

<Title title={location.name} shortTitle={location.name} />

<div class="center">
	<table class="striped equal-width small">
		<thead>
			<tr>
				<th>Sleutel</th>
				<th>Waarde</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Naam</td>
				<td>{location.name}</td>
			</tr>
			<tr>
				<td>Adres</td>
				<td>{location.address}</td>
			</tr>
			<tr>
				<td>Postcode</td>
				<td>{location.postalCode}</td>
			</tr>
			<tr>
				<td>Plaats</td>
				<td>{location.city}</td>
			</tr>
			<tr>
				<td>Land</td>
				<td>{location.country}</td>
			</tr>
			<tr>
				<td>Beschrijving</td>
				<td>{location.description}</td>
			</tr>
			<tr>
				<td>ID</td>
				<td>{location.id}</td>
			</tr>
		</tbody>
	</table>
</div>
