import { View, Text, StyleSheet } from "react-native";

export default function TravelTime({ minutes }) {
    if (minutes === null) return null;

    return (
        <View style={styles.infoBox}>
            <Text style={styles.infoText}>
                Estimated travel time: {minutes} min
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