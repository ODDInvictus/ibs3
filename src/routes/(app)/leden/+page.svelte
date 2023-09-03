<script lang="ts">
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';
	const members = $page.data.members;
	const feuten = $page.data.feuten;
</script>

<Title title="Leden en ander gespuis" shortTitle="Leden" />

<div class="center m-4"><a href="/leden/commissie">Commissies</a></div>

<div class="center">
	<table class="striped not-full-width">
		<thead>
			<tr>
				<th>Lid</th>
				<th>Lid sinds</th>
			</tr>
		</thead>
		<tbody>
			{#each members as member}
				<tr>
					<td>
						<a href="/leden/{member.ldapId}">{member.firstName} {member.lastName}</a>
					</td>
					<td>
						{new Date(member.becameMember).toLocaleDateString('nl')}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#if feuten && feuten.length > 0}
	<hr class="m-8" />
	<div class="center column mt-4">
		<h2>Feuten</h2>
		<table class="striped not-full-width">
			<thead>
				<tr>
					<th>Feut</th>
					<th>Eerste meeborrel</th>
				</tr>
			</thead>
			<tbody>
				{#each feuten as feut}
					<tr>
						<td>
							<a href="/leden/{feut.ldapId}">{feut.firstName} {feut.lastName}</a>
						</td>
						<td>
							{new Date(feut.firstDrink).toLocaleDateString('nl')}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
