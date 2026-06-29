import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackgroundContext } from "../Context/BackgroundContext";

export default function Settings() {
    const { isDark, toggleBackground, backgroundColor, textColor } =
        useContext(BackgroundContext);

    // LOAD saved value on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const value = await AsyncStorage.getItem("background");

                // sync storage -> context
                if (value !== null) {
                    const parsed = value === "true";

                    // only update if different (prevents flicker)
                    if (parsed !== isDark) {
                        toggleBackground();
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };

        loadTheme();
    }, []);

    // SAVE whenever user toggles
    const handleToggle = async () => {
        try {
            await AsyncStorage.setItem("background", (!isDark).toString());
            toggleBackground();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={[styles.text, { color: textColor }]}>Turn on DarkMode</Text>
            <View style={styles.switch}>
                <Switch
                    style={styles.switch}
                    trackColor={{ false: "#000000", true: "#ffffff" }}
                    thumbColor={isDark ? "#000000" : "#ffffff"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={handleToggle}
                    value={isDark}
                />
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    switch: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
});