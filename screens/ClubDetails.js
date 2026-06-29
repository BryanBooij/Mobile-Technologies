import { View, Text, Image, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackgroundContext } from "../Context/BackgroundContext";
import CustomButton from "../Components/customButton";

export default function ClubDetails({ route }) {
    const { team } = route.params;
    const navigation = useNavigation();
    const { backgroundColor, textColor } = useContext(BackgroundContext);
    const STORAGE_KEY = `notes_${team._id}`;

    const [notes, setNotes] = useState([]);
    const [input, setInput] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data !== null) {
                setNotes(JSON.parse(data));
            }
        } catch (e) {
            console.log("Error loading notes", e);
        }
    };

    const saveNotesToStorage = async (newNotes) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
        } catch (e) {
            console.log("Error saving notes", e);
        }
    };

    const handleSaveNote = () => {
        if (input.trim() === '') return;

        let updatedNotes;

        if (editingIndex !== null) {
            updatedNotes = [...notes];
            updatedNotes[editingIndex] = input;
            setEditingIndex(null);
        } else {
            updatedNotes = [...notes, input];
        }
        setNotes(updatedNotes);
        setInput('');
        saveNotesToStorage(updatedNotes);
    };

    const handleDelete = (index) => {
        const updatedNotes = notes.filter((_, i) => i !== index);
        setNotes(updatedNotes);

        saveNotesToStorage(updatedNotes);
    };

    const handleEdit = (index) => {
        setInput(notes[index]);
        setEditingIndex(index);
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>

            <Image source={{ uri: team.imageUrl }} style={styles.image} />
            <Text style={[styles.title, { color: textColor }]}>{team.title}</Text>
            <Text style={[styles.description, { color: textColor }]}>{team.description}</Text>
            <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Voeg notitie toe..."
                placeholderTextColor="#999"
                style={[styles.input, { color: textColor, borderColor: textColor }]}
            />
            <CustomButton
                onPress={handleSaveNote}
                text={editingIndex !== null ? "Update note" : "Add note"}
                style={styles.addButton}
                textStyle={{ color: "white" }}
            />

            {notes.map((note, index) => (
                <View key={index} style={styles.noteItem}>
                    <Text style={{ flex: 1, color: textColor }}>
                        {note}
                    </Text>

                    <CustomButton
                        onPress={() => handleEdit(index)}
                        icon={<Ionicons name="create" size={20} color="orange" />}
                    />

                    <CustomButton
                        onPress={() => handleDelete(index)}
                        icon={<Ionicons name="trash" size={20} color="red" />}
                    />
                </View>
            ))}
            <CustomButton
                onPress={() => navigation.navigate("Map", { team })}
                text="View on map"
                icon={<Ionicons name="map" size={20} color="white" />}
                style={styles.mapButton}
                textStyle={styles.mapButtonText}
            />
            <CustomButton
                onPress={() => navigation.goBack()}
                text="Back"
                icon={<Ionicons name="arrow-back" size={24} color={textColor} />}
                style={styles.backButton}
                textStyle={[styles.backText, { color: textColor }]}
            />
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
    input: {
        borderWidth: 1,
        padding: 10,
        width: '100%',
        borderRadius: 8,
        marginTop: 15,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        marginTop: 10,
        borderRadius: 8,
    },
    noteItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 10,
        width: '100%',
    },
    mapButton: {
        backgroundColor: '#447bff',
        padding: 10,
        marginTop: 10,
        borderRadius: 8,
    },
    mapButtonText: {
        color: '#ffffff',
    }
});