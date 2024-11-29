import { KeyboardAvoidingView, Platform, View, Text, Image, TextInput, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { Link, useNavigation } from '@react-navigation/native';
import ModalPopup from '../components/Modal/Modal';
import Icon from 'react-native-vector-icons/Feather';
//redux
import { useDispatch, useSelector } from 'react-redux';
import { postLogin, selectUser, resetState, setStateByName } from '../redux/reducers/user';
import GoogleButton from '../components/GoogleButton';

const initialFormState = {
  email: '',
  password: '',
}

export default function SignIn() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser); // (state) => state.user
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (val, name) => {
    setFormData({
      ...formData,
      [name]: val,
    });
  };

  const handleSubmit = async () => {
    await dispatch(postLogin(formData));
  };

  useEffect(() => {
    if (user.status === 'success') {
      setModalVisible(true);
      setErrorMessage(null);
      setTimeout(() => {
        setModalVisible(false);
        dispatch(setStateByName({
          name: 'status',
          value: 'idle',
        }));
        navigation.navigate('HomeTabs', { screen: 'Profile' });
      }, 1000);
    } else if (user.status === 'failed') {
      setModalVisible(true);
      setErrorMessage(user.message);
      setTimeout(() => {
        setModalVisible(false);
        dispatch(resetState());
      }, 2000);
    }
  }, [navigation, user]);

  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.authWrapper}>
        <ModalPopup visible={user.status === 'loading'}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <ActivityIndicator />
          </View>
        </ModalPopup>
        <View style={{ flex: 1 }}>
          <Image source={require('../assets/images/logo_tmmin.png')} />
          <Text style={styles.authTitle}>Welcome Back!</Text>
          <View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput style={styles.input} placeholder='Contoh: johndee@gmail.com' onChangeText={(text) => handleChange(text, 'email')} />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput style={styles.input} secureTextEntry={true}
                placeholder='6+ Karakter' onChangeText={(text) => handleChange(text, 'password')} />
            </View>
            <Button
              onPress={handleSubmit}
              title={'Sign In'}
              color={'#5CB85F'}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            <View>
              <Text style={{width: 50, textAlign: 'center'}}>OR</Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
          </View>
          <GoogleButton />
          <View>
            <Text style={styles.authFooterText}>Don’t have an account? <Link screen="SignUp">Sign Up for free</Link></Text>
          </View>
          <ModalPopup visible={modalVisible}>
            <View style={styles.modalBackground}>
              {errorMessage !== null ?
                <>
                  <Icon size={32} name={'x-circle'} />
                  {Array.isArray(errorMessage) ?
                    errorMessage.map((e) => {
                      return <Text>{e.message}</Text>
                    })
                    :
                    <Text>{errorMessage}</Text>
                  }
                </>
                :
                <>
                  <Icon size={32} name={'check-circle'} />
                  <Text>Berhasil Login!</Text>
                </>
              }
            </View>
          </ModalPopup>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  authWrapper: {
    flex: 1,
    padding: 20
  },
  authTitle: {
    fontSize: 32,
    fontWeight: 700,
    textAlign: 'center',
    marginVertical: 20
  },
  inputWrapper: {
    marginBottom: 20
  },
  inputLabel: {
    fontWeight: 700,
  },
  input: {
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  authFooterText: {
    marginTop: 10,
    fontWeight: 500,
    textAlign: "center"
  },
  modalBackground: {
    width: '90%',
    backgroundColor: '#fff',
    elevation: 20,
    borderRadius: 4,
    padding: 20
  }
})
