import { StyleSheet, Image, Dimensions } from "react-native";

export default function ImageViewer({ placeholderImageSource, selectedImage }) {
  const imageSource = selectedImage
    ? { uri: selectedImage }
    : placeholderImageSource;
  return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: "100vh",
  },
});
