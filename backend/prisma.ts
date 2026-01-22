import { PrismaClient } from './prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DATABASE } = process.env

if (!DATABASE_HOST || !DATABASE_PORT || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_DATABASE) {
	console.error('Missing one of these requierd variables: DATABASE_ + [HOST, PORT, USER, PASSWORD, DATABASE]')
	process.exit(1)
}

const adapter = new PrismaMariaDb(
	{
		host: process.env.DATABASE_HOST,
		port: Number.parseInt(process.env.DATABASE_PORT!),
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_DATABASE,
		connectionLimit: 5,
	},
	{ database: process.env.DATABASE_DATABASE! },
)

export const prisma = new PrismaClient({ adapter })
