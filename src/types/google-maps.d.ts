
declare namespace google {
  namespace maps {
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

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
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

    interface DirectionsRequest {
      origin: string | { lat: number; lng: number } | LatLng;
      destination: string | { lat: number; lng: number } | LatLng;
      travelMode: TravelMode;
      unitSystem?: UnitSystem;
    }

    interface DirectionsResult {
      routes: {
        legs: {
          distance: { text: string; value: number };
          duration: { text: string; value: number };
          steps: any[];
        }[];
      }[];
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
