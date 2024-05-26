
export interface User {
    uuid: string
}

export interface Report {
    id: string
    status: string
    deviceUUID: string
    municipality: string
    picture: string
    updatedAt: string
    createdAt: string
}

export interface Coordinates {
    latitude: number
    longitude: number
}

export interface VoteRequest {
    plateNumber: string
    plateCountry: string
    result: string
}

export interface Plate {
    id: string
    country: string
    number: string
}

export interface PaginatedPlatesList {
    plates: Plate[]
    page: number
    total: number
}

export type NotificationType = 'info' | 'success' | 'error' | 'warning';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

export interface ApiResponse {
    success: boolean
    message: string
    payload: any
}

// GeoJSON basic types
export type GeoJsonGeometryTypes =
    | 'Point'
    | 'MultiPoint'
    | 'LineString'
    | 'MultiLineString'
    | 'Polygon'
    | 'MultiPolygon'
    | 'GeometryCollection';
export type GeoJsonTypes = 'Feature' | 'FeatureCollection' | 'GeometryCollection';

// Basic Geometry object
export interface GeoJsonGeometry {
    type: GeoJsonGeometryTypes;
    coordinates: any;
}

// Geometry with Polygon type
export interface PolygonGeometry extends GeoJsonGeometry {
    type: 'Polygon';
    coordinates: number[][][];
}

// Feature object
export interface GeoJsonFeature {
    type: 'Feature';
    geometry: GeoJsonGeometry;
    properties: { [key: string]: any } | null;
}

// GeoJSON object
export interface GeoJson {
    type: GeoJsonTypes;
    features: GeoJsonFeature[];
}

export interface NotificationRecipient { 
    type: String,
    target: String
}

export interface ReporterInfo {
    name: string;
    idType: string;
    idNumber: string;
    email: string;
    obs: string;
}
