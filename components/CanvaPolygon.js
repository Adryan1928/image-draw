import { Canvas, Line, vec } from "@shopify/react-native-skia";
import { useContext } from "react";

import { VertexShape } from "./VertexShape";
import { PolygonContext } from "../contexts/PolygonContext";

export const CanvaDraw = () => {
  const { coordinates, edges } = useContext(PolygonContext);
  return (
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
  );
};
