import './CanvasPage.css';
import { useEffect, useRef, useState } from 'react';
import { ToolPanel } from './ToolPanel';
import { PencilTool } from './pencilTool';
import { EraserTool } from './eraserTool';
import { SquareTool } from './squareTool';
import { CircleTool } from './circleTool';
import { TriangleTool } from './triangleTool';
import { LayerPanel } from './LayerPanel';
import { Layer } from './layer';

/**
 * An instance of each tool
 */
export const tools = [
	new PencilTool(),
	new EraserTool(),
	new SquareTool(),
	new CircleTool(),
	new TriangleTool()
]

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

/**
 * Canvas Page
 */
export function CanvasPage() {
  const [currentTool, setCurrentTool] = useState(tools[0]);
  const [mouseDown, setMouseDown] = useState(false);
  const [color] = useState("black");
	const [layerList, setLayerList] = useState([new Layer('First'), new Layer('Second')]);
	const [activeLayerId, setActiveLayerId] = useState(layerList[0].id)
  const canvasRef = useRef();
  const ctx = canvasRef.current?.getContext("2d");

	useEffect(() => {
		if (!!ctx) {
			ctx.fillStyle = color;
		}
	}, [ctx, color]);

  function onMouseUp(e) {
    setMouseDown(false);
    currentTool.onMouseUp({ x: e.pageX - 200, y: e.pageY }, ctx);
  }

  function onMouseDown(e) {
    setMouseDown(true);
    currentTool.onMouseDown({ x: e.pageX - 200, y: e.pageY }, ctx);
  }

  function onMouseMove(e) {
    if (mouseDown) {
      currentTool.onMouseMove({ x: e.pageX - 200, y: e.pageY }, ctx);
    }
  }

	useEffect(() => {
		if (mouseDown) {
			// TODO Only show active layer
		} else {
			// TODO Show all layers
		}
	}, [mouseDown, activeLayerId])

	function layerUp(index) {
		if (index === 0) return
		setLayerList(oldLayerList => {
			const newLayerList = [...oldLayerList];

			// Swap layer[index] and layer[index-1]
			const tmp = newLayerList[index-1];
			newLayerList[index-1] = newLayerList[index];
			newLayerList[index] = tmp;

			return newLayerList;
		})
	}

	function layerDown(index) {
		if (index === layerList.length - 1) return
		setLayerList(oldLayerList => {
			const newLayerList = [...oldLayerList];

			// Swap layer[index] and layer[index+1]
			const tmp = newLayerList[index+1];
			newLayerList[index+1] = newLayerList[index];
			newLayerList[index] = tmp;

			return newLayerList;
		})
	}

	function layerDelete(index) {
		setLayerList(oldLayerList => {
			const newLayerList = [...oldLayerList];

			newLayerList.splice(index, 1);

			return newLayerList;
		})
	} 

  function handleImage(e) {
    var img = new Image();
    img.onload = draw;
    img.src = URL.createObjectURL(e.target.files[0]);
  }
  function draw() {
    var ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(this, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
  function download(){
	var canvas = document.getElementById('mainCanvas');
	const image = canvas.toDataURL();
	const link = document.createElement('a');
	link.href = image;
	link.download = 'image.png';
	link.click();
  }


  return (
		<div>
			<div id="canvasPageContainer">
				<ToolPanel
					currentTool={currentTool}
					toolList={tools}
					setCurrentTool={setCurrentTool}
				/>
				<canvas
					id="mainCanvas"
					ref={canvasRef}
					width={CANVAS_WIDTH}
					height={CANVAS_HEIGHT}
					onMouseUp={onMouseUp}
					onMouseDown={onMouseDown}
					onMouseMove={onMouseMove}
				/>
				<div>
					<input
						type="file"
						id="file"
						accept="image/*"
						onChange={handleImage}
					></input>
			<button onClick = {download}>Download</button>
				</div>
			</div>
			<LayerPanel
				layers={layerList}
				selected={activeLayerId}
				setActiveLayer={setActiveLayerId}
				up={layerUp}
				down={layerDown}
				delete={layerDelete} />
		</div>
  );
}
