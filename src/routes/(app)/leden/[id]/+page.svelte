<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import Title from '$lib/components/title.svelte';

	let member = $page.data.member;

	const usedFields = [
		'firstName',
		'lastName',
		'birthDate',
		'email',
		'phone',
		'ldapId',
		'nickname',
		'firstDrink',
		'becameFeut',
		'becameMember',
		'lastLoggedin',
		'picture',
		'id'
	];

	const fields = Object.keys(member).filter((key) => !usedFields.includes(key));

	function getAge(birthDate: Date) {
		const today = new Date();
		const age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			return age - 1;
		}
		return age;
	}

	function toDate(date: string) {
		if (!date) return undefined;
		return new Date(date).toLocaleDateString('nl-NL');
	}

	export let form;
</script>

<Title title="{member.firstName} {member.lastName}" />

<div id="img">
	<img
		src={env.PUBLIC_UPLOAD_URL + '/users/' + member?.picture ?? 'miel.jpg'}
		alt={member.firstName}
	/>

	{#if $page.data.isCurrentUser}
		<div>
			<form method="POST" enctype="multipart/form-data">
				<input type="file" name="image" accept="image/*" />
				{#if form?.success !== undefined}
					<p class="error">{form?.message}</p>
				{:else}
					<button type="submit">Upload</button>
				{/if}
			</form>
		</div>
	{/if}
</div>

<div id="personal" class="info">
	<h2>Persoonlijke gegevens</h2>

	<hr />

	<div>
		<p>Voornaam</p>
		<p>{member.firstName}</p>
		<p>Achternaam</p>
		<p>{member.lastName}</p>
		<p>Geboortedatum</p>
		<p>{toDate(member.birthDate)}</p>
		<p>Leeftijd</p>
		<p>{getAge(new Date(member.birthDate))}</p>
	</div>
</div>

<div id="contact" class="info">
	<h2>Contact details</h2>

	<hr />

	<div>
		<p>Email</p>
		<p>{member.email}</p>
		<p>Telefoonnummer</p>
		<p>{member.phone}</p>
		<p>Ldap ID</p>
		<p>{member.ldapId}</p>
	</div>
</div>

<div id="random" class="info">
	<h2>Willekeurige tjak</h2>

	<hr />

	<div>
		<p>ID</p>
		<p>{member.id}</p>
		<p>Bijnaam</p>
		<p>{member.nickname}</p>
		<p>Eerste meeborrel</p>
		<p>{toDate(member.firstDrink)}</p>
		<p>Feut geworden</p>
		<p>{toDate(member.becameFeut)}</p>
		<p>Lid geworden</p>
		<p>{toDate(member.becameMember)}</p>
		<p>Laatst ingelogd</p>
		<p>{toDate(member.lastLoggedin)}</p>
		<p>Profiel foto</p>
		<p>{member.picture}</p>
	</div>
</div>

{#if fields.length > 0}
	<div id="missed" class="info">
		<h2>Rest (later toegevoegd)</h2>

		<hr />

		<div>
			{#each fields as field}
				<p>{field}</p>
				<p>{member[field]}</p>
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
	$size: 250px;
	$margin: 2rem;
	$gap: 1rem;

	.info {
		margin: $margin;

		@media (max-width: 600px) {
			margin: 0;
			margin-top: $margin;
		}
	}

	.error {
		color: red;
	}

	.info > div {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: $gap;
	}

	#img {
		display: grid;
		grid-template-columns: calc($size + $margin) 1fr;
		gap: $gap;

		// media query
		@media (max-width: 600px) {
			grid-template-columns: 1fr;
		}
	}

	#img div {
		display: flex;
		align-items: center;
		height: 100%;
	}

	#img form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;

		@media (max-width: 600px) {
			align-items: center;
		}
	}

	#img form p {
		margin-top: 0.5rem;
	}

	#img form button {
		margin-top: 0.5rem;
		margin-left: $gap;
	}

	#img img {
		border-radius: 100%;
		width: $size;
		height: $size;
		object-fit: cover;
		margin-left: $margin;
	}

	hr {
		margin: var(--hr-margin);
	}
</style>
