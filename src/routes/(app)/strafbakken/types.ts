import type { PageData } from "../$types";
import type { User, Strafbak } from "@prisma/client";

export interface sbUser extends User {
  _count: {
    StrafbakReceived: number;
  };
}

export interface sbPageData extends PageData {
  strafbakken: sbUser[];
}

interface sbDetails {
  reason: string;
  dateCreated: Date;
  giver: {
    nickname: string | null;
    firstName: string;
  };
}

export interface sbUserPageData extends PageData {
  strafbakken: {
    firstName: string;
    nickname: string | null;
    StrafbakReceived: sbDetails[];
  };
}
