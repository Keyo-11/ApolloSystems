<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useFavoritesStore } from '~/stores/favorites'

const route = useRoute()
const router = useRouter()
const rocketId = String(route.params.id || '')

// GraphQL query for rocket by id
const GET_ROCKET = gql`
	query GetRocket($id: ID!) {
		rocket(id: $id) {
			id
			name
			description
			first_flight
			height {
				meters
			}
			diameter {
				meters
			}
			mass {
				kg
			}
			stages
		}
	}
`

const { result, loading, error } = useQuery(GET_ROCKET, { id: rocketId })
const rocket = computed(() => result.value?.rocket ?? null)

// Format first flight date
const firstFlightFormatted = computed(() => {
	const raw = rocket.value?.first_flight
	if (!raw) return 'N/A'
	try {
		return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(raw))
	} catch {
		return raw
	}
})

// Favorites
const favoritesStore = useFavoritesStore()
const isFavorite = computed(() => favoritesStore.rockets.some((r) => r.id === rocket.value?.id))

const addOrRemoveFavorite = () => {
	if (!rocket.value) return
	if (isFavorite.value) {
		favoritesStore.removeRocket(rocket.value.id)
	} else {
		favoritesStore.addRocket({
			id: rocket.value.id,
			name: rocket.value.name,
			description: rocket.value.description,
		})
	}
}
</script>

<template>
	<v-container>
		<!-- Back Button -->
		<v-row class="mb-6">
			<v-col cols="12">
				<v-btn outlined color="primary" @click="router.back()">← Back</v-btn>
			</v-col>
		</v-row>

		<!-- Loading State -->
		<v-row v-if="loading">
			<v-col cols="12" class="text-center">
				<v-progress-circular indeterminate color="primary" />
			</v-col>
		</v-row>

		<!-- Error State -->
		<v-row v-else-if="error">
			<v-col cols="12">
				<v-alert type="error" title="Error loading rocket">
					{{ error.message }}
				</v-alert>
			</v-col>
		</v-row>

		<!-- Not Found -->
		<v-row v-else-if="!rocket">
			<v-col cols="12">
				<v-alert type="warning">Rocket not found for id: {{ rocketId }}</v-alert>
			</v-col>
		</v-row>

		<!-- Rocket Details -->
		<v-row v-else justify="center">
			<v-col cols="12" md="8" lg="6">
				<v-card class="rocket-card hoverable pa-6">
					<v-card-title class="text-h4 mb-4">{{ rocket.name }}</v-card-title>

					<v-card-text class="mb-4">
						<p>
							<strong class="text-subtitle-1">Description:</strong>
							{{ rocket.description || 'N/A' }}
						</p>
						<p>
							<strong class="text-subtitle-1">First Flight:</strong>
							{{ firstFlightFormatted }}
						</p>
						<p>
							<strong class="text-subtitle-1">Height:</strong>
							{{ rocket.height?.meters != null ? `${rocket.height.meters} m` : 'N/A' }}
						</p>
						<p>
							<strong class="text-subtitle-1">Diameter:</strong>
							{{ rocket.diameter?.meters != null ? `${rocket.diameter.meters} m` : 'N/A' }}
						</p>
						<p>
							<strong class="text-subtitle-1">Mass:</strong>
							{{ rocket.mass?.kg != null ? `${rocket.mass.kg} kg` : 'N/A' }}
						</p>
						<p>
							<strong class="text-subtitle-1">Stages:</strong>
							{{ rocket.stages ?? 'N/A' }}
						</p>
					</v-card-text>

					<v-card-actions>
						<v-btn
							block
							:color="isFavorite ? 'grey darken-1' : 'pink darken-2'"
							dark
							large
							@click="addOrRemoveFavorite"
						>
							{{ isFavorite ? '⭐ Added to Favorites' : '⭐ Add to Favorites' }}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<style scoped>
.rocket-card {
	transition: box-shadow 0.2s;
}
.rocket-card:hover {
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}
</style>
