export const dieTypes = ["d6", "d10", "d100"] as const;
export type DieType = (typeof dieTypes)[number];

export const dieTypeLabels: Record<DieType, string> = {
  d10: "Other",
  d100: "Skill",
  d6: "Damage or Odic Manifestation",
};

export interface RollNotes {
  roller?: string;
  notes?: string;
}

export interface Roll<TOutput extends Record<string, any>> {
  id: string;
  collectionId: string;
  collectionName: "rolls";
  created: string;
  updated: string;
  die: DieType;
  rolls: Array<number | string>;
  output: TOutput;
  notes: RollNotes;
}

export interface SKillRollOutput {
  tens: number;
  ones: number | string;
  assist: number;
  roll: number[];
  parsedRoll: number;
  target: number;
  flipToFail: boolean;
  flipToSucceed: boolean;
  isSuccess: boolean;
  isCritical: boolean;
  isSublime: boolean;
}

export interface OtherRollOutput {
  rolls: number[];
  total: number;
  modifier?: number;
}

export interface ExplodingRollOutput {
  rolls: number[];
  initialRolls: number[];
  total: number;
  modifier?: number;
}

export interface RollPayload<
  D extends DieType,
  TOutput extends Record<string, any>
> {
  die: D;
  rolls: Array<number | string>;
  output: TOutput;
  notes: RollNotes;
}

export type SkillRoll = Roll<SKillRollOutput>;
export type SkillRollPayload = RollPayload<"d100", SKillRollOutput>;
export type OtherRoll = Roll<OtherRollOutput>;
export type OtherRollPayload = RollPayload<"d10", OtherRollOutput>;
export type ExplodingRoll = Roll<ExplodingRollOutput>;
export type ExplodingRollPayload = RollPayload<"d6", ExplodingRollOutput>;
export type AnyRoll = SkillRoll | OtherRoll | ExplodingRoll;
export type AnyRollPayload =
  | SkillRollPayload
  | OtherRollPayload
  | ExplodingRollPayload;

export interface User {
  id: string;
  collectionId: "_pb_users_auth_";
  collectionName: string;
  username: string;
  verified: boolean;
  emailVisibility: boolean;
  email: string;
  created: string;
  updated: string;
  name: string;
  avatar?: string;
}

export const isSkillRoll = (r: unknown): r is SKillRollOutput =>
  !!(r as SKillRollOutput)?.roll;
