<script lang="ts">
	import ProfileIcon from '$lib/components/profile-icon.svelte'

	export let users: {
		firstName: string
		lastName: string
		profilePicture: string | null
		nickname: string | null
		id: number
	}[]
	export let mode: 'likes' | 'dislikes' | undefined = undefined
	export let url: string = '/playlist/create'
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
