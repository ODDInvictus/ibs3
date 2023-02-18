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

<div class="table">
  <th>Naam</th>
  <th>Bakken</th>
  <th>Acties</th>
  {#each data as user, i}
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
        class="cursor-pointer hover:invert-[.35] transition z-0 focus:outline-0 -translate-x-1"
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
          ? "cursor-pointer hover:invert-[.35] transition z-0 focus:outline-0 -translate-x-1"
          : "invert-[.6] transition z-0 focus:outline-0 -translate-x-1"}
        on:click={user._count.StrafbakReceived
          ? () => trekBak(user.id, i)
          : null}
      />
    </div>
  {/each}
</div>

<style lang="scss">
  $tr-padding: 0.75rem;

  th {
    padding: $tr-padding;
    text-align: left;
  }

  .table {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    .cell {
      transition: all 0.4s ease;
      padding: $tr-padding;

      &:nth-child(6n-2),
      &:nth-child(6n-1),
      &:nth-child(6n) {
        background-color: #d3c0ff;
      }
    }

    &:has(.c0:not(.actions):hover) .c0 {
      background-color: #ae9ed3;
    }

    &:has(.c1:not(.actions):hover) .c1 {
      background-color: #ae9ed3;
    }

    &:has(.c2:not(.actions):hover) .c2 {
      background-color: #ae9ed3;
    }

    &:has(.c3:not(.actions):hover) .c3 {
      background-color: #ae9ed3;
    }

    &:has(.c4:not(.actions):hover) .c4 {
      background-color: #ae9ed3;
    }

    &:has(.c5:not(.actions):hover) .c5 {
      background-color: #ae9ed3;
    }

    &:has(.c6:not(.actions):hover) .c6 {
      background-color: #ae9ed3;
    }

    &:has(.c7:not(.actions):hover) .c7 {
      background-color: #ae9ed3;
    }

    &:has(.c8:not(.actions):hover) .c8 {
      background-color: #ae9ed3;
    }

    &:has(.c9:not(.actions):hover) .c9 {
      background-color: #ae9ed3;
    }

    &:has(.c10:not(.actions):hover) .c10 {
      background-color: #ae9ed3;
    }

    &:has(.c11:not(.actions):hover) .c11 {
      background-color: #ae9ed3;
    }

    &:has(.c12:not(.actions):hover) .c12 {
      background-color: #ae9ed3;
    }

    &:has(.c13:not(.actions):hover) .c13 {
      background-color: #ae9ed3;
    }

    &:has(.c14:not(.actions):hover) .c14 {
      background-color: #ae9ed3;
    }

    &:has(.c15:not(.actions):hover) .c15 {
      background-color: #ae9ed3;
    }

    &:has(.c16:not(.actions):hover) .c16 {
      background-color: #ae9ed3;
    }

    &:has(.c17:not(.actions):hover) .c17 {
      background-color: #ae9ed3;
    }

    .actions {
      display: flex;
      gap: $tr-padding;
    }
  }
</style>
