<script lang="ts">
	import Plus from '~icons/tabler/plus';
	import Minus from '~icons/tabler/minus';
	import Modal from './Modal.svelte';
	import { openModal } from 'svelte-modals';
	import type { sbUser } from './types';
	import './table.scss';

	export let data: sbUser[];
	export let longestName: string | null;

	const trekBak = (id: number, index: number) => {
		changeCount(index, -1);
		fetch('/strafbakken', {
			method: 'DELETE',
			body: JSON.stringify({
				user: id
			})
		}).catch(() => {
			changeCount(index, 1);
		});
	};

	const changeCount = (index: number, n: number) => {
		data[index]._count.StrafbakReceived += n;
	};
</script>

<main>
	<thead>
		<th>Naam</th>
		<th>Bakken</th>
		<th>Acties</th>
	</thead>
	<tbody>
		{#each data as user, i}
			<row class="row">
				<a href={`/strafbakken/${user.firstName.toLowerCase()}`} class="cell">
					{user.nickname || user.firstName}
				</a>
				<a href={`/strafbakken/${user.firstName.toLowerCase()}`} class="cell">
					<p>{user._count.StrafbakReceived}</p>
				</a>
				<div class="actions cell">
					<button
						on:click={() =>
							openModal(Modal, {
								username: user.nickname || user.firstName,
								uid: user.id,
								changeCount,
								index: i
							})}
					>
						<Plus class="cursor-pointer hover:invert-[.35] z-0 focus:outline-0 duration-[400ms]" />
					</button>
					<button on:click={user._count.StrafbakReceived ? () => trekBak(user.id, i) : null}>
						<Minus
							class={user._count.StrafbakReceived
								? 'cursor-pointer hover:invert-[.35] z-0 focus:outline-0 -translate-x-1 duration-[400ms]'
								: 'hidden'}
						/>
					</button>
				</div>
			</row>
		{/each}
		<!-- Add an invisible row with the longest name to make sure the 2 tables have the same width (kinda) -->
		{#if longestName !== null}
			<row id="invisible">
				<p class="cell">{longestName}</p>
				<div class="cell" />
				<div class="cell" />
			</row>
		{/if}
	</tbody>
</main>

<style lang="scss">
row {
	grid-template-columns: repeat(3, minmax(0, 1fr));
}
</style>