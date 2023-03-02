<script lang="ts">
  import StyledButton from "$lib/components/StyledButton.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  console.log(data.users);
</script>

<h1>
  {data.committee.name}
</h1>
<hr />
<main>
  <rows>
    <left>
      <h2>Commissieleden ({data.committee.CommitteeMember.length})</h2>
      <ul>
        {#each data.committee.CommitteeMember as membership}
          <li>
            <a href={`leden/${membership.member.ldapId}`}>
              {membership.member.firstName}
            </a>
            <span>
              {membership.function}
            </span>
          </li>
        {/each}
      </ul>
    </left>

    <right>
      <!-- TODO: Hier daadwerklijk iets mee doen -->
      <form method="UPDATE">
        <h2>Naam wijzigen</h2>
        <label for="name">Naam</label>
        <input type="text" name="name" placeholder="Naam" required />
        <StyledButton type="submit" restProps={{}}>Wijzigen</StyledButton>
      </form>

      <form method="UPDATE">
        <h2>Lid toevoegen</h2>
        <label for="member">Nieuw lid</label>
        <select name="member" required>
          <option value="" disabled selected hidden>Lid</option>
          {#each data.users as user}
            <option value={user.id}>{user.nickname || user.firstName}</option>
          {/each}
        </select>
        <!-- TODO: Voeg een warning toe bij leden en senaat dat iemand meer rechten krijgt -->
        <StyledButton type="submit" restProps={{}}>Toevoegen</StyledButton>
      </form>

      <!-- TODO: Deze button weghalen voor senaat, leden en feuten -->
      <button
        class="text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
      >
        Commissie verwijderen
      </button>
    </right>
  </rows>
</main>

<style lang="scss">
  main {
    display: flex;
    justify-content: center;
  }
  rows {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: fit-content;
    gap: 1rem;

    right {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      form {
        display: flex;
        flex-direction: column;

        label {
          color: black;
          font-weight: 600;
        }

        input,
        select {
          margin-top: 0.2rem;
          margin-bottom: 0.5rem;
          width: 100%;
          border-radius: 5px;
          border: 1px solid #d1d5db;

          &:invalid {
            color: gray;
          }
        }
      }
    }
  }
  h1 {
    text-align: center;
    font-weight: 600;
    font-size: larger;
  }

  hr {
    margin: 1rem 0;
  }

  h2 {
    font-weight: bold;
  }

  ul {
    list-style-type: circle;
    list-style-position: inside;

    li {
      span {
        font-size: small;
      }
      a {
        color: #010a4a;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
