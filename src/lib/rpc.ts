import { toast } from './notification'

export async function rpc<T, R>(func: string, body: T): Promise<R | null> {
	return await fetch(location.href, {
		method: 'POST',
		body: JSON.stringify({
			func,
			body,
		}),
	})
		.then(res => res.json())
		.then(res => {
			if (res.error) {
				if (res.body) {
					toast({
						title: 'Oei!',
						message: res.body,
						type: 'danger',
					})
				} else {
					toast({
						title: 'Oei!',
						message: res.message,
						type: 'danger',
					})
				}
				return null
			} else {
				return res.body
			}
		})
		.catch(err => {
			toast({
				title: 'Oei!',
				message: err.message,
				type: 'danger',
			})
			return null
		})
}
