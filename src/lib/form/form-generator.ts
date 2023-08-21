import type { Roles } from '$lib/constants'
import db from '$lib/server/db'
import type { User } from '@prisma/client'
import { fail, type Actions } from '@sveltejs/kit'
import { z } from 'zod'

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
  getOptions?: (user: User | null) => Promise<OptionField<InputType>[]>
  description?: string
  placeholder?: string
}

export type FormError = {
  field: string | number
  message: string
}

export type LogicReturnType = LogicReturnSuccessType | LogicReturnErrorType

type LogicReturnSuccessType = {
  success: true
  message: string
  status: 200 | 201 | 204
  redirectTo: string
}

type LogicReturnErrorType = {
  success: false
  message: string
  status: number
}

type LogicDataType<T> = T & {
  user: User
}


type FormType<T> = {
  title: string
  shortTitle?: string
  description?: string
  formId: string
  fields: Field<FieldType>[]
  submitStr: string
  requiredRoles: Roles[]
  actionName?: string
  needsConfirmation?: boolean
  confirmText?: string
  logic: (data: LogicDataType<T>) => Promise<LogicReturnType>
  extraValidators?: (data: T) => Promise<FormError[]>
}

export class Form<T> {

  private f
  private zodSchema = z.object({})
  private type = {}

  private transformed = false

  constructor(form: FormType<T>) {
    this.f = form
  }

  private async generateZod() {
    let zod = z.object({})

    for (const field of this.f.fields) {
      let obj
      const label = field.label

      // Generate a zod object for all possible types
      // text, number, date, checkbox, time, select, url, textarea

      if (field.type === 'select') {
        // Now check if there is a field.options with more than 0 items, or, if the field has a getOptions function
        if (!field.options && !field.getOptions) {
          console.log(field)
          throw new Error(`Select field has no options or getOptions function`)
        }

        if (field.getOptions) {
          await field.getOptions({} as User)
        }

        const options = field.options.map(option => String(option.value))

        obj = z.enum([options[0], ...(options.slice(1))])
      } else if (field.type === 'checkbox') {

        obj = z.preprocess(value => value === 'on', z.boolean())

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
        obj = z.string().url({ message: `${label} is geen geldige URL` })

      } else {
        const min = field.minLength || 0
        const max = field.maxLength || 190

        obj = z.string().min(min, { message: `${label} moet minimaal ${min} karakters bevatten` }).max(max, { message: `${label} mag maximaal ${max} karakters bevatten` })
      }

      if (field.optional) {
        if (field.type !== 'url') {
          obj = obj.optional().or(z.literal(''))
        }
      }

      zod = zod.extend({
        [field.name]: obj
      })
    }

    this.zodSchema = zod
  }

  async transform(user: User | null) {
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

      } else if (field.type === 'select') {
        if (!field.getOptions) {
          throw new Error('Select field has no getOptions function')
        }

        field.options = await field.getOptions(user)
        field.getOptions = undefined
      }
    }

    await this.generateZod()
    this.transformed = true
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
    })

    const userRoles = committees.map(cm => cm.committee.ldapId)

    const hasOneRole = this.f.requiredRoles.some(role => userRoles.includes(role))

    if (hasOneRole) {
      return [true, []]
    } else {
      return [false, this.f.requiredRoles.filter(role => !userRoles.includes(role))]
    }
  }

  async validate<T>(object: T): Promise<T | FormError[]> {
    // Validate against the zod schema
    const x = this.zodSchema.safeParse(object)

    let extraErrors: FormError[] = []

    if (this.f.extraValidators) {
      // Validate against the extra validators
      // @ts-expect-error Klopt wel
      extraErrors = await this.f.extraValidators(object)
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

    if (zodErrors.length > 0 || extraErrors.length > 0) {

      return [...zodErrors, ...extraErrors]
    }

    // @ts-expect-error Klopt wel
    return x.data as T
  }

  get actions() {
    return {
      [this.f.actionName || 'default']: async ({ request, locals }) => {
        const [ok, committees] = await this.checkRoles(locals)

        if (!ok) {
          return fail(403, {
            success: false, message: 'Je hebt niet de juiste rechten om dit formulier te gebruiken. Je mist een van de volgende rollen: ' + committees.join(', '), errors: []
          })
        }

        const formData = await request.formData()
        const body = Object.fromEntries(formData)

        let validated = await this.validate<T>(body as T)

        if (validated instanceof Array && validated.length > 0) {
          return fail(400, {
            success: false, message: 'Niet elk veld is correct ingevuld.', errors: validated
          })
        }

        validated = validated as Awaited<T>

        (validated as LogicDataType<T>).user = locals.user

        const ret = await this.f.logic(validated)

        if (ret.success) {
          return ret
        } else {
          return fail(ret.status, ret)
        }
      }
    } satisfies Actions
  }

  get attributes() {
    if (!this.transformed) throw new Error('Form not transformed yet, call transform() first')

    return {
      title: this.f.title,
      shortTitle: this.f.shortTitle,
      description: this.f.description,
      fields: this.f.fields,
      needsConfirmation: this.f.needsConfirmation,
      confirmText: this.f.confirmText,
      submitStr: this.f.submitStr,
    }
  }

}
