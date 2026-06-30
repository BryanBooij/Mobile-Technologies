import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MapView from "react-native-maps";
import { useEffect, useState, useRef } from "react";
import * as Location from 'expo-location';
import { EredivisieTeams } from '../Components/TeamService';
import TravelTime from "../Components/TravelTime";
import TeamMarker from "../Components/TeamMarker";
import RouteLine from "../Components/RouteLine";

export default function Map({ route }) {
    const [location, setLocation] = useState(null);
    const [region, setRegion] = useState(null);
    const [teams, setTeams] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [routeCoords, setRouteCoords] = useState([]);
    const [travelTime, setTravelTime] = useState(null); // NEW
    const map = useRef(null);
    const zoomedToTeam = useRef(false);

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

                    if (!zoomedToTeam.current) {
                        setRegion({
                            latitude,
                            longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        });
                    }
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
        const team = route?.params?.team;
        if (!team) return;

        const coords = team.loc?.coordinates;
        if (!coords || coords.length < 2) return;

        const latitude = coords[1];
        const longitude = coords[0];
        setSelectedVenue({ latitude, longitude });

        const regionForTeam = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };

        if (map.current && map.current.animateToRegion) {
            map.current.animateToRegion(regionForTeam, 1000);
            setRegion(regionForTeam);
            zoomedToTeam.current = true;
        } else {
            setRegion(regionForTeam);
        }
    }, [route?.params?.team]);

    useEffect(() => {
        async function fetchRoute() {
            if (!selectedVenue || !location) {
                setRouteCoords([]);
                setTravelTime(null);
                return;
            }
            try {
                const url =
                    `https://router.project-osrm.org/route/v1/driving/` +
                    `${location.coords.longitude},${location.coords.latitude};` +
                    `${selectedVenue.longitude},${selectedVenue.latitude}` +
                    `?overview=full&geometries=geojson`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.routes?.length) {
                    const route = data.routes[0];

                    const coordinates = route.geometry.coordinates.map(
                        ([longitude, latitude]) => ({
                            latitude,
                            longitude,
                        })
                    );

                    setRouteCoords(coordinates);
                    setTravelTime(Math.round(route.duration / 60));
                }
            } catch (error) {
                console.error('Error fetching route:', error);
            }
        }
        fetchRoute();
    }, [selectedVenue, location]);

    if (!region) {
        return <View style={styles.container} />;
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={map}
                style={styles.map}
                showsUserLocation={true}
                initialRegion={region}
                onPress={() => {
                    setRouteCoords([]);
                    setTravelTime(null);
                }}
                onMapReady={() => {
                    try {
                        const team = route?.params?.team;
                        if (!team || zoomedToTeam.current) return;

                        const coords = team.loc?.coordinates;
                        if (!coords || coords.length < 2) return;

                        const latitude = coords[1];
                        const longitude = coords[0];

                        const regionForTeam = {
                            latitude,
                            longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        };
                        if (map.current && map.current.animateToRegion) {
                            map.current.animateToRegion(regionForTeam, 1000);
                            zoomedToTeam.current = true;
                        }
                    } catch (e) {
                        console.warn('Error animating to team on map ready', e);
                    }
                }}
            >
                {teams.map((team, index) => (
                    <TeamMarker
                        key={index}
                        team={team}
                        onPress={setSelectedVenue}
                    />
                ))}
                <RouteLine coordinates={routeCoords} />
            </MapView>

            <TravelTime minutes={travelTime} />

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