import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Switch, Text, View} from 'react-native';
import {useContext, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BackgroundContext} from "../Context/BackgroundContext";

export default function Settings() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isBackgroundColor, setIsBackgroundColor] = useState(true)
    const { isDark, toggleBackground } = useContext(BackgroundContext);
    const { backgroundColor, textColor } = useContext(BackgroundContext);

    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem('background', value.toString());
        } catch (e) {
            console.log(e);
        }
    };

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('background');
            if (value !== null) {
                setIsEnabled(value === "true");
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={[styles.text, { color: textColor }]}>Settings page</Text>
            <Text style={[styles.text, { color: textColor }]}>Turn on DarkMode </Text>
            <View style={styles.switch}>
                <Switch
                    style={styles.switch}
                    trackColor={{false: '#000000', true: '#ffffff'}}
                    thumbColor={isEnabled ? '#000000' : '#c3c3c3'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleBackground}
                    value={isDark}
                />
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

let isBackgroundColor;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isBackgroundColor ? '#fff' : '#000',
    },
    switch: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
