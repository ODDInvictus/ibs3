import type { RequestHandler } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'
import * as z from 'zod'

export function RPCHandler(...methods: RPCMethod<any>[]): RequestHandler {
	return async event => {
		const body = await event.request.json()

		if (!body.func) {
			return json({ error: true, message: 'body.func missing' })
		}

		for (const method of methods) {
			if (method.name === body.func) {
				if (method.zod) {
					try {
						const b = method.zod.parse(body.body)

						const res = await method.handler(b)

						return json({ error: false, body: res })
					} catch (err: any) {
						if (err instanceof z.ZodError) {
							return json({ error: true, body: err.issues })
						}
						return json({ error: true, body: err.message })
					}
				} else {
					const res = await method.handler(null)
					return json({ error: false, body: res })
				}
			}
		}

		return json({ error: true, message: `func ${body.func} not found` })
	}
}

type RPCMethod<T> = {
	name: string
	zod: z.AnyZodObject | null
	handler: (body: T) => Promise<T>
}

export function rpcMethod<T>(name: string, zod: z.AnyZodObject | null, handler: () => Promise<T>): RPCMethod<T> {
	return {
		name,
		zod,
		handler,
	}
}
