import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Feather';

import Markdown from 'react-native-markdown-display';
import Button from '../components/Button';
import { Row, Col } from '../components/Grid';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency } from '../utils/formatCurrency';
import { useDispatch, useSelector } from 'react-redux';
import { selectCarDetail, getCarsDetails, resetDetailsState } from '../redux/reducers/cars';

const md = `## Include
  
  - Apa saja yang termasuk dalam paket misal durasi max 12 jam
  - Sudah termasuk bensin selama 12 jam
  - Sudah termasuk Tiket Wisata
  - Sudah termasuk pajak
  
  ## Exclude
  
  - Tidak termasuk biaya makan sopir Rp 75.000/hari
  - Jika overtime lebih dari 12 jam akan ada tambahan biaya Rp 20.000/jam
  - Tidak termasuk akomodasi penginapan`.toString();

export default function Detail({ route }) {
    const navigation = useNavigation();
    const { id } = route.params;
    const dispatch = useDispatch();
    const carDetail = useSelector(selectCarDetail);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dispatch(resetDetailsState())
        if(id !== carDetail.id){
            dispatch(getCarsDetails(id));
        }
    }, [id]);

    if (carDetail.status === 'loading') { return <ActivityIndicator />; }

    return (
        <View style={styles.container}>
            <Button style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon size={32} name={'arrow-left'} color={'#00000'} />
            </Button>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.heading}>
                    <Text style={styles.title}>{carDetail.data?.name}</Text>
                    <Row style={styles.iconWrapper} gap={5}>
                        <Col style={styles.textIcon}>
                            <Icon size={14} name={'users'} color={'#8A8A8A'} />
                            <Text style={styles.capacityText}>{carDetail.data?.seat}</Text>
                        </Col>
                        <Col style={styles.textIcon}>
                            <Icon size={14} name={'briefcase'} color={'#8A8A8A'} />
                            <Text style={styles.capacityText}>{carDetail.data?.baggage}</Text>
                        </Col>
                    </Row>
                    <Image
                        style={styles.image}
                        source={{ uri: carDetail.data?.image }}
                        height={200}
                        width={200}
                    />
                </View>
                <Markdown style={styles.details}>{carDetail.data?.description?.replace(/\\n/g,"\n")}</Markdown>
            </ScrollView>
            <View style={styles.footer}>
                <Text style={styles.price}>{formatCurrency.format(carDetail.data?.price || 0)}</Text>
                <Button
                    color="#3D7B3F"
                    title="Lanjutkan Pembayaran"
                    onPress={navigation.navigate('Order', { carId: carDetail.data?.id })}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    contentContainer: {
        paddingTop: 30,
        padding: 20,
    },
    heading: {
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
    },
    iconWrapper: {
        marginBottom: 20,
    },
    image: {
        marginBottom: 20,
    },
    details: {
        body: {
            fontSize: 16,
            marginBottom: 10,
        },
        bullet_list: {
            marginBottom: 10,
        },
        heading2: { marginBottom: 10, fontSize: 18, fontFamily: 'PoppinsBold' },
    },
    price: {
        fontFamily: 'PoppinsBold',
        fontSize: 20,
        marginBottom: 10,
    },
    footer: {
        backgroundColor: '#eeeeee',
        position: 'fixed',
        bottom: 0,
        padding: 20,
    },
    backButton: {
        alignItems: 'flex-start',
        position: 'fixed',
        backgroundColor: 'transparent',
        top: 40,
        left: 10,
        zIndex: 9,
        flex: 0,
    },
    textIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
});
