<script lang="ts">
	import { page } from '$app/stores';
	import CircleX from '~icons/tabler/circle-x';
	import CirclePlus from '~icons/tabler/circle-plus';
	import FilePencil from '~icons/tabler/file-pencil';
	import { addMember, removeMember, renameCommittee, deleteCommittee } from './functions';
</script>

<h1>Commissie beheer</h1>

<hr />

<p>Hier kan je commissies aanmaken en verwijderen</p>

<br />

<a href="/admin/commissie/nieuw">Commissie aanmaken</a>

<table>
	<thead>
		<tr>
			<td class="name">Naam</td>
			<td class="ldapId">ldapId</td>
			<td class="members">Leden</td>
			<td class="actions">Acties</td>
		</tr>
	</thead>
	<tbody>
		{#each $page.data.committees as committee}
			<tr>
				<td class="name"><a href="/leden/commissie/{committee.ldapId}">{committee.name}</a></td>
				<td class="ldapId">{committee.ldapId}</td>
				<td class="members">
					{#each committee.CommitteeMember as member}
						<div class="member-name">
							<button
								title="Lid verwijderen"
								on:click={() => removeMember(member.id, member.member.firstName, committee.name)}
							>
								<CircleX />
							</button>
							<p>
								<span>{member.member.firstName}</span>
								<span>{member.member.lastName}</span>
								{#if member.member.nickname}
									<span class="member-nickname">({member.member.nickname})</span>
								{/if}
							</p>
						</div>
					{/each}
				</td>
				<td class="actions">
					<div class="buttons">
						<button
							title="Naam wijzigen"
							on:click={() => renameCommittee(committee.id, committee.name)}
						>
							<FilePencil />
						</button>
						<button
							title="Lid toevoegen"
							on:click={() => addMember($page.data.users, committee.id, committee.name)}
						>
							<CirclePlus />
						</button>

						<button title="Commissie verwijderen" on:click={() => deleteCommittee(committee.id)}>
							<CircleX />
						</button>
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	h1 {
		text-align: center;
	}

	hr {
		margin: 0.5rem 0;
	}

	p,
	a {
		display: block;
		text-align: center;
	}

	a {
		color: var(--primary-color);
		margin-bottom: 1rem;
	}

	table {
		.name,
		.ldapId {
			max-width: 3rem;
		}

		.buttons {
			display: flex;
			flex-direction: row;
			justify-content: center;
			gap: 1rem;
		}

		.members {
			max-width: 10rem;
		}

		.member-name {
			display: grid;
			grid-template-columns: 20px 1fr;

			text-align: left;
		}
	}

	// media query for phones
	@media (max-width: 600px) {
		.ldapId {
			display: none;
		}

		table {
			max-width: 200vw;

			.name {
				max-width: 7rem;
			}

			.member-nickname {
				display: none;
			}

			.buttons {
				flex-direction: column;
				gap: 0.5rem;
			}

			.members {
				max-width: inherit;
			}
		}
	}
</style>
