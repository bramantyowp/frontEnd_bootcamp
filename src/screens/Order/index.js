import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressStep, ProgressSteps } from 'react-native-progress-stepper';

import { formatCurrency } from '../../utils/formatCurrency';

import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';

import { selectCarDetail } from '../../redux/reducers/cars';
import { selectOrder, setStateByName, postOrder } from '../../redux/reducers/order';
import { selectUser } from '../../redux/reducers/user';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Button';
import moment from 'moment';

export default function Order() {
  const carDetails = useSelector(selectCarDetail);
  const { data, activeStep, selectedBank, status, errorMessage } = useSelector(selectOrder);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleOrder = () => {
    const formData = {
      carId: carDetails.data.id,
      startRentAt: moment().format('YYYY-MM-DD'),
      finishRentAt: moment().add(4, 'days').format('YYYY-MM-DD'),
    };

    dispatch(postOrder({token:user.data.access_token, formData}));
  };

  useEffect(() => {
    if(status === 'success'){
      console.log(data);
      dispatch(setStateByName({name: 'activeStep', value: 1}));
    }else{
      console.log(errorMessage);
    }
  }, [status]);

  return (
    <View style={{ flex: 1,  backgroundColor: '#fff' }}>
      <ProgressSteps activeStep={activeStep}>
        <ProgressStep label="Pilih Metode" removeBtnRow={true}>
          <Step1/>
        </ProgressStep>
        <ProgressStep label="Bayar" removeBtnRow={true}>
          <Step2/>
        </ProgressStep>
        <ProgressStep label="Tiket" removeBtnRow={true}>
          {/* <Step3/> */}
        </ProgressStep>
      </ProgressSteps>
      <View style={styles.footer}>
        {activeStep === 0 &&
          <>
            <Text style={styles.price}>{formatCurrency.format(carDetails.data?.price || 0)}</Text>
            <Button
              disabled={!selectedBank && true}
              color="#3D7B3F"
              onPress={handleOrder}
              title="Lanjutkan Pembayaran"
            />
          </>
        }
        {activeStep === 1 &&
          <>
            <Text style={styles.label}>Klik konfirmasi pembayaran untuk mempercepat proses pengecekan</Text>
            <Button
              color="#3D7B3F"
              style={{ marginBottom: 10 }}
              onPress={() => {
                dispatch(setStateByName({name: 'isModalVisible', value: true}));
              }}
              title="Konfirmasi Pembayaran"
            />
            <Button
              color="#ffffff"
              textColor="#000"
              title="Lihat Daftar Pesanan"
            />
          </>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  price: {
    fontFamily: 'PoppinsBold',
    fontSize: 20,
    marginBottom: 10,
  },
  label:{
    fontFamily: 'PoppinsBold',
    fontSize: 14,
    marginBottom: 10,
  },
  footer: {
    backgroundColor: '#eeeeee',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
});
