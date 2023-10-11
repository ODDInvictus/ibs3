<script lang="ts">
	import { env } from '$env/dynamic/public';
	import ProfileIcon from '$lib/components/profile-icon.svelte';

	export let users: {
		firstName: string;
		lastName: string;
		profilePictureId: number | null;
		nickname: string | null;
		id: number;
	}[];
	export let mode: 'likes' | 'dislikes';
</script>

<div>
	<h2>{mode === 'likes' ? 'Likes' : 'Dislikes'}</h2>
	<hr />
	<ul>
		{#each users as user}
			<li>
				<a href={`/playlist/create/${user.id}`}>
					<ProfileIcon uid={user.profilePictureId} name={user.firstName + ' ' + user.lastName} />
					<p>{user.nickname ?? user.firstName}</p>
				</a>
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	$margin: 10px;

	div {
		text-align: center;

		ul {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: $margin;
			margin-top: $margin;

			li {
				display: flex;
				gap: $margin;
				align-items: center;
			}
		}
	}
</style>
