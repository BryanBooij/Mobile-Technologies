import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import * as Location from 'expo-location';

import {EredivisieTeams} from "../teams/EredivisieTeams";

export default function Map() {
    const [location, setLocation] = useState(null);
    const [region, setRegion] = useState(null);

    useEffect(() => {
        let subscription;

        async function getCurrentLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Low,
                    timeInterval: 2000,
                    distanceInterval: 1,
                },
                (newLocation) => {
                    const { latitude, longitude } = newLocation.coords;

                    setLocation(newLocation);
                    // set region on current location
                    setRegion({
                        latitude,
                        longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                }
            );
        }

        getCurrentLocation();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);


    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                showsUserLocation={true}
                region={{
                    latitude: 52.0,
                    longitude: 4.5,
                    latitudeDelta: 0.6,
                    longitudeDelta: 0.6,
                }}// set region on south holland
            >
                {EredivisieTeams.map((team, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: team.loc.coordinates[1],
                            longitude: team.loc.coordinates[0],
                        }}
                        title={team.title}
                        description={team.description}
                    />
                ))}
            </MapView>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: '100%',
        height: '100%',
    },
});