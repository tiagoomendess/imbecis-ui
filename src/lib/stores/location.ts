import { writable } from "svelte/store";
import type { Coordinates } from "$lib/types";

export const location = writable({ latitude: 0, longitude: 0 } as Coordinates)
