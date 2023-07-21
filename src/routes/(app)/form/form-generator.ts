import db from '$lib/server/db'
import { fail } from '@sveltejs/kit'
import { z, type ZodError } from 'zod'

// All possible fields
export type FieldType = TextField | 'number' | 'date' | CheckboxField | 'time' | SelectField | CustomFields | 'url'
export type SelectField = 'select'
export type TextField = 'text' | 'textarea'
export type CheckboxField = 'checkbox'
export type CustomFields = 'user' | 'committee' | 'location'

export type OptionField<T extends InputType> = {
  label: string
  value: T
}

export type InputType = string | number

// Custom fields
export type UserField = 'user'

export type Field<T extends FieldType> = {
  label: string
  name: string
  type: T
  value?: T extends (TextField | 'time') ? string : (
    T extends SelectField ? OptionField<InputType> : (
      T extends CheckboxField ? boolean : (
        T extends 'number' ? number : never
      )
    )
  )
  markdown?: boolean
  optional?: boolean
  maxValue?: number
  minValue?: number
  maxLength?: number
  minLength?: number
  options?: T extends SelectField ? OptionField<InputType>[] : never
  description?: string
  placeholder?: string
}

export type FormError = {
  field: string | number
  message: string
}


type FormType<T> = {
  title: string
  description?: string
  formId: string
  fields: Field<FieldType>[]
  submitStr: string
  actionName?: string
  needsConfirmation?: boolean
  confirmText?: string
  logic: (data: T) => Promise<void>
  extraValidators?: (data: T) => FormError[]
}

export class Form<T> {

  private f
  private zodSchema = z.object({})
  private type = {}

  private transformed = false

  constructor(form: FormType<T>) {
    this.f = form
    this.generateZod()
  }

  private generateZod() {
    let zod = z.object({})

    for (const field of this.f.fields) {
      let obj
      const label = field.label

      // Generate a zod object for all possible types
      // text, number, date, checkbox, time, select, url, textarea

      if (field.type === 'select') {
        const options = field.options.map(option => String(option.value))

        obj = z.enum([options[0], ...(options.slice(1))])
      } else if (field.type === 'checkbox') {
        obj = z.boolean({
          required_error: `${label} is verplicht`,
          invalid_type_error: `${label} is geen boolean`
        })
      } else if (field.type === 'number') {
        const min = field.minValue || -Number.MIN_SAFE_INTEGER
        const max = field.maxValue || Number.MAX_SAFE_INTEGER

        obj = z.coerce
          .number()
          .min(min, { message: `${label} moet minimaal ${min} zijn` })
          .max(max, { message: `${label} mag maximaal ${max} zijn` })
      } else if (field.type === 'date') {
        obj = z.string().transform(value => {
          return new Date(value)
        }).refine(value => {
          return value instanceof Date && !isNaN(value.getTime())
        }, { message: `${label} is verplicht` })
      } else if (field.type === 'textarea') {
        obj = z.string().min(3, { message: `${label} moet minimaal 3 karakters bevatten` })
      } else if (field.type === 'time') {
        obj = z.string().transform(value => {
          const [hours, minutes] = value.split(':')

          return new Date(0, 0, 0, Number(hours), Number(minutes))
        }).refine(value => {
          return value instanceof Date && !isNaN(value.getTime())
        }, { message: `${label} is verplicht` })
      } else if (field.type === 'url') {
        obj = z.string().url({ message: `${label} is geen geldige URL` }).optional().or(z.literal(''))

      } else {
        const min = field.minLength || 0
        const max = field.maxLength || 190

        obj = z.string().min(min, { message: `${label} moet minimaal ${min} karakters bevatten` }).max(max, { message: `${label} mag maximaal ${max} karakters bevatten` })
      }

      if (field.optional && field.type !== 'url') obj = obj.optional()

      zod = zod.extend({
        [field.name]: obj
      })
    }

    this.zodSchema = zod
  }

  async transform() {
    for (const field of this.f.fields) {
      if (field.type === 'user') {
        const users = await db.user.findMany({
          where: {
            isActive: true
          }
        })

        field.options = users.map(user => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.ldapId
        }))
        field.type = 'select'

      } else if (field.type === 'committee') {
        const committees = await db.committee.findMany({
          where: {
            isActive: true
          }
        })

        field.options = committees.map(committee => ({
          label: committee.name,
          value: committee.ldapId
        }))

        field.type = 'select'

      } else if (field.type === 'location') {
        const locations = await db.activityLocation.findMany({
          where: {
            isActive: true
          }
        })

        field.options = locations.map(location => ({
          label: location.name,
          value: location.id
        }))

        field.type = 'select'

      }
    }

    this.transformed = true
  }

  validate<T>(object: T): T | FormError[] {
    // Validate against the zod schema
    const x = this.zodSchema.safeParse(object)

    console.log(object)

    let extraErrors: FormError[] = []

    if (this.f.extraValidators) {
      // Validate against the extra validators
      // @ts-expect-error object is T, its fine
      extraErrors = this.f.extraValidators(object)
    }

    let zodErrors: FormError[] = []

    if (!x.success) {
      zodErrors = x.error.issues.map(obj => {
        return {
          field: obj.path[0],
          message: obj.message
        }
      })
    }

    console.log({ zodErrors, extraErrors })

    if (zodErrors.length > 0 || extraErrors.length > 0) {

      return [...zodErrors, ...extraErrors]
    }

    return x.data as T
  }

  get actions() {
    return {
      [this.f.actionName || 'default']: async ({ request }) => {
        const formData = await request.formData()
        const body = Object.fromEntries(formData)

        const validated = this.validate<T>(body as T)

        if (validated instanceof Array && validated.length > 0) {
          return fail(400, {
            success: false, message: 'Niet alles klopt...', errors: validated
          })
        }

        return await this.f.logic(validated)
          .then(() => {
            return { success: true }
          }).catch(err => {
            return fail(500, { success: false, message: err.message })
          })
      }
    }
  }

  get attributes() {
    if (!this.transformed) throw new Error('Form not transformed yet, call transform() first')

    return {
      title: this.f.title,
      description: this.f.description,
      fields: this.f.fields,
      needsConfirmation: this.f.needsConfirmation,
      confirmText: this.f.confirmText,
      submitStr: this.f.submitStr,
    }
  }

}
