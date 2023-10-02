<script lang="ts">
	import type { Field, FieldType } from './form-generator';
	import Label from './_label.svelte';

	export let field: Field<FieldType>;

	const addTableAndRow = (table: string, row: number, field: Field<FieldType>) => {
		if (!field.name.startsWith('table-')) field.name = `table-${table}-${row}-${field.name}`;
		return field;
	};
</script>

{#if field.type === 'select'}
	<select name={field.name} id={field.name}>
		{#if !field.options}
			<option value="">Geen opties</option>
		{:else}
			<option disabled={!field.optional} selected value>Selecteer een optie</option>
			{#each field.options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		{/if}
	</select>
{:else if field.type === 'checkbox'}
	<input type="checkbox" name={field.name} id={field.name} checked={Boolean(field.value)} />
{:else if field.type === 'textarea'}
	<textarea
		name={field.name}
		id={field.name}
		placeholder={field.placeholder}
		value={field.value?.toString() || ''}
	/>
{:else if field.type === 'table' && field.columns}
	<table id={field.name}>
		<thead>
			{#if field.rowLabels}
				<th>{field.rowLabelName ?? ''}</th>
			{/if}
			{#each field.columns as column}
				<th><Label field={column} /></th>
			{/each}
		</thead>
		<tbody>
			{#each Array(field.rows ?? 1) as _, i}
				<tr>
					{#if field.rowLabels}
						<td class="left-align">{field.rowLabels[i] ?? ''}</td>
					{/if}
					{#each field.columns as column}
						<td>
							<svelte:self field={addTableAndRow(field.name, i, column)} />
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<input
		type={field.type}
		name={field.name}
		id={field.name}
		placeholder={field.placeholder}
		value={field.value?.toString() || ''}
		min={field.minValue}
		max={field.maxValue}
		step={field.step}
	/>
{/if}
{#if field.type !== 'table'}
	<p id="{field.name}-error" class="form-error" />
{/if}

<style>
	.left-align {
		text-align: left;
	}
</style>
