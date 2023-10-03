import type { Roles } from '$lib/constants';
import db from '$lib/server/db';
import type { User } from '@prisma/client';
import { fail, type Actions } from '@sveltejs/kit';
import { z } from 'zod';

// All possible fields
export type FieldType = TableFieldType | TableField;

export type TableFieldType =
	| TextField
	| 'number'
	| 'date'
	| CheckboxField
	| 'time'
	| SelectField
	| CustomFields
	| 'url'
	| 'hidden';
export type SelectField = 'select';
export type TextField = 'text' | 'textarea';
export type CheckboxField = 'checkbox';
export type CustomFields = 'user' | 'committee' | 'location' | 'relation';
export type TableField = 'table';

export type OptionField<T extends InputType> = {
	label: string;
	value: T;
};

export type InputType = string | number;

// Custom fields
export type UserField = 'user';

export type Field<T extends FieldType> = {
	label: string;
	name: string;
	type: T;
	// TODO fix table type
	value?: T extends TextField | 'time'
		? string
		: T extends SelectField
		? OptionField<InputType>
		: T extends CheckboxField
		? boolean
		: T extends 'number'
		? number
		: T extends 'date'
		? Date
		: T extends TableField
		? any[]
		: never;
	markdown?: boolean;
	optional?: boolean;
	maxValue?: number;
	minValue?: number;
	step?: number;
	maxLength?: number;
	minLength?: number;
	options?: T extends SelectField ? OptionField<InputType>[] : never;
	getOptions?: () => Promise<OptionField<InputType>[]>;
	description?: string;
	placeholder?: string;
	columns?: T extends TableField ? Field<TableFieldType>[] : never;
	rows?: T extends TableField ? number : never;
	rowLabels?: T extends TableField ? string[] : never;
	rowLabelName?: T extends TableField ? string : never;
};

export type FormError = {
	field?: string | number;
	message: string;
};

export type LogicReturnType = LogicReturnSuccessType | LogicReturnErrorType;

type LogicReturnSuccessType = {
	success: true;
	message: string;
	status: 200 | 201 | 204;
	redirectTo: string;
};

type LogicReturnErrorType = {
	success: false;
	message?: string;
	errors?: FormError[];
	status: number;
};

type LogicDataType<T> = T & {
	user: User;
};

type FormType<T> = {
	title: string;
	shortTitle?: string;
	description?: string;
	formId: string;
	fields: Field<FieldType>[];
	submitStr: string;
	requiredRoles: Roles[];
	actionName?: string;
	needsConfirmation?: boolean;
	confirmText?: string;
	logic: (data: LogicDataType<T>) => Promise<LogicReturnType>;
	extraValidators?: (data: T) => Promise<FormError[]>;
};

type TransformOptions<T> = {
	user?: User;
	values?: T;
};

export class Form<T> {
	private f;
	private zodSchema = z.object({});

	private transformed = false;

	constructor(form: FormType<T>) {
		this.f = form;
	}

	private async generateZod(fields: Field<FieldType>[] = this.f.fields) {
		let zod = z.object({});

		for (const field of fields) {
			if (field.type === 'table') {
				const columns = field.columns!;
				const obj: { [key: string]: any } = {};
				for (const column of columns) {
					obj[column.name] = await this.generateZodObject(column);
				}
				const tableSchema = z.object(obj);
				zod = zod.extend({
					[field.name]: z.array(tableSchema)
				});
			} else {
				zod = zod.extend({
					[field.name]: await this.generateZodObject(field)
				});
			}
		}

		this.zodSchema = zod;
	}

	private async generateZodObject(field: Field<FieldType>) {
		let obj;
		const label = field.label;

		// Generate a zod object for all possible types
		// text, number, date, checkbox, time, select, url, textarea

		if (field.type === 'select') {
			// Now check if there is a field.options with more than 0 items, or, if the field has a getOptions function
			if (!field.options && !field.getOptions) {
				throw new Error(`Select field has neither options nor getOptions`);
			}

			if (field.getOptions) {
				field.options = await field.getOptions();
			}

			// @ts-expect-error
			const options = field.options.map((option) => String(option.value));

			obj = z.enum([options[0], ...options.slice(1)]);
		} else if (field.type === 'checkbox') {
			obj = z.preprocess((value) => value === 'on', z.boolean());
		} else if (field.type === 'number') {
			const min = field.minValue || Number.MIN_SAFE_INTEGER;
			const max = field.maxValue || Number.MAX_SAFE_INTEGER;

			obj = z.preprocess(
				(value) => Number(value),
				z.coerce
					.number()
					.min(min, { message: `${label} moet minimaal ${min} zijn` })
					.max(max, { message: `${label} mag maximaal ${max} zijn` })
			);
		} else if (field.type === 'date') {
			obj = z
				.string()
				.transform((value) => {
					return new Date(value);
				})
				.refine(
					(value) => {
						return value instanceof Date && !isNaN(value.getTime());
					},
					{ message: `${label} is verplicht` }
				);
		} else if (field.type === 'textarea') {
			obj = z.string().min(3, { message: `${label} moet minimaal 3 karakters bevatten` });
		} else if (field.type === 'time') {
			obj = z
				.string()
				.transform((value) => {
					const [hours, minutes] = value.split(':');

					return new Date(0, 0, 0, Number(hours), Number(minutes));
				})
				.refine(
					(value) => {
						return value instanceof Date && !isNaN(value.getTime());
					},
					{ message: `${label} is verplicht` }
				);
		} else if (field.type === 'url') {
			obj = z.string().url({ message: `${label} is geen geldige URL` });
		} else if (field.type === 'hidden') {
			obj = z.string();
		} else {
			const min = field.minLength || 0;
			const max = field.maxLength || 190;

			obj = z
				.string()
				.min(min, { message: `${label} moet minimaal ${min} karakters bevatten` })
				.max(max, { message: `${label} mag maximaal ${max} karakters bevatten` });
		}

		if (field.optional) {
			if (field.type !== 'url') {
				obj = obj!.optional().or(z.literal(''));
			}
		}

		return obj!;
	}

	/**
	 * Transforms the form to a format that can be used by the frontend
	 * @param user The user that is using the form
	 * @param values The values that should be pre-filled in the form
	 * @example
	 * ```ts
	 * await form.transform({ user: locals.user, values: { name: 'Naut' } });
	 * ```
	 */
	async transform({ user, values }: TransformOptions<T> = {}) {
		await this.transformFields(this.f.fields, { user, values });
		this.transformed = true;
		await this.generateZod();
	}

	private async transformFields(fields: Field<FieldType>[], options: TransformOptions<T> = {}) {
		const { user, values } = options;

		for (const field of fields) {
			// @ts-expect-error
			if (values && field.name in values) field.value = values[field.name];

			if (field.type === 'user') {
				const users = await db.user.findMany({
					where: {
						isActive: true
					}
				});

				field.options = users.map((user) => ({
					label: `${user.firstName} ${user.lastName}`,
					value: user.ldapId
				}));
				field.type = 'select';
			} else if (field.type === 'committee') {
				const committees = await db.committee.findMany({
					where: {
						isActive: true
					}
				});

				field.options = committees.map((committee) => ({
					label: committee.name,
					value: committee.ldapId
				}));

				field.type = 'select';
			} else if (field.type === 'location') {
				const locations = await db.activityLocation.findMany({
					where: {
						isActive: true
					}
				});

				field.options = locations.map((location) => ({
					label: location.name,
					value: location.id
				}));

				field.type = 'select';
			} else if (field.type === 'select') {
				if (!field.getOptions && !field.options) {
					throw new Error('Select field has neither options nor getOptions');
				}

				if (field.getOptions) field.options = await field.getOptions();
				field.getOptions = undefined;
			} else if (field.type == 'relation') {
				const relations = await db.financialPerson.findMany({
					where: { type: 'OTHER', isActive: true }
				});

				field.options = relations.map((relation) => ({
					label: `${relation.id} - ${relation.name}`,
					value: relation.id
				}));
				field.type = 'select';
			} else if (field.type === 'table' && field.columns) {
				await this.transformFields(field.columns, options);
			}

			if (field.value instanceof Date) field.value = field.value.toISOString().split('T')[0];
		}
	}

	async checkRoles(locals: App.Locals): Promise<[boolean, string[]]> {
		// Check if the user has the required roles
		const committees = await db.committeeMember.findMany({
			where: {
				userId: locals.user.id
			},
			include: {
				committee: {
					select: {
						ldapId: true
					}
				}
			}
		});

		const userRoles = committees.map((cm) => cm.committee.ldapId);

		const hasOneRole = this.f.requiredRoles.some((role) => userRoles.includes(role));

		if (hasOneRole) {
			return [true, []];
		} else {
			return [false, this.f.requiredRoles.filter((role) => !userRoles.includes(role))];
		}
	}

	async validate<T>(object: T): Promise<T | FormError[]> {
		// Validate against the zod schema
		const x = this.zodSchema.safeParse(object);

		let extraErrors: FormError[] = [];

		if (this.f.extraValidators) {
			// Validate against the extra validators
			// @ts-expect-error Klopt wel
			extraErrors = await this.f.extraValidators(object);
		}

		let zodErrors: FormError[] = [];

		if (!x.success) {
			zodErrors = x.error.issues.map((obj) => {
				return {
					field: obj.path[0],
					message: obj.message
				};
			});
		}

		if (zodErrors.length > 0 || extraErrors.length > 0) {
			return [...zodErrors, ...extraErrors];
		}

		// @ts-expect-error Klopt wel
		return x.data as T;
	}

	private parseFormData(data: any) {
		const parsedFormData: { [key: string]: any } = {};
		for (const [key, value] of data) {
			if (!key.startsWith('table-')) {
				parsedFormData[key] = value;
				continue;
			}

			const [_, table, row, name] = key.split('-');

			// Table is the name of the table
			if (!parsedFormData[table]) parsedFormData[table] = [];

			// Row is the row number
			const rowNumber = Number(row);
			if (isNaN(rowNumber)) return;

			// Name is the name of the field
			if (!parsedFormData[table][rowNumber]) parsedFormData[table][rowNumber] = {};
			parsedFormData[table][rowNumber][name] = value;
		}
		return parsedFormData;
	}

	get actions() {
		return {
			[this.f.actionName || 'default']: async ({ request, locals }) => {
				const [ok, committees] = await this.checkRoles(locals);

				if (!ok) {
					return fail(403, {
						success: false,
						message:
							'Je hebt niet de juiste rechten om dit formulier te gebruiken. Je mist een van de volgende rollen: ' +
							committees.join(', '),
						errors: []
					});
				}

				const formData = await request.formData();
				const body = this.parseFormData(formData);

				let validated = await this.validate<T>(body as T);

				if (validated instanceof Array && validated.length > 0) {
					return fail(400, {
						success: false,
						message: 'Niet elk veld is correct ingevuld.',
						errors: validated
					});
				}

				validated = validated as Awaited<T>;

				(validated as LogicDataType<T>).user = locals.user;

				// @ts-expect-error
				const ret = await this.f.logic(validated);

				if (ret.success) {
					return ret;
				} else {
					return fail(ret.status, ret);
				}
			}
		} satisfies Actions;
	}

	get attributes() {
		if (!this.transformed) throw new Error('Form not transformed yet, call transform() first');

		return {
			title: this.f.title,
			shortTitle: this.f.shortTitle,
			description: this.f.description,
			fields: this.f.fields,
			needsConfirmation: this.f.needsConfirmation,
			confirmText: this.f.confirmText,
			submitStr: this.f.submitStr
		};
	}
}
