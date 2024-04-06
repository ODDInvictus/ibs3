// https://github.com/rallets/svelte-component-typed-repro/blob/main/src/App/types/simple-svelte-autocomplete.d.ts
declare module 'simple-svelte-autocomplete' {
	import type { SvelteComponent } from 'svelte'

	export interface AutoCompleteProps<T> extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
		items: T[]
		searchFunction?: () => Promise<T[]>
		delay?: number
		localFiltering?: boolean
		localSorting?: boolean
		cleanUserText?: boolean
		multiple?: boolean
		orderableSection?: boolean
		selectedItem?: T
		highlightedItem?: T
		labelFieldName?: string
		keywordsFieldName?: string
		value: T
		valueFieldName?: string
		labelFunction?: (a: T) => string
		keywordsFunction?: (a: T) => string
		valueFunction?: (a: T) => string
		keywordsCleanFunction?: (string) => string
		lowercaseKeywords?: boolean
		textCleanFunction?: (string) => string
		selectFirstIfEmpty?: boolean
		minCharactersToSearch?: number
		maxItemsToShowInList?: number
		ignoreAccents?: boolean
		matchAllKeywords?: boolean
		sortByMatchedKeywords?: boolean
		itemSortFunction?: (a: T, b: T) => number
		itemFilterFunction?: (a: T, string) => boolean
		disabled?: boolean
		readonly?: boolean
		lock?: boolean
		create?: boolean
		closeOnBlur?: boolean
		flag?: boolean

		placeholder?: string
		noResultsText?: string
		moreItemsText?: string
		createText?: string
		hideArrow?: boolean
		showClear?: boolean
		showLoadingIndicator?: boolean

		className?: string
		inputClassName?: string
		noInputClassName?: boolean
		inputId?: string
		dropdownClassName?: string
		name?: string
		html5autocomplete?: boolean
		autocompleteOffValue?: string
		selectName?: string
		required?: boolean
		tabIndex?: number
		onFocus?: () => any
		beforeSearch?: (oldSelectedItem: T, newSelectedItem: T) => any
		onChange?: (newSelectedItem: T) => any
		onBlur?: () => any
		onCreate?: (text: string) => any
	}

	export interface AutoCompleteEvents {}

	export default class AutoComplete extends SvelteComponent<
		AutoCompleteProps<T>,
		AutoCompleteEvents,
		{
			item: { item: T }
			'no-results': null
		}
	> {}
}
