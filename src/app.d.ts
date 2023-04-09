/// <reference types="@auth/sveltekit" />
import type { Committee, User, Settings } from 'prisma/prisma-client'

declare global {
  declare namespace App {
    interface Locals {
      user: User
      committees: Committee[]
      settings: Settings[]
    }
  }
}
