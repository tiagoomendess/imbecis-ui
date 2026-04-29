import exifr from 'exifr';
import type { Coordinates } from '$lib/types';

const MAX_PHOTO_AGE_MS = 12 * 60 * 60 * 1000;

export class MissingGpsError extends Error {
	constructor() {
		super('Fotografia sem coordenadas GPS');
		this.name = 'MissingGpsError';
	}
}

export class MissingTimestampError extends Error {
	constructor() {
		super('Fotografia sem data');
		this.name = 'MissingTimestampError';
	}
}

export class PhotoTooOldError extends Error {
	constructor() {
		super('Fotografia tem mais de 12 horas');
		this.name = 'PhotoTooOldError';
	}
}

export async function extractPhotoMetadata(
	file: File
): Promise<{ coords: Coordinates; takenAt: Date }> {
	const exif = await exifr.parse(file, {
		gps: true,
		pick: ['DateTimeOriginal', 'CreateDate', 'GPSLatitude', 'GPSLongitude']
	});

	const lat: number | undefined = exif?.latitude ?? exif?.GPSLatitude;
	const lng: number | undefined = exif?.longitude ?? exif?.GPSLongitude;

	if (lat === undefined || lat === null || lng === undefined || lng === null) {
		throw new MissingGpsError();
	}

	const rawDate: Date | undefined = exif?.DateTimeOriginal ?? exif?.CreateDate;
	if (!rawDate) {
		throw new MissingTimestampError();
	}

	const takenAt = rawDate instanceof Date ? rawDate : new Date(rawDate);
	if (isNaN(takenAt.getTime())) {
		throw new MissingTimestampError();
	}

	const ageMs = Date.now() - takenAt.getTime();
	if (ageMs > MAX_PHOTO_AGE_MS) {
		throw new PhotoTooOldError();
	}

	return { coords: { latitude: lat, longitude: lng }, takenAt };
}

export function reencodeTo1000Webp(file: File): Promise<Blob> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();

		img.onload = () => {
			URL.revokeObjectURL(url);

			const canvas = document.createElement('canvas');
			canvas.width = 1000;
			canvas.height = 1000;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				reject(new Error('Canvas context not available'));
				return;
			}
			const size = Math.min(img.width, img.height);
			const sx = (img.width - size) / 2;
			const sy = (img.height - size) / 2;
			ctx.drawImage(img, sx, sy, size, size, 0, 0, canvas.width, canvas.height);

			const handleBlob = (blob: Blob | null) => {
				if (!blob) {
					reject(new Error('Failed to encode image'));
					return;
				}
				resolve(blob);
			};

			const fallbackToJpeg = () => {
				canvas.toBlob(handleBlob, 'image/jpeg', 0.9);
			};

			canvas.toBlob(
				(blob) => {
					if (blob && blob.type === 'image/webp') {
						handleBlob(blob);
					} else {
						fallbackToJpeg();
					}
				},
				'image/webp',
				0.8
			);
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('Failed to load image'));
		};

		img.src = url;
	});
}
