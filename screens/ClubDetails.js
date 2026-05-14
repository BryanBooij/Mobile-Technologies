import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {BackgroundContext} from "../Context/BackgroundContext";
import {useContext} from "react";


export default function ClubDetails({ route }) {
    const { team } = route.params;
    const navigation = useNavigation();
    const { isDark, toggleBackground } = useContext(BackgroundContext);
    const { backgroundColor, textColor } = useContext(BackgroundContext);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Image source={{ uri: team.imageUrl }} style={styles.image} />
            <Text style={[styles.title, { color: textColor }]}>{team.title}</Text>
            <Text style={[styles.description, { color: textColor}]}>{team.description}</Text>
            {/*{[styles.text, { color: textColor }]}*/}
            <Pressable
                style={({ pressed }) => [
                    styles.mapButton,
                    {
                        opacity: pressed ? 0.7 : 1,
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                ]}
                onPress={() => navigation.navigate('Map', { team })}
            >
                <Ionicons name="map" size={20} color="white" />
                <Text style={styles.mapButtonText}>View on map</Text>
            </Pressable>
            <Pressable style={[styles.backButton, {color: textColor}]} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={textColor} />
                <Text style={[styles.backText, { color: textColor }]}>Back</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    backText: {
        fontSize: 16,
        marginLeft: 5,
    },
});