<script lang="ts">
	import { untrack } from 'svelte'
	import Callout from '$lib/components/callout.svelte'
	import Title from '$lib/components/title.svelte'
	import type { PageProps } from './$types'

	let { data, form }: PageProps = $props()
	const initialTargetType = untrack(() => form?.values?.targetType)
	const initialTargetIds = untrack(() => form?.values?.targetIds ?? [])
	let targetType = $state<'user' | 'committee'>(initialTargetType === 'committee' ? 'committee' : 'user')
	let committeeId = $state(initialTargetType === 'committee' ? (initialTargetIds[0] ?? '') : '')
	let selectedCommittee = $derived(data.committees.find(committee => committee.id === Number(committeeId)))
</script>

<Title title="Agenda item aanmaken" underTitle="Voeg iets toe aan iemands .ics feed" />

<main class="content">
	{#if form?.error}
		<div role="alert"><Callout type="caution">{form.error}</Callout></div>
	{/if}

	<form method="POST" class="event-form">
		<label>
			Titel
			<input name="title" type="text" required maxlength="200" value={form?.values?.title ?? ''} />
		</label>

		<label>
			Beschrijving
			<textarea name="description" rows="4">{form?.values?.description ?? ''}</textarea>
		</label>

		<label>
			Locatie
			<input name="location" type="text" value={form?.values?.location ?? ''} />
		</label>

		<div class="time-fields">
			<label>
				Begintijd
				<input name="startTime" type="datetime-local" required value={form?.values?.startTime ?? ''} />
			</label>
			<label>
				Eindtijd
				<input name="endTime" type="datetime-local" required value={form?.values?.endTime ?? ''} />
			</label>
		</div>

		<fieldset>
			<legend>Agenda's</legend>
			<div class="target-options">
				<label><input type="radio" name="targetType" value="user" bind:group={targetType} /> Gebruiker</label>
				<label><input type="radio" name="targetType" value="committee" bind:group={targetType} /> Commissie</label>
			</div>

			{#if targetType === 'user'}
				<label>
					Gebruikers
					<select name="targetId" multiple size="8" required>
						{#each data.users as user (user.id)}
							<option value={user.id} selected={form?.values?.targetIds.includes(String(user.id))}
								>{`${user.firstName} ${user.lastName}`}</option>
						{/each}
					</select>
				</label>
			{:else}
				<label>
					Commissie
					<select name="targetId" bind:value={committeeId} required>
						<option value="" disabled>Kies een commissie</option>
						{#each data.committees as committee (committee.id)}
							<option value={committee.id}>{committee.name}</option>
						{/each}
					</select>
				</label>
				{#if selectedCommittee}
					<div class="members">
						<strong>Huidige leden ({selectedCommittee.CommitteeMember.length})</strong>
						{#if selectedCommittee.CommitteeMember.length}
							<ul>
								{#each selectedCommittee.CommitteeMember as { member } (member.id)}
									<li>{member.nickname || `${member.firstName} ${member.lastName}`}</li>
								{/each}
							</ul>
						{:else}
							<p>Deze commissie heeft geen actieve leden.</p>
						{/if}
					</div>
				{/if}
			{/if}
		</fieldset>

		<button type="submit">Agenda-item aanmaken</button>
	</form>
</main>

<style>
	.content {
		width: min(100% - 2rem, 42rem);
		margin: 0 auto;
	}

	.event-form {
		display: grid;
		gap: 1rem;
		margin: 1.5rem auto;
	}

	label {
		display: grid;
		gap: 0.35rem;
	}

	input,
	textarea,
	select {
		box-sizing: border-box;
		width: 100%;
		padding: 0.55rem 0.65rem;
		font: inherit;
	}

	.time-fields,
	.target-options {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	fieldset {
		min-width: 0;
		padding: 1rem;
		border: 1px solid var(--border-color, #bbb);
	}

	.target-options label {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.target-options input {
		width: auto;
	}

	.members {
		margin-top: 1rem;
	}

	.members ul {
		margin: 0.5rem 0 0;
		padding-left: 1.25rem;
	}

	@media (max-width: 36rem) {
		.time-fields,
		.target-options {
			grid-template-columns: 1fr;
		}
	}
</style>
