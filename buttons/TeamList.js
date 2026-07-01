import { Pressable, Image, Text, StyleSheet } from 'react-native';
export default function TeamList({ item, navigation }) {
    const handlePress = () => {
        navigation.navigate('ClubDetails', { team: item });
    };

    return (
        <Pressable
            style={ styles.card }
            onPress={handlePress}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f2f2f2',
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    description: {
        fontSize: 14,
        marginTop: 5,
    },
});