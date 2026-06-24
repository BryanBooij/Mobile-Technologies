import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from "react-native-maps";
import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { EredivisieTeams } from '../Components/teamService';

export default function Map() {
    const [location, setLocation] = useState(null);
    const [region, setRegion] = useState(null);
    const [teams, setTeams] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [route, setRoute] = useState([]);

    useEffect(() => {
        async function loadTeams() {
            const data = await EredivisieTeams();
            setTeams(data);
        }

        loadTeams();
    }, []);

    useEffect(() => {
        let subscription;
        async function getCurrentLocation() {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

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

                    setRegion({
                        latitude,
                        longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
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

    useEffect(() => {
        async function fetchRoute() {
            if (!selectedVenue || !location) {
                setRoute([]);
                return;
            }
            try {
                const url =
                    // OSRM free open source routing
                    `https://router.project-osrm.org/route/v1/driving/` +
                    `${location.coords.longitude},${location.coords.latitude};` +
                    `${selectedVenue.longitude},${selectedVenue.latitude}` +
                    `?overview=full&geometries=geojson`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.routes?.length) {
                    const coordinates =
                        data.routes[0].geometry.coordinates.map(
                            ([longitude, latitude]) => ({
                                latitude,
                                longitude,
                            })
                        );

                    setRoute(coordinates);
                }
            } catch (error) {
                console.error('Error fetching route:', error);
            }
        }
        fetchRoute();
    }, [selectedVenue]);

    if (!region) {
        return <View style={styles.container} />;
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                showsUserLocation={true}
                region={region}
            >
                {teams.map((team, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: team.loc.coordinates[1],
                            longitude: team.loc.coordinates[0],
                        }}
                        title={team.title}
                        description={team.description}
                        onPress={() =>
                            setSelectedVenue({
                                latitude: team.loc.coordinates[1],
                                longitude: team.loc.coordinates[0],
                            })
                        }
                    />
                ))}
                
                {route.length > 0 && (
                    <Polyline
                        coordinates={route}
                        strokeWidth={5}
                    />
                )}
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