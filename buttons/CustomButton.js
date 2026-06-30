import { Pressable, Text, StyleSheet } from "react-native";

export default function CustomButton({onPress, text, icon, style, textStyle,}) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                style,
                { opacity: pressed ? 0.7 : 1 },
            ]}
        >
            {icon}
            {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        marginLeft: 5,
    },
});