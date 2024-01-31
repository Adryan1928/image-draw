import { Canvas, Line, vec } from "@shopify/react-native-skia";
import { useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

import { VertexShape } from "./VertexShape";

export const PolygonShapeDraw = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [edges, setEdges] = useState([]);

  const gesture = Gesture.Tap()
    .runOnJS(true)
    .onEnd((e) => {
      const newCoordinate = { x: e.x, y: e.y };
      setCoordinates([...coordinates, newCoordinate]);
      const lastEdge = edges.length > 0 ? edges.slice(-1)[0].p2 : newCoordinate;
      setEdges([...edges, { p1: lastEdge, p2: newCoordinate }]);
    });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ flex: 1 }}>
          {edges.map((e, index) => {
            return (
              <Line
                key={index}
                p1={vec(e.p1.x, e.p1.y)}
                p2={vec(e.p2.x, e.p2.y)}
                color="lightblue"
                style="stroke"
                strokeWidth={4}
              />
            );
          })}
          {coordinates.map((c, index) => (
            <VertexShape key={index} x={c.x} y={c.y} />
          ))}
        </Canvas>
      </GestureDetector>
    </View>
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
