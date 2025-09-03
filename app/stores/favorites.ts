import { defineStore } from 'pinia'

interface Rocket {
	id: string
	name: string
	description?: string
}

export const useFavoritesStore = defineStore('favorites', {
	state: () => ({
		rockets: [] as Rocket[],
	}),
	getters: {
		count: (state): number => state.rockets.length, // <-- added getter
		isFavorite: (state) => (id: string) => state.rockets.some((r) => r.id === id),
	},
	actions: {
		addRocket(rocket: Rocket) {
			if (!this.rockets.find((r) => r.id === rocket.id)) {
				this.rockets.push(rocket)
			}
		},
		removeRocket(id: string) {
			this.rockets = this.rockets.filter((r) => r.id !== id)
		},
		clearAll() {
			this.rockets = []
		},
	},
})
