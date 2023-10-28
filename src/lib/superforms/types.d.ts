import type { z, AnyZodObject } from 'zod';
import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
import type { SuperForm } from 'sveltekit-superforms/client';

type T = $$Generic<AnyZodObject>;

export type formProps = SuperForm<ZodValidation<T>, unknown>;

export type field = FormPathLeaves<z.infer<T>>;
