import { toast } from '$lib/notification';
import type { MaybePromise } from '@sveltejs/kit';
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
	console.log('hello');
	toast({
		title: `Error: ${result.status}`,
		message: result.error.message,
		type: 'danger'
	});
}) satisfies onError;
