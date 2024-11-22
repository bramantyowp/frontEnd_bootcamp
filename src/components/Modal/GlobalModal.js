import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, Modal, StyleSheet, View } from 'react-native';

const SHOW_GLOBAL_MODAL = 'show_global_modal';
const HIDE_GLOBAL_MODAL = 'hide_global_modal';


export function showGlobalModal(prop) {
  DeviceEventEmitter.emit(SHOW_GLOBAL_MODAL, prop);
}

export function hideGlobalModal(key) {
  DeviceEventEmitter.emit(HIDE_GLOBAL_MODAL, key);
}

function GlobalModal() {
  const [modalProps, setModalProps] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isFirstModalRef = useRef(false);

  useEffect(() => {
    const showSub = DeviceEventEmitter.addListener(
      SHOW_GLOBAL_MODAL,
      (prop) => {
        setModalProps((oldProps) => {
          isFirstModalRef.current = oldProps.length === 0;
          setIsVisible(true);
          return [
            ...oldProps.filter((it) => !it.skipQueue),
            { ...prop, modalKey: prop.modalKey ?? Date.now().toString() },
          ];
        });
      }
    );
    const hideSub = DeviceEventEmitter.addListener(HIDE_GLOBAL_MODAL, (key) => {
      setModalProps((oldProps) => {
        if (oldProps.length === 1) {
          setIsVisible(false);
          return oldProps;
        }
        return oldProps.filter((it) => it.modalKey !== key);
      });
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const closeModal = () => {
    setModalProps((oldProps) => {
      if (oldProps.length === 1) {
        setIsVisible(false);
        return oldProps;
      }
      return oldProps.slice(0, -1);
    });
  };

  const onModalHide = () => {
    setModalVisible(false);
    setModalProps([]);
  };


  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
    } else {
      onModalHide();
    }
  }, [isVisible]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.backdrop} />
      <View
        style={styles.centeredView}
        needsOffscreenAlphaCompositing
      >
        <View
          style={styles.modalView}
        >
          {modalProps.map((it, index) => (
            <it.Component />
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default GlobalModal;
