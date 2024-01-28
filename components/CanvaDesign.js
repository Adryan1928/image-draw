  import {
    Canvas,
    useTouchHandler,
    Points,
    vec
  } from "@shopify/react-native-skia";
  import { useState } from "react";
  import { StyleSheet } from "react-native";

  export default function CanvaDesign({saveImage}) {
    const [paths, setPaths] = useState([]);
    const onTouch = useTouchHandler({
      onStart: () => {},
      onActive: () => {},
      onEnd: ({ x, y }) => {
        setPaths(prevPaths => [...prevPaths, vec(x, y)])
      }
    });

    return (
      <Canvas style={styles.container} onTouch={onTouch}>
        <Points
          points={paths}
          style="stroke"
          strokeWidth={2}
          color="#3EB489"
          mode='polygon'
        />
      </Canvas>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      top: -350,
    },
  });
