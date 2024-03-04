import { toast } from '$lib/notification';
import type { ActionResult, MaybePromise } from '@sveltejs/kit';
import type { Writable } from 'svelte/store';
import type { SuperValidated, UnwrapEffects, ZodValidation } from 'sveltekit-superforms';
import type { AnyZodObject } from 'zod';

type onError = (event: {
	result: {
		type: 'error';
		status?: number;
		error: App.Error;
	};
	message: Writable<SuperValidated<UnwrapEffects<ZodValidation<AnyZodObject>>, any>['message']>;
}) => MaybePromise<unknown | void>;

export const onError = (({ result }) => {
	toast({
		title: `Error: ${result.status}`,
		message: result.error.message,
		type: 'danger'
	});
}) satisfies onError;

type onResult = (event: {
	result: ActionResult;
	formEl: HTMLFormElement;
	cancel: () => void;
}) => void;

export const onResult = (({ result }) => {
	console.log(result);
	if (result.type == 'failure') {
		toast({
			title: `Error: ${result.status}`,
			message: result.data?.message ?? 'An unknown error occurred',
			type: 'danger'
		});
	}
}) satisfies onResult;
