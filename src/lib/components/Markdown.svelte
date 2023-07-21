<script lang="ts">
	import { goto } from '$app/navigation';
  import InfoCircle from '~icons/tabler/info-circle';

  export let text: string;
  let className: string;
  export { className as class };
</script>

<main class={className}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="heading" on:click={() => goto("/markdown")}>
    <p>markdown</p>
    <div class="icon">
      <InfoCircle />
    </div>
  </div>
  <p>{@html text}</p>
</main>

<style lang="scss">
  $spacing: 0.5rem;
  $headingFontSize: 0.75rem;

  main {
    background-color: #eee;
    color: #666;
    padding: $spacing;
    padding-top: calc(2 * $spacing + $headingFontSize);
    border-radius: 6px;
    width: 100%;
    position: relative;
    word-wrap: break-word;
  }

  .heading {
    display: flex;
    position: absolute;
    color: #ccc;
    font-size: $headingFontSize;
    top: $spacing;
    left: $spacing;
    gap: calc($spacing / 2);
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }

    .icon {
      transform: translateY(2px);
    }
  }
</style>