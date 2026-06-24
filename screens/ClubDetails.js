import { View, Text, Image, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from "react";
import { BackgroundContext } from "../Context/BackgroundContext";


export default function ClubDetails({ route }) {
    const { team } = route.params;
    const navigation = useNavigation();
    const { backgroundColor, textColor } = useContext(BackgroundContext);

    const [notes, setNotes] = useState([]);
    const [input, setInput] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    const handleSaveNote = () => {
        if (input.trim() === '') return;

        if (editingIndex !== null) {
            const updated = [...notes];
            updated[editingIndex] = input;
            setNotes(updated);
            setEditingIndex(null);
        } else {
            setNotes([...notes, input]);
        }

        setInput('');
    };

    const handleDelete = (index) => {
        const filtered = notes.filter((_, i) => i !== index);
        setNotes(filtered);
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
            <Pressable onPress={handleSaveNote} style={styles.addButton}>
                <Text style={{ color: 'white' }}>
                    {editingIndex !== null ? "Update note" : "Add note"}
                </Text>
            </Pressable>

            {notes.map((note, index) => (
                <View key={index} style={styles.noteItem}>
                    <Text style={{ flex: 1, color: textColor }}>{note}</Text>
                    <Pressable onPress={() => handleEdit(index)}><Text style={{ color: 'blue' }}>Edit</Text></Pressable>
                    <Pressable onPress={() => handleDelete(index)}><Text style={{ color: 'red' }}>Delete</Text></Pressable>
                </View>
            ))}
            <Pressable
                style={styles.mapButton}
                onPress={() => navigation.navigate('Map', { team })}
            >
                <Ionicons name="map" size={20} color="white" />
                <Text style={styles.mapButtonText}>View on map</Text>
            </Pressable>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
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
});