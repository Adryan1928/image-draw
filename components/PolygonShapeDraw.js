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

  // Os valores que serão mudados ao realizar algum evento para a animação

  const scale = useSharedValue(1)
  const isScale = useSharedValue(false)
  const oldScale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const oldTranslateX = useSharedValue(0)
  const oldTranslateY = useSharedValue(0)
  const isTranslate = useSharedValue(false)
  const initialDragZoom = useSharedValue(0)




  // Lógica dos gestures

  const differenceCoordinates = (initalDrag, itemToEdit) => {
    if (initalDrag) {
      const x = initalDrag.x - itemToEdit.x
      const y = initalDrag.y - itemToEdit.y
      return {
        x: x,
        y: y
      }
    }
    return {
      x: 0,
      y: 0
    }
  }

  // Gestures do polígono

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
    .onChange((e) => {
      const coordinate = {x: e.x, y: e.y}
      editItemFromPolygon(coordinate)
    })

  // Gestures de zoom
  
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

  const gesturePanZoom = Gesture.Pan().runOnJS(true).onStart((e) => {
    const coordinate = {x: e.x, y: e.y}
    initialDragZoom.value = coordinate
    if (translateX.value != 0){
      isTranslate.value = true
    }
  }).onChange((e) => {
    const coordinate = {x: e.x, y: e.y}
    const difference = differenceCoordinates(initialDragZoom.value, coordinate)

    if (isTranslate) {
      translateX.value = translateX.value - difference.x + oldTranslateX.value
      translateY.value = translateY.value - difference.y + oldTranslateY.value

      oldTranslateX.value = difference.x
      oldTranslateY.value = difference.y
    } else {
      translateX.value = -difference.x
      translateY.value = -difference.y
    }
  }).onEnd(() => {
    oldTranslateX.value = 0
    oldTranslateY.value = 0
  })

  const gestureDragAndTap = Gesture.Race(gestureEditDelete, gestureDrag)

  const gestureZoom = Gesture.Race(gesturePinch, gesturePanZoom)








  // Styles do animated
  const styleAnimatedImage = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value
      },
      {
        translateX: translateX.value
      },
      {
        translateY: translateY.value
      }
    ]
  }))

  return (
    <>
      <Animated.View style={styleAnimatedImage} children={
        <>
          <ImageViewer
                placeholderImageSource={placeholderImageSource}
                selectedImage={selectedImage}
              />
          <View style={styles.container}>
          {isEditOpen || isDeleteOpen || isEditVertexOpen ? (
              <CanvaDraw/>
          ) : (
            <GestureDetector gesture={gestureZoom}><CanvaDraw/></GestureDetector>
          )}
          </View>
        </>
      } />
      <View style={styles.container}>
        {isModalVisible && <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={{justifyContent: 'center', alignItems:'center', flex:1}}>
            <View style={{backgroundColor:'white', width: 300, borderRadius: 8, padding:16, gap: 16}}>
              <Text style={{fontSize: 24}}>A área em pixels: {calculateAreaPolygon(coordinates)}</Text>
              <TouchableOpacity onPress={() => {onVisibleModal(); scale.value=1; translateX.value =0; translateY.value=0}} style={{backgroundColor: '#d00000', borderRadius: 4, paddingVertical:8, justifyContent: 'center', alignItems: 'center'}}>
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
