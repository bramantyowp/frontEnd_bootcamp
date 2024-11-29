import { View, Text, TextInput, StyleSheet, Pressable, Modal, ActivityIndicator } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrder, setFormData, getOrderDetails } from '../../../redux/reducers/order';
import { getCarsDetails, selectCarDetail } from '../../../redux/reducers/cars';
import CarList from '../../../components/CarList';
import Button from '../../../components/Button';
import Icon from 'react-native-vector-icons/Feather';
import SelectDropdown from 'react-native-select-dropdown';

const paymentMethods = [
  { bankName: 'BCA', account: 12345678, name: 'a. n Super Travel' },
  { bankName: 'MANDIRI', account: 12345678, name: 'a. n Super Travel' },
  { bankName: 'BNI', account: 12345678, name: 'a. n Super Travel' },
];

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const formatDate = (date) => new Date(date).toLocaleString('id-ID', options);

export default function Step1({ route }) {
  const orderId = route?.params?.orderId;
  const carId = route?.params?.carId;
  const [promoText, setPromoText] = useState(null);  // Memastikan promoText bisa null
  const { formData, status: orderStatus } = useSelector(selectOrder);
  const { data, status: carStatus } = useSelector(selectCarDetail);
  const dispatch = useDispatch();

  const [datePickerModal, setDatePickerModal] = useState({
    visible: false,
    currentInput: 'start_time'
  });

  const openDateTimePicker = (inputName) => {
    setDatePickerModal({
      visible: true,
      currentInput: inputName,
    });
  };

  const handleInputChange = (name, value) => {
    if (value instanceof Date) {
      value = value.toISOString(); // Mengonversi objek Date ke ISO string
    }
    dispatch(setFormData({ name, value }));
  };

  const minDate = (date) => {
    const newDate = new Date(date);
    return newDate.setDate(newDate.getDate() + 1);
  };

  const dateTimePickerHandler = (params) => {
    handleInputChange(datePickerModal.currentInput, params.date);
  };

  useEffect(() => {
    if (orderId && carId) {
      getOrderDetails(orderId);
      getCarsDetails(carId);
    }
    // Setel nilai default untuk start_time dan end_time jika belum ada
    if (!formData.start_time) {
      handleInputChange('start_time', new Date()); // Setel ke tanggal saat ini jika belum ada
    }
    if (!formData.end_time) {
      handleInputChange('end_time', new Date()); // Setel ke tanggal saat ini jika belum ada
    }
    handleInputChange('car_id', data.id);
  }, [orderId, carId, formData.start_time, formData.end_time, data.id, dispatch]);

  if (orderStatus === 'loading' || carStatus === 'loading') { 
    return <ActivityIndicator />; 
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <CarList
          image={{ uri: data?.img }}
          carName={data?.name}
          passengers={5}
          baggage={4}
          price={data.price}
        />
        <Text style={styles.textBold}>Pilih Opsi Sewa</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Tanggal Ambil</Text>
          <Pressable style={styles.inputDate} onPress={() => openDateTimePicker('start_time')}>
            <Text>{formData.start_time ? formatDate(formData.start_time) : 'Pilih Tanggal Ambil'}</Text>
          </Pressable>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Tanggal Kembali</Text>
          <Pressable style={styles.inputDate} onPress={() => openDateTimePicker('end_time')}>
            <Text>{formData.end_time ? formatDate(formData.end_time) : 'Pilih Tanggal Kembali'}</Text>
          </Pressable>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Tipe Supir</Text>
          <SelectDropdown
            data={[
              ...!data.isDriver && [{
                title: 'Lepas Kunci',
                value: false,
              }],
              {
                title: 'Dengan Sopir',
                value: true,
              }
            ]}
            onSelect={(selectedItem, index) => {
              handleInputChange('is_driver', selectedItem.value);
            }}
            defaultValue={formData.is_driver}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  {selectedItem && (
                    <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                  )}
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem.title) || 'Pilih supir'}
                  </Text>
                  <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
        </View>
        <Text style={styles.textBold}>Pilih Bank Transfer</Text>
        <Text style={styles.textBold}>
          Kamu bisa membayar dengan transfer melalui ATM, Internet Banking atau
          Mobile Banking
        </Text>
        <View
          style={{
            marginBottom: 10,
          }}
        >
          {paymentMethods.map((e) => (
            <Button
              key={e.bankName}
              style={styles.paymentMethod}
              onPress={() => {
                handleInputChange('payment_method', e.bankName);
              }}
            >
              <Text style={styles.paymentBox}>{e.bankName}</Text>
              <Text style={styles.paymentText}>{e.bankName} Transfer</Text>
              {formData.payment_method === e.bankName && (
                <Icon
                  style={styles.check}
                  color={'#3D7B3F'}
                  size={20}
                  name={'check'}
                />
              )}
            </Button>
          ))}
        </View>
        <View style={styles.promos}>
          <Text style={styles.textBold}>% Pakai Kode Promo</Text>
          <View style={styles.promosForm}>
            {!formData.promo ? (
              <>
                <TextInput
                  style={styles.promoInput}
                  onChangeText={(val) => setPromoText(val ? val : null)} // Set promoText ke null jika kosong
                  placeholder="Tulis promomu disini"
                />
                <Button
                  style={styles.promoButton}
                  onPress={() => {
                    handleInputChange('promo', promoText); // Promo bisa null atau string
                  }}
                  title={'Terapkan'}
                  color="#3D7B3F"
                />
              </>
            ) : (
              <View style={styles.promoTextWrapper}>
                <Text style={styles.promoText}>{formData.promo}</Text>
                <Pressable
                  onPress={() => {
                    handleInputChange('promo', null); // Reset promo ke null
                  }}
                >
                  <Icon
                    style={styles.check}
                    color={'#880808'}
                    size={30}
                    name={'x'}
                  />
                </Pressable>
              </View>
            )}
          </View>
        </View>
        <Modal visible={datePickerModal.visible}>
          <Pressable onPress={() => setDatePickerModal({ currentInput: null, visible: false })}>
            <Icon name={'x'} size={20} />
          </Pressable>
          <View style={styles.datePickerWrapper}>
            <DateTimePicker
              mode="single"
              timePicker={true}
              minDate={datePickerModal.currentInput === 'end_time' && minDate(formData.start_time)}
              date={formData[datePickerModal.currentInput]}
              onChange={dateTimePickerHandler}
            />
            <Button color="#3D7B3F" title={'Simpan'} onPress={() => setDatePickerModal({ currentInput: null, visible: false })} />
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  textBold: {
    fontFamily: 'PoppinsBold',
    fontSize: 16,
    marginBottom: 10,
  },
  Method: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 10,
    borderWidthBottom: 1,
    borderColorBottom: '#D0D0D0',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D0D0',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  
  paymentBox: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3D7B3F',
    flex: 1, // Ensures that the name takes up available space
  },
  paymentText: {
    flex: 1,
    fontSize: 14,
    color: '#888',
    marginLeft: 10,
  },
  check: {
    color: '#3D7B3F', // Green color for the check icon
    fontSize: 20,
  },
  // Wrapper for the entire bank section to add some margin
  paymentWrapper: {
    marginBottom: 20,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3D7B3F',
    marginBottom: 8,
    textAlign: 'center', // Center the title of the payment methods
  },
  // Text under the payment method section (instructions)
  paymentInstructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  promos: {
    marginTop: 20,
  },
  promosForm: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    borderWidth: 1,
    borderColor: '#3D7B3F',
    borderRadius: 10,
    width: '80%',
    height: 40,
    paddingHorizontal: 10,
    fontSize: 14,
    color: 'black',
  },
  promoButton: {
    backgroundColor: '#3D7B3F',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  promoTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  promoText: {
    fontSize: 16,
    fontFamily: 'PoppinsRegular',
  },
  datePickerWrapper: {
    flexDirection: 'column',
    padding: 20,
  },
  inputWrapper: {
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  inputDate: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 5,
  },
  dropdownButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  dropdownButtonTxtStyle: {
    fonpaymenttSize: 16,
    color: '#333',
  },
  dropdownButtonIconStyle: {
    marginRight: 10,
    fontSize: 20,
    color: '#3D7B3F',
  },
  dropdownButtonArrowStyle: {
    marginLeft: 'auto',
    fontSize: 16,
    color: '#3D7B3F',
  },
  dropdownMenuStyle: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
});
