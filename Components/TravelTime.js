import { View, Text, StyleSheet } from "react-native";

export default function TravelTime({ minutes }) {
    if (minutes === null) return null;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    let travelTime;

    if (hours > 0) {
        travelTime = `${hours}h ${remainingMinutes} min`;
    } else {
        travelTime = `${minutes} min`;
    }

    return (
        <View style={styles.infoBox}>
            <Text style={styles.infoText}>
                Estimated travel time: {travelTime}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    infoBox: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        elevation: 5,
    },
    infoText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});