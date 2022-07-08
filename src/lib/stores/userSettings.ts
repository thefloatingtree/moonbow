import { persist, localStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store";

export const username = persist(writable(''), localStorage(), 'username')