<script lang="ts">
	import type { Field, FieldType } from './form-generator'
	import Label from './_label.svelte'
	import Trash from '~icons/tabler/trash'
	import Plus from '~icons/tabler/plus'
	import { onMount } from 'svelte'

	export let field: Field<FieldType>

	const addTableAndRow = (table: Field<'table'>, row: number, field: Field<FieldType>) => {
		const f = { ...field }

		if (table.value) {
			const rowValues = table.value[row]
			if (rowValues) {
				const value = rowValues[f.name]
				if (value) f.value = value
			}
		}

		if (!f.name.startsWith('table-')) f.name = `table-${table.name}-${row}-${f.name}`
		return f
	}

	let rows: number[] = []
	let deleted: number[] = []

	const getMaxRow = (rows: number[], deleted: number[]) => {
		if (field.type === 'table') {
			return Math.max(...rows.filter(row => !deleted.includes(row)))
		}
		return 0
	}

	// TODO fix table.rows
	let mounted = false
	$: if (field.type !== 'select' && field.type !== 'table') mounted = true
	onMount(() => {
		if (field.type === 'table') {
			delete field.rows
			// @ts-expect-error
			rows = Array.from(Array(field.value?.length || 1).keys())
		}
		mounted = true
	})

	const noType = (x: any) => x
</script>

{#if mounted}
	{#if field.type === 'select'}
		<select name={field.name} id={field.name} disabled={field.disabled} data-testid="{field.name}-input">
			{#if !field.options}
				<option value="">Geen opties</option>
			{:else}
				<option disabled={!field.optional} selected value>Selecteer een optie</option>
				{#each field.options as option}
					<option selected={field.value == option.value} value={option.value}>{option.label}</option>
				{/each}
			{/if}
		</select>
	{:else if field.type === 'checkbox'}
		<input
			type="checkbox"
			name={field.name}
			id={field.name}
			checked={Boolean(field.value)}
			disabled={field.disabled}
			data-testid="{field.name}-input" />
	{:else if field.type === 'textarea'}
		<textarea
			name={field.name}
			id={field.name}
			placeholder={field.placeholder}
			value={field.value?.toString() || ''}
			disabled={field.disabled}
			data-testid="{field.name}-input" />
	{:else if field.type === 'table' && field.columns}
		<table id={field.name}>
			<thead>
				{#if field.rowLabels}
					<th>{field.rowLabelName ?? ''}</th>
				{/if}
				{#each field.columns as column}
					<th><Label field={column} /></th>
				{/each}
				<th />
				<th />
			</thead>
			<tbody>
				{#each rows as i}
					{#if !deleted.includes(i)}
						<tr>
							{#if field.rowLabels}
								<td class="left-align">{field.rowLabels[i] ?? ''}</td>
							{/if}
							{#each field.columns as column}
								<td>
									<svelte:self field={addTableAndRow(noType(field), i, column)} />
								</td>
							{/each}
							<td>
								{#if i == getMaxRow(rows, deleted)}
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<i on:click={() => (rows = [...rows, Math.max(...rows) + 1])}><Plus /></i>
								{/if}
							</td>
							<td>
								{#if rows.length - deleted.length > 1}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<i on:click={() => (deleted = [...deleted, i])}><Trash /></i>
								{/if}
							</td>
						</tr>
					{/if}
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
			disabled={field.disabled}
			data-testid="{field.name}-input" />
	{/if}
	{#if field.type !== 'table'}
		<p id="{field.name}-error" class="form-error" />
	{/if}
{:else}
	{#if field.type == 'table'}
		<div class="spacer" />
	{/if}
	<div class="loader" />
	{#if field.type == 'table'}
		<div class="spacer" />
		<div class="loader table" />
	{/if}
{/if}

<style>
	.left-align {
		text-align: left;
	}

	.loader {
		background: linear-gradient(-45deg, #f3f3f3 0%, #e0e0e0 50%, #f3f3f3 100%);
		animation: loading 1.5s ease infinite;
		background-size: 400% 400%;
		border-radius: 1rem;
		min-height: 41px;
	}

	.spacer {
		height: 41px;
	}

	table,
	.table {
		margin-bottom: 1rem;
	}

	@keyframes loading {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	*:disabled {
		background-color: #f3f3f3;
		color: #c0c0c0;
	}
</style>
