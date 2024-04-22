import { useContext } from "react";
import { StyleSheet, View, Dimensions, Modal, TouchableOpacity, Text } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import { CanvaDraw } from "./CanvaDraw";
import { PolygonContext } from "../contexts/PolygonContext";
import { calculateAreaPolygon } from "../utils/calculateaArea";
import ImageViewer from "../components/ImageViewer";

export const PolygonShapeDraw = ({placeholderImageSource, selectedImage}) => {
  const { addItemToPolygon, removeItemFromPolygon, selectItemFromPolygon, setInitilDrag, editItemFromPolygon, onVisibleModal, isDeleteOpen, isEditOpen, isEditVertexOpen, isSelectEdit, isModalVisible, coordinates } =
    useContext(PolygonContext);

  const scale = useSharedValue(1)
  const isScale = useSharedValue(false)
  const oldScale = useSharedValue(1)

  const gestureEditDelete = Gesture.Tap()
    .runOnJS(true)
    .onEnd((e) => {
      const newCoordinate = { x: e.x, y: e.y };
      if (isEditOpen) {
        addItemToPolygon(newCoordinate);
      }

      if (isDeleteOpen) {
        removeItemFromPolygon(newCoordinate);
      }

      if (isEditVertexOpen) {
        selectItemFromPolygon(newCoordinate)
      }
    });
  
  const gestureDrag = Gesture.Pan().runOnJS(true)
    .onStart((e) => {
      const coordinate = {x: e.x, y: e.y}
      setInitilDrag(coordinate)
    })
    .onUpdate((e) => {
      const coordinate = {x: e.x, y: e.y}
      editItemFromPolygon(coordinate)
    })
  
  const gesturePinch = Gesture.Pinch().runOnJS(true).onBegin(() => {
    if (scale.value != 1){
      isScale.value = true
    }
  }).onChange((e) => {
    if (isScale.value) {
      scale.value = scale.value + e.scale - oldScale.value
      oldScale.value = e.scale
    } else {
      scale.value = e.scale
    }
  }).onEnd(() => {
    oldScale.value = 1
  })
  const gestureDragAndTap = Gesture.Race(gestureEditDelete, gestureDrag)

  const styleWidthHeight = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  }
  const styleAnimated = useAnimatedStyle(() => ({
    flex: 1,
    position: "absolute",
    ...styleWidthHeight,
    transform: [
      {
        scale: scale.value
      }
    ]
  }))

  const styleAnimatedImage = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value
      }
    ]
  }))

  return (
    <>
      <Animated.View style={styleAnimatedImage} children={<ImageViewer
            placeholderImageSource={placeholderImageSource}
            selectedImage={selectedImage}
          />} />
      <View style={styles.container}>
        {isEditOpen || isDeleteOpen || isEditVertexOpen ? (
          <GestureDetector gesture={gestureDragAndTap}>
            <Animated.View style={styleAnimated} children={<CanvaDraw/>} />
          </GestureDetector>
        ) : (
          <GestureDetector gesture={gesturePinch}><Animated.View style={styleAnimated} children={<CanvaDraw/>} /></GestureDetector>
        )}
        {isModalVisible && <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={{justifyContent: 'center', alignItems:'center', flex:1}}>
            <View style={{backgroundColor:'white', width: 300, borderRadius: 8, padding:16, gap: 16}}>
              <Text style={{fontSize: 24}}>A área em pixels: {calculateAreaPolygon(coordinates)}</Text>
              <TouchableOpacity onPress={() => {onVisibleModal(); scale.value=1}} style={{backgroundColor: '#d00000', borderRadius: 4, paddingVertical:8, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'white', fontSize:16}}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View> 
        </Modal>}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: "absolute",
  },
});
