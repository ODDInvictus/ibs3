import { Client, Events, GatewayIntentBits, MessageType, type Snowflake } from 'discord.js'
import { parseDiscordMessageIntoQuote } from './discord'
import { PrismaClient, type User } from '../lib/server/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

declare var self: Worker

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

let client: Client

const { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DATABASE } = process.env

if (!DATABASE_HOST || !DATABASE_PORT || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_DATABASE) {
	console.error('Missing one of these requierd variables: DATABASE_ + [HOST, PORT, USER, PASSWORD, DATABASE]')
	process.exit(1)
}

const adapter = new PrismaMariaDb(
	{
		host: DATABASE_HOST,
		port: Number.parseInt(DATABASE_PORT!),
		user: DATABASE_USER,
		password: DATABASE_PASSWORD,
		database: DATABASE_DATABASE,
		connectionLimit: 5,
	},
	{ database: DATABASE_DATABASE! },
)

export const workerDB = new PrismaClient({ adapter })

self.onmessage = async (event: MessageEvent) => {
	log('Hallo ibs3!')

	const token = process.env.DISCORD_TOKEN

	if (!token) {
		log('DISCORD_TOKEN unset, worker quitting')
		return
	}

	const quoteChannel = await workerDB.settings.findFirst({
		where: {
			name: 'DISCORD_QUOTE_CHANNEL',
		},
	})

	if (!quoteChannel?.value || Number.parseInt(quoteChannel.value) === 0) {
		log('Setting.DISCORD_QUOTE_CHANNEL unset, worker quitting')
		return
	}

	client = new Client({
		intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
	})

	client.on(Events.ClientReady, readyClient => {
		log(`Discord app started as ${readyClient.user.tag}`)
	})

	client.on(Events.MessageCreate, async message => {
		if (message.author.bot) return

		if (message.channelId !== quoteChannel.value) return

		if (message.cleanContent === '/scan') {
			if (message.author.id !== '183539437097975808') {
				message.react('🤡')
				return
			}

			await scanChannel(client, quoteChannel.value)
			message.react('✅')
			return
		}

		if (message.type === MessageType.Default || message.type === MessageType.Reply) {
			log(message.content)
			log(message.content.includes('\n'))

			try {
				await workerDB.discordMessage.create({
					data: {
						id: message.id,
						sender: message.author.username,
						text: message.content,
						createdAt: message.createdAt,
					},
				})
			} catch (err) {
				return
			}

			await parseDiscordMessageIntoQuote(message)
			// saved, so react
			message.react('🗣️')
		}
	})

	client.login(token)

	// await scanChannel(client, quoteChannel.value)
}

async function scanChannel(client: Client, quoteChannel: Snowflake) {
	const channel = await client.channels.fetch(quoteChannel)

	if (!channel || !channel.isTextBased()) {
		log(`Channel ${quoteChannel} not found`)
		return
	}

	let lastId: Snowflake = ''

	while (true) {
		let options = { limit: 100 }
		if (lastId) {
			options = Object.assign(options, { before: lastId })
		}

		const msgs = await channel.messages.fetch(options)

		if (msgs.size === 0) break

		msgs.forEach(async message => {
			if (message.type === MessageType.Default || message.type === MessageType.Reply) {
				if (message.cleanContent === '/scan') return

				try {
					await workerDB.discordMessage.create({
						data: {
							id: message.id,
							sender: message.author.username,
							text: message.content,
							createdAt: message.createdAt,
						},
					})

					await parseDiscordMessageIntoQuote(message)
				} catch (err: any) {
					// als bericht al bestaat, boeie
				}
			}
		})

		const last = msgs.last()
		if (!last) break
		lastId = last.id

		console.log('last: ' + lastId)

		await new Promise(resolve => setTimeout(resolve, 1000))
	}
}

function log(...objects: any[]) {
	const date = new Date(Date.now())
	console.log(`[Worker][${date.toLocaleDateString('nl')} ${date.toLocaleTimeString('nl')}]`, ...objects)
}

export {}
