<script lang="ts">
	import ProfileIcon from '$lib/components/profile-icon.svelte'

	interface Props {
		users: {
			firstName: string
			lastName: string
			profilePicture: string | null
			nickname: string | null
			id: number
		}[]
		mode?: 'likes' | 'dislikes' | undefined
		url?: string
	}

	let { users, mode = undefined, url = '/playlist/create' }: Props = $props()
</script>

<div>
	{#if mode}
		<h2>{mode === 'likes' ? 'Likes' : 'Dislikes'}</h2>
		<hr />
	{/if}
	<ul>
		{#each users as user}
			<li>
				<a href={`${url}/${user.id}`}>
					<ProfileIcon
						filename={user.profilePicture}
						name={user.firstName + ' ' + user.lastName}
						width="50"
						height="50"
						fixedWidth={true} />
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
			align-items: flex-start;
			gap: $margin;
			margin-top: $margin;

			li {
				display: flex;
				gap: $margin;
				align-items: center;

				a {
					display: flex;
					align-items: center;
					gap: 5px;
				}
			}
		}
	}
</style>
