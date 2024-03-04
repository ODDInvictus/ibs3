<script lang="ts">
	import { createFloatingActions } from 'svelte-floating-ui';
	import { offset, flip, shift } from 'svelte-floating-ui/dom';
	import type { Field, FieldType } from './form-generator';
	import Help from '~icons/tabler/help';

	const [floatingRef, floatingContent] = createFloatingActions({
		strategy: 'absolute',
		placement: 'left',
		middleware: [offset(6), flip(), shift()]
	});

	let show = false;

	export let field: Field<FieldType>;
</script>

{field.label}
{#if field.optional}
	<span class="optional"> (optioneel) </span>
{/if}
{#if field.description}
	<i
		role="tooltip"
		class="description"
		on:mouseenter={() => (show = true)}
		on:mouseleave={() => (show = false)}
	>
		<span use:floatingRef>
			<Help />
		</span>
	</i>
	{#if show}
		<div class="tooltip" use:floatingContent>
			{field.description}
		</div>
	{/if}
{/if}
