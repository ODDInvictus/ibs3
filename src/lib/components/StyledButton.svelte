<script lang="ts">
  export let restProps: Record<string, unknown>;

  restProps = $$restProps;
</script>

<button
  type="button"
  {...restProps}
  class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
>
  <slot />
</button>
