import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BackgroundContext = createContext();

export const BackgroundProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem("theme");
            if (savedTheme !== null) {
                setIsDark(savedTheme === "dark");
            }
        };

        loadTheme();
    }, []);

    const toggleBackground = async () => {
        const newValue = !isDark;
        setIsDark(newValue);

        await AsyncStorage.setItem("theme", newValue ? "dark" : "light");
    };

    const backgroundColor = isDark ? "#000" : "#fff";
    const textColor = isDark ? "#fff" : "#000";

    return (
        <BackgroundContext.Provider
            value={{
                isDark,
                toggleBackground,
                backgroundColor,
                textColor,
            }}
        >
            {children}
        </BackgroundContext.Provider>
    );
};