/// <reference types="@auth/sveltekit" />
/// <reference types="unplugin-icons/types/svelte" />
import type { Committee, User, Settings } from 'prisma/prisma-client'

declare global {
  declare namespace App {
    interface Locals {
      user: User
      committees: Committee[]
      roles: UserRoles
      theme: string
    }
  }
}
