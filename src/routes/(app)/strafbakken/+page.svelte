<script lang="ts">
  import { page } from "$app/stores";
  import { Plus, Minus } from "svelte-heros-v2";
  import Modal from "./Modal.svelte";
  import { openModal } from "svelte-modals";

  const trekBak = (id: number, index: number) => {
    fetch("/strafbakken", {
      method: "DELETE",
      body: JSON.stringify({
        user: id,
      }),
    }).catch(console.error);
  };
</script>

<main>
  <table-container>
    <table>
      <thead>
        <tr>
          <th>Naam</th>
          <th>Bakken</th>
          <th>Acties</th>
        </tr>
      </thead>
      <tbody>
        {#each $page.data.strafbakken as user, i}
          <tr class="p-20">
            <td>{user.nickname || user.firstName}</td>
            <td>{user._count.StrafbakReceived}</td>
            <td class="actions">
              <Plus
                class="cursor-pointer hover:invert-[.35] transition z-0"
                on:click={() =>
                  openModal(Modal, {
                    username: user.nickname || user.firstName,
                    uid: user.id,
                  })}
              />
              <Minus
                class={user._count.StrafbakReceived
                  ? "cursor-pointer hover:invert-[.35] transition z-0"
                  : "invert-[.6] transition z-0"}
                on:click={user._count.StrafbakReceived
                  ? () => trekBak(user.id, i)
                  : null}
              />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </table-container>
</main>

<style lang="scss">
  $tr-padding: 0.75rem;

  table-container {
    width: 100%;
    place-items: center;
    display: grid;

    td,
    th {
      padding: $tr-padding;
      text-align: left;
    }

    tbody {
      tr {
        transition: all 0.4s ease;

        &:nth-child(odd) {
          background-color: #d3c0ff;
        }

        &:has(td:not(.actions):hover) {
          background-color: #ae9ed3;
        }

        td:not(.actions) {
          cursor: pointer;
        }

        .actions {
          display: flex;
          gap: $tr-padding;
          transform: translateX(-2px);
        }
      }
    }
  }
</style>
