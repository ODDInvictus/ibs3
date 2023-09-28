<script lang="ts">
	import { env } from '$env/dynamic/public';

	export let users: {
		firstName: string;
		picture: string | null;
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
					<img
						src={user.picture
							? env.PUBLIC_UPLOAD_URL + 'users/' + user.picture
							: 'https://avatars.githubusercontent.com/u/11670885?v=4'}
						alt={user.firstName}
					/>
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
			gap: $margin;
			margin-top: $margin;

			li {
				display: flex;
				gap: $margin;
				align-items: center;

				img {
					height: 3rem;
					width: 3rem;
					object-fit: cover;
					border-radius: 100%;
				}
			}
		}
	}
</style>
