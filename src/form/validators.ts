import { type ValidatorFn } from "solid-forms";

export const requiredValidator: ValidatorFn = (raw: string) =>
  raw.length === 0 ? { isMissing: "This field is required" } : null;

export const emailValidator: ValidatorFn = (raw: string) =>
  raw.includes("@") && raw.includes(".")
    ? null
    : { isInvalid: "Invalid email" };

export const numberRequiredValidator: ValidatorFn = (raw: number) =>
  raw === undefined || raw === null
    ? { isMissing: "A number is required" }
    : null;
