<script lang="ts">
  import { Plus, Minus } from "svelte-heros-v2";
  import Modal from "./Modal.svelte";
  import { openModal } from "svelte-modals";
  import type { sbUser } from "./types";
  import { space } from "svelte/internal";

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

<main>
  <thead>
    <th>Naam</th>
    <th>Bakken</th>
    <th>Acties</th>
  </thead>
  <tbody>
    {#each data as user, i}
      <table-row>
        <a
          href={`/strafbakken/${user.firstName.toLowerCase()}`}
          class={`cell c${i}`}
        >
          {user.nickname || user.firstName}
        </a>
        <a
          href={`/strafbakken/${user.firstName.toLowerCase()}`}
          class={`cell c${i}`}
        >
          {user._count.StrafbakReceived}
        </a>
        <div class={`actions cell c${i}`}>
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
              : "invert-[.6] transition z-0 focus:outline-0 -translate-x-1"}
            on:click={user._count.StrafbakReceived
              ? () => trekBak(user.id, i)
              : null}
          />
        </div>
      </table-row>
    {/each}
  </tbody>
</main>

<style lang="scss">
  $cell-padding: 0.75rem;

  thead {
    display: flex;
    justify-content: space-around;

    th {
      padding: $cell-padding;
      text-align: left;
    }
  }

  tbody {
    display: grid;
    grid-template-columns: 1fr;

    table-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      transition: all 0.4s ease;

      &:nth-child(odd) {
        background-color: #d3c0ff;
      }

      &:has(.cell:not(.actions):hover) {
        background-color: #ae9ed3;
      }

      .cell {
        padding: $cell-padding;
      }
    }

    .actions {
      display: flex;
      gap: $cell-padding;
    }
  }
</style>
