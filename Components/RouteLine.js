import { Polyline } from "react-native-maps";

export default function RouteLine({ coordinates }) {
    if (coordinates.length === 0) return null;

    return (
        <Polyline
            coordinates={coordinates}
            strokeWidth={5}
        />
    );
}