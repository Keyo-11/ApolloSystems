<script setup lang="ts">
import { computed } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'

const favoritesStore = useFavoritesStore()
const favorites = computed(() => favoritesStore.rockets)

const removeRocket = (id: string) => favoritesStore.removeRocket(id)
const clearFavorites = () => favoritesStore.clearAll()
</script>

<template>
	<v-container>
		<h1 class="text-h4 mb-6 text-center">Favorite Rockets</h1>

		<!-- No favorites message -->
		<v-row v-if="favorites.length === 0">
			<v-col cols="12" class="text-center">No favorites yet.</v-col>
		</v-row>

		<!-- Favorite rockets list -->
		<v-row v-else class="d-flex justify-center" align="stretch" dense>
			<v-col v-for="rocket in favorites" :key="rocket.id" cols="12" sm="6" md="5" class="mb-6">
				<v-card class="favorite-card hoverable" elevation="4">
					<v-card-title class="d-flex justify-space-between align-center">
						<span>{{ rocket.name }}</span>
						<v-btn icon color="red" @click.stop="removeRocket(rocket.id)">
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</v-card-title>

					<v-card-text class="flex-grow-1">
						{{ rocket.description }}
					</v-card-text>

					<v-card-actions class="justify-center">
						<v-btn :to="`/rockets/${rocket.id}`" color="primary" text>View Details ˅</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>

		<!-- Clear all button -->
		<v-row v-if="favorites.length">
			<v-col cols="12" class="mt-4 text-center">
				<v-btn color="red" @click="clearFavorites">Clear All Favorites</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<style scoped>
.favorite-card {
	cursor: pointer;
	display: flex;
	flex-direction: column;
	height: 100%;
	transition: transform 0.2s;
}
.favorite-card:hover {
	transform: scale(1.02);
}
</style>
