import { randomBytes } from 'node:crypto';

export function getRandomId() {
    return randomBytes(16).toString("hex")
}