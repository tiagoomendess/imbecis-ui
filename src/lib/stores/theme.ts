import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

function createThemeStore() {
	const { subscribe, set, update } = writable<Theme>('light');

	function applyTheme(theme: Theme) {
		if (typeof document === 'undefined') return;
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	function persist(theme: Theme) {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem('theme', theme);
	}

	function init() {
		if (typeof localStorage === 'undefined') return;

		const stored = localStorage.getItem('theme') as Theme | null;
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const initial: Theme = stored ?? (prefersDark ? 'dark' : 'light');

		set(initial);
		applyTheme(initial);
	}

	function toggle() {
		update((current) => {
			const next: Theme = current === 'dark' ? 'light' : 'dark';
			applyTheme(next);
			persist(next);
			return next;
		});
	}

	function setTheme(theme: Theme) {
		set(theme);
		applyTheme(theme);
		persist(theme);
	}

	return { subscribe, init, toggle, setTheme };
}

export const theme = createThemeStore();
