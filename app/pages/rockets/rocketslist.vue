<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'

interface Rocket {
	id: string
	name: string
	description: string
}

const rockets = ref<Rocket[]>([])
const favoritesStore = useFavoritesStore()

onMounted(async () => {
	try {
		const res = await fetch('https://api.spacexdata.com/v4/rockets')
		rockets.value = await res.json()
	} catch (err) {
		console.error('Failed to fetch rockets:', err)
	}
})

const isFavorite = (rocket: Rocket) => favoritesStore.rockets.some((r) => r.id === rocket.id)
</script>

<template>
	<v-container>
		<h1 class="text-h4 mb-6 text-center">All Rockets</h1>
		<v-row class="d-flex justify-center" align="stretch" dense>
			<v-col v-for="rocket in rockets" :key="rocket.id" cols="12" sm="6" md="5" class="mb-6">
				<v-card class="rocket-card hoverable" elevation="4" :to="`/rockets/${rocket.id}`">
					<v-card-title class="d-flex justify-space-between align-center">
						<span>{{ rocket.name }}</span>
						<v-icon v-if="isFavorite(rocket)" color="red">mdi-heart</v-icon>
					</v-card-title>

					<v-card-text class="flex-grow-1">
						{{ rocket.description }}
					</v-card-text>

					<v-card-actions class="justify-center">
						<small class="click-text">Click for more details ˅</small>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<style scoped>
.rocket-card {
	cursor: pointer;
	display: flex;
	flex-direction: column;
	height: 100%;
	transition: transform 0.2s;
}
.rocket-card:hover {
	transform: scale(1.02);
}
.click-text {
	color: #1976d2;
	font-weight: 500;
}
</style>
