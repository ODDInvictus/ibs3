<script lang="ts">
  import type { PageData } from "./$types";
  import StyledButton from "$lib/components/StyledButton.svelte";
  import { enhance } from "$app/forms";

  export let data: PageData;
</script>

<main>
  <rows>
    <left>
      <h2>Comissies</h2>
      <ul>
        {#each data.committees as committee}
          <li>
            <a href={`/commissies/${committee.ldapId}`}>{committee.name}</a>
          </li>
        {/each}
      </ul>
    </left>
    <right>
      <h2>Commissie maken</h2>
      <form
        method="post"
        use:enhance={(event) => {
          return async ({ result, update }) => {
            console.log(result);
          };
        }}
      >
        <label for="name">Naam</label>
        <input type="text" name="name" placeholder="Naam" required />
        <StyledButton type="submit" restProps={{}}>Aanmaken</StyledButton>
      </form>
    </right>
  </rows>
</main>

<style lang="scss">
  main {
    display: flex;
    justify-content: center;

    rows {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: fit-content;

      h2 {
        font-weight: bold;
      }

      left {
        ul {
          list-style-type: circle;
          list-style-position: inside;

          a {
            color: #010a4a;
          }

          li:hover {
            text-decoration: underline;
          }
        }
      }

      right {
        form {
          display: flex;
          flex-direction: column;

          label {
            color: black;
            font-weight: 600;
          }

          input {
            margin-top: 0.2rem;
            margin-bottom: 0.5rem;
            width: 100%;
            border-radius: 5px;
            border: 1px solid #d1d5db;
          }
        }
      }
    }
  }
</style>
