<script lang="ts">
  import { closeModal } from "svelte-modals";
  import { enhance } from "$app/forms";

  //let error = "";
  export let submitted = false;

  export let isOpen: boolean;
  export let username: string;
  export let uid: number;
  export let changeCount: (index: number, n: number) => void;
  export let index: number;
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div>
      <div class="contents">
        <h2>{username} verdient een bak!</h2>
        <form
          method="POST"
          use:enhance={(event) => {
            return async ({ result, update }) => {
              if (result.type === "failure") {
                //error = result.data?.message;
                update();
              } else {
                //error = "";
                update();
              }
            };
          }}
          on:submit={(e) => {
            if (submitted) return e.preventDefault();
            submitted = true;
            changeCount(index, 1);
            setTimeout(() => {
              closeModal();
            }, 1000);
          }}
        >
          <p>Reden:</p>
          <input type="number" name="receiver" hidden value={uid} />
          <textarea name="reason" />
          <button type="submit" class={submitted ? "clicked" : ""}>
            Verzenden
          </button>
        </form>
      </div>
      <div class={submitted ? "progress active" : "progress"} />
    </div>
  </div>
{/if}

<style lang="scss">
  $spacing: 1.5em;

  /* Copy pasta styles */
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 2;

    pointer-events: none;
  }

  .contents {
    min-width: 240px;
    border-radius: 6px;
    padding: $spacing;
    background: white;
    display: flex;
    flex-direction: column;
    pointer-events: auto;

    h2 {
      text-align: center;
      font-size: 1.5rem;
    }
  }

  /* Naut's styles */
  form {
    display: flex;
    flex-direction: column;
    margin-top: $spacing;

    textarea {
      width: 100%;
      height: 4.3rem;
      margin-bottom: $spacing;
      border: 1px solid black;

      &:focus {
        outline: none;
        border: 1px solid black;
        box-shadow: none;
      }
    }

    button {
      width: fit-content;
      display: block;
      margin-left: auto;
      margin-right: auto;
      color: white;
      font-weight: 500;
      font-size: 0.875rem;
      text-align: center;
      padding: 0.625rem 1.25rem;
      background: linear-gradient(
        90deg,
        rgba(144, 97, 249, 1) 0%,
        rgba(126, 58, 242, 1) 50%,
        rgba(108, 43, 217, 1) 100%
      );
      border-radius: 0.5rem;
      transition: all 1s ease;

      &.clicked {
        background: linear-gradient(
          180deg,
          rgb(0, 255, 0) 0%,
          rgba(20, 230, 20, 1) 50%,
          rgba(40, 200, 40, 1) 100%
        ) !important;
      }

      &:hover {
        background: linear-gradient(
          180deg,
          rgba(144, 97, 249, 1) 0%,
          rgba(126, 58, 242, 1) 50%,
          rgba(108, 43, 217, 1) 100%
        );
      }
    }
  }

  .progress {
    width: 0px;
    height: 5px;
    background-color: rgb(0, 255, 0);
    transition: width 1s ease;
    display: block;
    margin-left: auto;
    margin-right: auto;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;

    &.active {
      width: 95%;
    }
  }
</style>
