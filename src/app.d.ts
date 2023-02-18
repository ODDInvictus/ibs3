/// <reference types="@auth/sveltekit" />
import { type User } from 'prisma/prisma-client'

declare namespace App {
  interface Locals {
    user: User
  }
}

export {};