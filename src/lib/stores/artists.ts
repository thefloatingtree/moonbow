import type { Artist } from "src/drawing/Artist/Artist";
import { writable } from "svelte/store";

export const artists = writable<Array<Artist>>([])