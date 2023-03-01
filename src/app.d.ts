/// <reference types="@auth/sveltekit" />
import { type Committee, type User } from 'prisma/prisma-client'

declare namespace App {
  interface Locals {
    user: User
    committees: Committee[]
  }
}

export {};