import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Image, StyleSheet, Text } from 'react-native'
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Picker from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityFResponse {
    nome: string
}

const Home = () => {
    const [UFs, setUFs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [selectedUf, setSelectedUf] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUFs(ufInitials.sort());
        })
    }, [])

    useEffect(() => {
        axios
            .get<IBGECityFResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome)
                setCities(cityNames);
            });
    }, [selectedUf]);

    function handleNavigationToPoints(uf: string, city: string) {
        navigation.navigate('Points', {uf: uf || '', city: city || ''});
    }

    return (
        <ImageBackground
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
            </View>

            <View>
                <Picker
                    key={0}
                    value={selectedUf}
                    placeholder={{ value: "0", label: "Selecione uma UF" }}
                    onValueChange={setSelectedUf}
                    items={UFs.map(UF => {
                        return {
                            label: UF,
                            value: UF,
                            key: UF
                        }
                    })}
                />

                <Picker
                    key={1}
                    value={selectedCity}
                    placeholder={{value: "0", label: "Selecione uma cidade"}}
                    onValueChange={setSelectedCity}
                    items={cities.map(city => {
                        return {
                            label: city,
                            value: city,
                            key: city
                        }
                    })}
                />
                <Text style={styles.selectTip}>
                    Selecione apenas UF para todas as cidades do Estado.
                    Para todos os pontos cadastrados (Independente da localidade), deixe os campos em branco (Pode causar travamentos)
                </Text>
            </View>

            <View style={styles.footer}>
                <RectButton
                    style={styles.button}
                    onPress={() => {
                        handleNavigationToPoints(selectedUf, selectedCity)
                    }}
                >
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24}/>  
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>Entrar</Text>
                </RectButton>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    selectTip: {
        fontSize: 12,
        color: 'darkgray',
        fontFamily: 'Roboto_400Regular',
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home;