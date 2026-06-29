import { Marker } from "react-native-maps";

export default function TeamMarker({ team, onPress }) {
    return (
        <Marker
            coordinate={{
                latitude: team.loc.coordinates[1],
                longitude: team.loc.coordinates[0],
            }}
            title={team.title}
            description={team.description}
            onPress={() =>
                onPress({
                    latitude: team.loc.coordinates[1],
                    longitude: team.loc.coordinates[0],
                })
            }
        />
    );
}