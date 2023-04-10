<script lang="ts">
  import { page } from '$app/stores'
  let member = $page.data.member

  function getAge(birthDate: Date) {
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

  function toDate(date: string) {
    if (!date) return undefined
    return new Date(date).toLocaleDateString('nl-NL')
  }
</script>


<h1>{member.firstName} {member.lastName}</h1>

<hr />

<table>
  <tr>
    <td>Voornaam</td>
    <td>{member.firstName}</td>
  </tr>
  <tr>
    <td>Achternaam</td>
    <td>{member.lastName}</td>
  </tr>
  <tr>
    <td>Geboortedatum</td>
    <td>{toDate(member.birthDate)}</td>
  </tr>
  <tr>
    <td>Leeftijd</td>
    <td>{getAge(new Date(member.birthDate))}</td>
  </tr>
  <tr>
    <td>Telefoonnummer</td>
    <td>{member.phoneNumber}</td>
  </tr>
  <tr>
    <td>Email</td>
    <td>{member.email}</td>
  </tr>
  <tr>
    <td>Bijnaam</td>
    <td>{member.nickname}</td>
  </tr>
  <tr>
    <td>LDAP id</td>
    <td>{member.ldapId}</td>
  </tr>
  <tr>
    <td>Profiel foto</td>
    <td>{member.picture}</td>
  </tr>
  <tr>
    <td>Eerste meeborrel</td>
    <td>{toDate(member.firstDrink)}</td>
  </tr>
  <tr>
    <td>Feut geworden</td>
    <td>{toDate(member.becameFeut)}</td>
  </tr>
  <tr>
    <td>Lid geworden</td>
    <td>{toDate(member.becameMember)}</td>
  </tr>
  <tr>
    <td>Laatst ingelogd</td>
    <td>{toDate(member.lastLoggedIn)}</td>
  </tr>
</table>

<style>
  h1 {
    text-align: center;
  }

  a {
    color: var(--link-color);
  }

  hr {
    margin: var(--hr-margin);
  }
</style>