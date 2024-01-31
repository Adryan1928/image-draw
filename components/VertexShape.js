import { Rect } from "@shopify/react-native-skia";

export const VertexShape = ({ x, y }) => {
  return <Rect x={x} y={y} width={10} height={10} color="white" />;
};
