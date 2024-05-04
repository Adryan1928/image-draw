import { Canvas, Path, Skia, SkiaView, useTouchHandler, PaintStyle, Drawing, useDrawCallback } from "@shopify/react-native-skia";
import { Children, useRef, useContext } from "react";
import { PolygonContext } from "../contexts/PolygonContext";
import { useSharedValue } from "react-native-reanimated";
import { View } from "react-native";

const paint = () => {
  const paint = Skia.Paint()
  paint.setStyle(PaintStyle.Stroke)
  paint.setStrokeWidth(3)
  paint.setColor(Skia.Color('#000000'))
  return paint
}

export const CanvaDraw = () => {
  // const CurrentPath = useRef<SkPath | null>(null)
  const CurrentPath = useRef(null)
  const CanvasRef = useRef(null)
  const initialXY = useSharedValue({x:0, y:0})


  const {isDeleteOpen, isEditOpen, isEditVertexOpen, paths, setPaths} = useContext(PolygonContext);

  const onTouch = useTouchHandler({
    onStart: ({x, y}) => {
      if (CurrentPath.current){
        return
      }
      CurrentPath.current = Skia.Path.Make()
      CurrentPath.current.moveTo(x, y)
      initialXY.value = {x:x, y:y}
      CanvasRef.current?.drawPath(CurrentPath.current, paint())
    },
    onActive: ({x, y}) => {
      CurrentPath.current?.lineTo(x,y)
      CanvasRef.current?.drawPath(CurrentPath.current, paint())
      // console.log(CanvasRef.current)
    },
    onEnd: () => {
      CurrentPath.current.lineTo(initialXY.value.x, initialXY.value.y)
      setPaths(values => values.concat({
        path: CurrentPath.current,
        paint: paint(),
      }))

      CurrentPath.current = null
    }
  })

  const onDraw = useDrawCallback((_canvas, info) => {
    onTouch(info.touches);

    if (CurrentPath.current) {
      // console.log(CurrentPath.current)
      CanvasRef.current?.drawPath(
        CurrentPath.current,
        paint(),
      );
    }

    if (!CanvasRef.current) {
      CanvasRef.current = _canvas;
    }
  }, []);
  return (
    <>
    {isEditOpen || isDeleteOpen || isEditVertexOpen ? 
    <View style={{flex:1}}>
      <Canvas style={{height:'100%', width:'100%', position:'absolute' }}>
        {Children.toArray(paths.map((value) => (
          <Path path={value.path} paint={value.paint}/>
        )))}
      </Canvas>
      <SkiaView style={{flex:1}} onDraw={onDraw}/>
      
    </View>
    :
    <Canvas style={{width:'100%', height:'100%', position:'absolute' }}>
        {Children.toArray(paths.map((value) => (
          <Path path={value.path} paint={value.paint}/>
        )))}
      </Canvas>
  }
  </>
  );
};
