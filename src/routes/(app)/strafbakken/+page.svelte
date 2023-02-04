<script lang="ts">
  import type { PageData } from "../$types";
  import { Plus, Minus } from "svelte-heros-v2";
  import Modal from "./Modal.svelte";
  import { openModal } from "svelte-modals";
  import type { User } from "@prisma/client";

  import { Modals, closeModal } from "svelte-modals";

  interface sb extends User {
    _count: {
      StrafbakReceived: number;
    };
  }

  interface sbPageData extends PageData {
    strafbakken: sb[];
  }

  export let data: sbPageData;

  const trekBak = (id: number, index: number) => {
    changeCount(index, -1);
    fetch("/strafbakken", {
      method: "DELETE",
      body: JSON.stringify({
        user: id,
      }),
    }).catch(console.error);
  };

  const changeCount = (index: number, n: number) => {
    data.strafbakken[index]._count.StrafbakReceived += n;
  };
</script>

<main>
  <Modals>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div slot="backdrop" class="backdrop" on:click={closeModal} />
  </Modals>
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
        {#each data.strafbakken as user, i}
          <tr class="p-20">
            <td>{user.nickname || user.firstName}</td>
            <td>{user._count.StrafbakReceived}</td>
            <td class="actions">
              <Plus
                class="cursor-pointer hover:invert-[.35] transition z-0 focus:outline-0"
                on:click={() =>
                  openModal(Modal, {
                    username: user.nickname || user.firstName,
                    uid: user.id,
                    changeCount,
                    index: i,
                  })}
              />
              <Minus
                class={user._count.StrafbakReceived
                  ? "cursor-pointer hover:invert-[.35] transition z-0 focus:outline-0"
                  : "invert-[.6] transition z-0 focus:outline-0"}
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

        // &:has(td:not(.actions):hover) {
        //   background-color: #ae9ed3;
        // }

        // td:not(.actions) {
        //   cursor: pointer;
        // }

        .actions {
          display: flex;
          gap: $tr-padding;
          transform: translateX(-2px);
        }
      }
    }
  }

  .backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
</style>
