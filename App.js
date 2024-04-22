import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Button from "./components/Button";
import { FloatingMenu } from "./components/FloatingMenu";
import ImageViewer from "./components/ImageViewer";
import { PolygonShapeDraw } from "./components/PolygonShapeDraw";
import { PolygonProvider } from "./contexts/PolygonContext";

const PlaceholderImage = require("./assets/images/background-image.png");

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setIsEditing(true);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PolygonProvider>
        <View style={styles.imageContainer}>
          
          {isEditing ? 
            <PolygonShapeDraw
              placeholderImageSource={PlaceholderImage}
              selectedImage={selectedImage}
            />
          : 
            <ImageViewer
              placeholderImageSource={PlaceholderImage}
              selectedImage={selectedImage}
            />
          }
        </View>
        {isEditing ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <FloatingMenu />
            </View>
          </View>
        ) : (
          <View style={styles.footerContainer}>
            <Button
              theme="primary"
              label="Choose a photo"
              onPress={pickImageAsync}
            />
            <Button
              label="Use this photo"
              onPress={() => {
                setIsEditing(true);
              }}
            />
          </View>
        )}
        <StatusBar style="auto" />
      </PolygonProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
    left: "30%",
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
