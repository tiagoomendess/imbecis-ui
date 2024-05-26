<script lang="ts">
	import { onMount } from 'svelte';
	import L, { type LayerGroup, type FeatureGroup } from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import 'leaflet-draw/dist/leaflet.draw.css';
	import 'leaflet-draw';
	import 'leaflet-editable';
	import type { GeoJsonFeature } from '../types';
	import { createRegion, updateRegion, getAllRegions, deleteRegion } from '$lib/regionsApi';
	import { showNotification } from '../utils/notifications';
	import { type NotificationRegion } from '$lib/regionsApi';
	import { Card, Button, Input, Label, Select, Heading } from 'flowbite-svelte';
	import { TrashBinSolid, MinusSolid, PlusSolid } from 'flowbite-svelte-icons';
	import XNotificationRecipient from './XNotificationRecipient.svelte';
	import { type NotificationRecipient } from '$lib/types';

	let map: L.Map | null = null;
	let regionCount = 0;
	let regions = [] as NotificationRegion[];
	let regionOnFocus = null as NotificationRegion | null;
	let drawnItems: FeatureGroup;
	let editItems: FeatureGroup;

	$: drawRegions(regions);

	onMount(() => {
		getRegions();
		map = L.map('map').setView([39.8284, -9.175], 7);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19
		}).addTo(map);

		drawnItems = new L.FeatureGroup();
		map.addLayer(drawnItems);

		editItems = new L.FeatureGroup();

		const drawControl = new L.Control.Draw({
			edit: {
				featureGroup: editItems,
				edit: {
					selectedPathOptions: {
            color: '#FF1100',
            opacity: 0.8,
            fillOpacity: 0.5
					}
				}
			},
			draw: {
				polyline: false,
				rectangle: false,
				circle: false,
				circlemarker: false,
				marker: false
			}
		});

		map.addControl(drawControl);

		// Event listener for the creation of new layers
		map.on(L.Draw.Event.CREATED, (event: any) => {
			const layer = event.layer;
			drawnItems.addLayer(layer);

			// Get the GeoJSON data of the drawn layer
			const geojson = layer.toGeoJSON();
			// You can now send this geojson data to your backend
			polygonToRegion(geojson);
		});

		map.on(L.Draw.Event.EDITED, (event: any) => {
			console.log('Edited event: ', event);
			event.layers.eachLayer((layer: L.Layer) => {
				drawnItems.eachLayer((drawnLayer: L.Layer) => {
					if (drawnLayer.options.attribution === layer.options.attribution) {
						drawnItems.removeLayer(drawnLayer);
						drawnItems.addLayer(layer);
					}
				});
			});
		});
	});

	const drawRegions = (regions: NotificationRegion[]) => {
		// First remove already existing drawn regions

		regions.forEach((region) => {
			const polygon = L.geoJSON(region.polygon, {
				style: {
          fillColor: region.color,
          fillOpacity: 0.35,
					color: region.color,
          opacity: 1,
					weight: 1
				}
			});

			const layer = polygon.getLayers()[0];
			layer.on('click', () => {
				setOnFocus(region.id);
			});

			layer.options.attribution = region.id;
			drawnItems.addLayer(layer);
		});
	};

	const polygonToRegion = async (geojson: GeoJsonFeature) => {
		const response = await createRegion(
			`Região ${regionCount + 1}`,
			1,
			getRandomHexColor(),
			{
				type: 'Polygon',
				coordinates: geojson.geometry.coordinates
			},
			[]
		);

		if (!response.success || !response.payload) {
			showNotification(response.message, 'error');
			return;
		}

		showNotification('Região criada com sucesso', 'success');

		const region = response.payload;
		regions.push(region);

		getRegions();
	};

	const saveRegion = async (region: NotificationRegion): Promise<NotificationRegion | null> => {
		if (region.id) {
			const success = await updateRegion(region);
			return success ? region : null;
		} else {
			const response = await createRegion(
				region.name,
				region.priority,
				region.color,
				region.polygon,
				region.recipients
			);
			return response.success && response.payload ? response.payload : null;
		}
	};

	const getRegions = async () => {
		const response = await getAllRegions();

		if (!response.success || !response.payload) {
			showNotification(response.message, 'error');
			return;
		}

		regions = response.payload;
		regionCount = regions.length;
	};

	const setOnFocus = (regionId: string) => {
		editItems.clearLayers();
		regions.forEach((region) => {
			if (region.id === regionId) {
				regionOnFocus = region;
				drawnItems.eachLayer((layer: L.Layer) => {
					if (layer.options.attribution === regionId) {
						editItems.addLayer(layer);
					}
				});
			}
		});
	};

	const removeOnFocus = () => {
		regionOnFocus = null;
		editItems.clearLayers();
	};

	const handleSaveClicked = async (region: NotificationRegion | null) => {
		console.log('Region to be saved: ', region);
		removeOnFocus();
		if (!region) {
			return;
		}

		drawnItems.eachLayer((layer: L.Layer) => {
			if (layer.options.attribution === region.id) {
				// Get polygon from layer
				region.polygon = {
					type: 'Polygon',
					coordinates: layer.toGeoJSON().geometry.coordinates
				};
			}
		});

		await saveRegion(region);
		await getRegions();
	};

	const handlePlusClicked = () => {
		if (regionOnFocus == null) {
			return;
		}

		regionOnFocus.recipients = [
			...regionOnFocus.recipients,
			{
				type: 'none',
				target: ''
			}
		];

		regionOnFocus = { ...regionOnFocus };
	};

	function getRandomHexColor() {
		const randomNumber = Math.floor(Math.random() * 16777215);
		const hexColor = `#${randomNumber.toString(16).padStart(6, '0')}`;

		return hexColor;
	}

	const handleDeleteClicked = async (region: NotificationRegion | null) => {
		console.log('Region to be deleted: ', region);
		if (!region) {
			return;
		}

		const response = await deleteRegion(region.id);
		showNotification(response.message, response.success ? 'success' : 'error');
		regionOnFocus = null;
		await getRegions();
	};

	function deleteNotificationFromRecipient(recipient: NotificationRecipient) {
		if (regionOnFocus == null) {
			return;
		}

		regionOnFocus.recipients = regionOnFocus.recipients.filter(
			(r) => r.target !== recipient.target && r.type !== recipient.type
		);

		// Explicitly reassign regionOnFocus to trigger reactivity
		regionOnFocus = { ...regionOnFocus };
	}
</script>

<div id="map"></div>

<div class="overlay-right">
	{#if regionOnFocus != null}
		<Card class="mb-1">
			<div class="mb-4">
				<div class="flex items-center space-x-2">
					<div class="w-full">
						<Label for="name" class="mb-1">Nome</Label>
						<Input
							class=""
							type="text"
							id="name"
							placeholder="Nome da Região"
							required
							bind:value={regionOnFocus.name}
						/>
					</div>
					<Button
						class="!p-2 mt-6 right"
						color="red"
						on:click={() => handleDeleteClicked(regionOnFocus)}
						><TrashBinSolid class="w-6 h-6" /></Button
					>
				</div>
			</div>
			<div class="grid gap-2 mb-4 md:grid-cols-2">
				<div>
					<Label for="priority" class="mb-1">Prioridade</Label>
					<Input
						type="number"
						id="priority"
						placeholder="#"
						required
						bind:value={regionOnFocus.priority}
					/>
				</div>
				<div>
					<Label for="color" class="mb-1">Cor</Label>
					<input
						type="color"
						id="color"
						placeholder="Cor"
						required
						bind:value={regionOnFocus.color}
						class="form-input w-full color-input"
					/>
				</div>
			</div>
			<div class="divider mb-2"></div>
			<div>
				<div class="flex flex-col space-y-2">
					{#each regionOnFocus.recipients as recipient}
						<div class="flex items-center space-x-2">
							<div class="w-full">
								<XNotificationRecipient bind:recipient></XNotificationRecipient>
							</div>
							<Button
								class="!p-2 mt-3"
								color="alternative"
								on:click={() => deleteNotificationFromRecipient(recipient)}
							>
								<MinusSolid class="w-6 h-6" />
							</Button>
						</div>
					{/each}
				</div>
				<div class="flex items-center space-x-2 mb-3">
					<div class="w-full text-center">
						<small>Adiciona Notificações</small>
					</div>
					<Button class="!p-2 right mt-1" color="alternative" on:click={() => handlePlusClicked()}>
						<PlusSolid class="w-6 h-6" />
					</Button>
				</div>
			</div>
			<div class="grid md:grid-cols-2">
				<Button color="alternative" on:click={() => removeOnFocus()}>Cancelar</Button>
				<Button color="green" class="ml-2" on:click={() => handleSaveClicked(regionOnFocus)}
					>Guardar</Button
				>
			</div>
		</Card>
	{/if}

	{#each regions as region}
		<Button
			color={region.id == regionOnFocus?.id ? 'dark' : 'light'}
			class="w-full mb-1"
			on:click={() => setOnFocus(region.id)}>{region.name}</Button
		>
	{/each}
</div>

<style>
	#map {
		height: 100vh;
		z-index: 1;
	}

	.overlay-right {
		position: absolute;
		top: 0;
		right: 0;
		width: 350px;
		height: 100vh;
		z-index: 4;
		padding: 10px;
		overflow-y: auto;
		scroll-behavior: smooth;
		scrollbar-width: thin;
		background-color: rgba(1, 1, 1, 0.3);
	}

	.divider {
		width: 100%;
		height: 1px;
		background-color: rgb(141, 141, 141);
		box-shadow: 0 1px 2px rgba(160, 160, 160, 0.1);
	}

  .color-input {
    padding: 0;
    border: 1px solid #e2e8f0;
    background: none;
    background-color: rgb(249 250 251);
    border-radius: 0.5rem;
    padding: 0.2rem 0.3rem;
    height: 42px;
  }
</style>
