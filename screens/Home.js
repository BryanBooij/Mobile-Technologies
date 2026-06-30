import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackgroundContext } from '../Context/BackgroundContext';
import { EredivisieTeams } from '../Components/TeamService';
import {useContext, useEffect, useState} from "react";
import TeamList from '../buttons/TeamList';

export default function Home() {
    const navigation = useNavigation();
    const { backgroundColor } = useContext(BackgroundContext);

    const [teams, setTeams] = useState([]);

    useEffect(() => {
        async function loadTeams() {
            const data = await EredivisieTeams();
            setTeams(data);
        }

        loadTeams();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <FlatList
                data={teams}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TeamList item={item} navigation={navigation} />
                )}
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
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