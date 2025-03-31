
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      getCenter(): LatLng;
      getZoom(): number;
    }

    class Geocoder {
      geocode(
        request: {
          address?: string;
          location?: { lat: number; lng: number } | LatLng;
        },
        callback: (
          results: GeocoderResult[],
          status: GeocoderStatus
        ) => void
      ): void;
    }

    class DirectionsService {
      route(
        request: DirectionsRequest,
        callback: (
          result: DirectionsResult,
          status: DirectionsStatus
        ) => void
      ): void;
    }

    class DirectionsRenderer {
      constructor(opts?: {
        map?: Map;
        suppressMarkers?: boolean;
        polylineOptions?: PolylineOptions;
      });
      setDirections(directions: DirectionsResult): void;
      setMap(map: Map | null): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface PolylineOptions {
      strokeColor?: string;
      strokeWeight?: number;
      strokeOpacity?: number;
    }

    interface MapOptions {
      center: LatLng | LatLngLiteral;
      zoom: number;
      mapTypeId?: string;
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
      mapTypeControl?: boolean;
      scaleControl?: boolean;
      streetViewControl?: boolean;
      rotateControl?: boolean;
      fullscreenControl?: boolean;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class DistanceMatrixService {
      getDistanceMatrix(
        request: DistanceMatrixRequest,
        callback: (
          response: DistanceMatrixResponse,
          status: DistanceMatrixStatus
        ) => void
      ): void;
    }

    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: {
            input: string;
            types?: string[];
          },
          callback: (
            predictions: AutocompletePrediction[] | null,
            status: PlacesServiceStatus
          ) => void
        ): void;
      }

      interface AutocompletePrediction {
        description: string;
        place_id: string;
        structured_formatting: {
          main_text: string;
          secondary_text: string;
        };
      }

      enum PlacesServiceStatus {
        OK = "OK",
        ZERO_RESULTS = "ZERO_RESULTS",
        OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
        REQUEST_DENIED = "REQUEST_DENIED",
        INVALID_REQUEST = "INVALID_REQUEST",
        UNKNOWN_ERROR = "UNKNOWN_ERROR",
      }
    }

    enum GeocoderStatus {
      OK = "OK",
      ZERO_RESULTS = "ZERO_RESULTS",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      INVALID_REQUEST = "INVALID_REQUEST",
      UNKNOWN_ERROR = "UNKNOWN_ERROR",
    }

    enum DirectionsStatus {
      OK = "OK",
      ZERO_RESULTS = "ZERO_RESULTS",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      INVALID_REQUEST = "INVALID_REQUEST",
      UNKNOWN_ERROR = "UNKNOWN_ERROR",
      NOT_FOUND = "NOT_FOUND",
    }

    enum DistanceMatrixStatus {
      OK = "OK",
      ZERO_RESULTS = "ZERO_RESULTS",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      INVALID_REQUEST = "INVALID_REQUEST",
      UNKNOWN_ERROR = "UNKNOWN_ERROR",
      MAX_ELEMENTS_EXCEEDED = "MAX_ELEMENTS_EXCEEDED",
      MAX_DIMENSIONS_EXCEEDED = "MAX_DIMENSIONS_EXCEEDED",
    }

    const MapTypeId: {
      ROADMAP: string;
      SATELLITE: string;
      HYBRID: string;
      TERRAIN: string;
    };

    interface DirectionsRequest {
      origin: string | { lat: number; lng: number } | LatLng;
      destination: string | { lat: number; lng: number } | LatLng;
      travelMode: TravelMode;
      unitSystem?: UnitSystem;
    }

    interface DirectionsResult {
      routes: {
        legs: DirectionsLeg[];
      }[];
    }

    interface DirectionsLeg {
      distance: { text: string; value: number };
      duration: { text: string; value: number };
      steps: any[];
      start_address: string;
      end_address: string;
    }

    interface DistanceMatrixRequest {
      origins: (string | { lat: number; lng: number } | LatLng)[];
      destinations: (string | { lat: number; lng: number } | LatLng)[];
      travelMode: TravelMode;
      unitSystem?: UnitSystem;
    }

    interface DistanceMatrixResponse {
      rows: {
        elements: {
          distance: { text: string; value: number };
          duration: { text: string; value: number };
          status: string;
        }[];
      }[];
    }

    interface GeocoderResult {
      geometry: {
        location: LatLng;
      };
      formatted_address: string;
    }

    enum TravelMode {
      DRIVING = "DRIVING",
      WALKING = "WALKING",
      BICYCLING = "BICYCLING",
      TRANSIT = "TRANSIT",
    }

    enum UnitSystem {
      METRIC = 0,
      IMPERIAL = 1,
    }
  }
}
