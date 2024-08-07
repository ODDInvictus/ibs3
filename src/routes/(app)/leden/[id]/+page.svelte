<script lang="ts">
	import { page } from '$app/stores'
	import { env } from '$env/dynamic/public'
	import InputFile from '$lib/components/input-file.svelte'
	import Title from '$lib/components/title.svelte'
	import { getPictureUrl } from '$lib/utils.js'
	import type { PageData } from './$types.js'

	export let data: PageData

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
		'id',
		'isActive',
		'personalEmail',
		'accessDisabled',
		'preferredTheme',
		'profilePicture',
	]

	const fields = Object.keys(data.member).filter(key => !usedFields.includes(key))

	function getAge(birthDate: Date) {
		const today = new Date()
		const age = today.getFullYear() - birthDate.getFullYear()
		const m = today.getMonth() - birthDate.getMonth()
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			return age - 1
		}
		return age
	}

	function toDate(date: Date | null) {
		if (!date) return undefined
		return new Date(date).toLocaleDateString('nl-NL')
	}

	export let form
</script>

<Title title="{data.member.firstName} {data.member.lastName}" />

<div id="img">
	<img src={getPictureUrl(data.member.profilePicture)} alt={data.member.firstName} />

	<div>
		<form method="POST" enctype="multipart/form-data">
			<InputFile name="image" id="image" accept="image/*" />
			{#if form?.success !== undefined}
				<p class="error">{form?.message}</p>
			{:else}
				<button type="submit">Upload</button>
			{/if}
		</form>
	</div>
</div>

<div id="personal" class="info">
	<h2>Persoonlijke gegevens</h2>

	<hr />

	<div>
		<p>Voornaam</p>
		<p>{data.member.firstName}</p>
		<p>Achternaam</p>
		<p>{data.member.lastName}</p>
		<p>Geboortedatum</p>
		<p>{toDate(data.member.birthDate)}</p>
		<p>Leeftijd</p>
		<p>{getAge(data.member.birthDate ?? new Date())}</p>
		<p>Persoonlijke email</p>
		<p>{data.member.personalEmail}</p>
		<p>Thema</p>
		<p>{data.member.preferredTheme}</p>
	</div>
</div>

<div id="contact" class="info">
	<h2>Contact details</h2>

	<hr />

	<div>
		<p>Email</p>
		<p>{data.member.email}</p>
		<p>Telefoonnummer</p>
		<p>{data.member.phone}</p>
		<p>Ldap ID</p>
		<p>{data.member.ldapId}</p>
	</div>
</div>

<div id="random" class="info">
	<h2>Willekeurige tjak</h2>

	<hr />

	<div>
		<p>ID</p>
		<p>{data.member.id}</p>
		<p>Actief lid</p>
		<p>{data.member.isActive}</p>
		<p>Bijnaam</p>
		<p>{data.member.nickname}</p>
		<p>Eerste meeborrel</p>
		<p>{toDate(data.member.firstDrink)}</p>
		<p>Feut geworden</p>
		<p>{toDate(data.member.becameFeut)}</p>
		<p>Lid geworden</p>
		<p>{toDate(data.member.becameMember)}</p>
		<p>Laatst ingelogd</p>
		<p>{toDate(data.member.lastLoggedin)}</p>
		<p>Profiel foto</p>
		<p>{data.member.profilePicture}</p>
		<p>Geen toegang</p>
		<p>{data.member.accessDisabled}</p>
	</div>
</div>

{#if fields.length > 0}
	<div id="missed" class="info">
		<h2>Rest (later toegevoegd)</h2>

		<hr />

		<div>
			{#each fields as field}
				<p>{field}</p>
				<p>{data.member[field]}</p>
			{/each}
		</div>
	</div>
{/if}

<div id="committees" class="info">
	<h2>Commissies</h2>

	<hr />

	<div>
		{#each $page.data.committees as committee}
			<p>{committee.name}</p>
			<a href="/leden/commissie/{committee.ldapId}">{committee.ldapId}</a>
		{/each}
	</div>
</div>

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
</style>
