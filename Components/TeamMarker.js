import { Marker, Callout } from "react-native-maps";
import { View, Text, Image, StyleSheet } from "react-native";

export default function TeamMarker({ team, onPress }) {
    return (
        <Marker
            coordinate={{
                latitude: team.loc.coordinates[1],
                longitude: team.loc.coordinates[0],
            }}
            onPress={() =>
                onPress({
                    latitude: team.loc.coordinates[1],
                    longitude: team.loc.coordinates[0],
                })
            }
        >
            <Callout>
                <View style={styles.container}>
                    <Image
                        source={{ uri: team.imageUrl }}
                        style={styles.image}
                    />
                    <Text style={styles.title}>{team.title}</Text>
                    <Text>{team.description}</Text>
                </View>
            </Callout>
        </Marker>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 220,
        padding: 10,
    },
    image: {
        width: 200,
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 4,
    },
});