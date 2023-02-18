<script lang="ts">
  import { Plus, Minus } from "svelte-heros-v2";
  import Modal from "./Modal.svelte";
  import { openModal } from "svelte-modals";
  import type { sbUser } from "./types";

  export let data: sbUser[];

  const trekBak = (id: number, index: number) => {
    changeCount(index, -1);
    fetch("/strafbakken", {
      method: "DELETE",
      body: JSON.stringify({
        user: id,
      }),
    }).catch(() => {
      changeCount(index, 1);
    });
  };

  const changeCount = (index: number, n: number) => {
    data[index]._count.StrafbakReceived += n;
  };
</script>

<table>
  <thead>
    <tr>
      <th>Naam</th>
      <th>Bakken</th>
      <th>Acties</th>
    </tr>
  </thead>
  <tbody>
    {#each data as user, i}
      <tr class="p-20">
        <td>
          <a href={`/strafbakken/${user.firstName.toLowerCase()}`}>
            {user.nickname || user.firstName}
          </a>
        </td>
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

<style lang="scss">
  $tr-padding: 0.75rem;

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
</style>
