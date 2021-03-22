import './CanvasPage.css';
import { useEffect, useRef, useState } from 'react';
import { ToolPanel } from './ToolPanel';
import { PencilTool } from './pencilTool';

/**
 * An instance of each tool
 */
 const tools = [
	new PencilTool()
]

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

/**
 * Canvas Page
 */
export function CanvasPage() {
	const [currentTool, setCurrentTool] = useState(tools[0]);
	const [mouseDown, setMouseDown] = useState(false);
	const [color] = useState('black');
	const canvasRef = useRef();
	const ctx =  canvasRef.current?.getContext('2d');

	useEffect(() => {
		if (!!ctx) {
			ctx.fill = color;
		}
	}, [ctx, color]);

	function onMouseUp(e) {
		setMouseDown(false);
		currentTool.onMouseUp({x: e.pageX - 200, y: e.pageY}, ctx);
	}

	function onMouseDown(e) {
		setMouseDown(true);
		currentTool.onMouseDown({x: e.pageX - 200, y: e.pageY}, ctx);
	}

	function onMouseMove(e) {
		if (mouseDown) {
			currentTool.onMouseMove({x: e.pageX - 200, y: e.pageY}, ctx);
		}
	}

	return (
		<div id="canvasPageContainer">
			<ToolPanel
				currentTool={currentTool}
				toolList={tools}
				setCurrentTool={setCurrentTool} />
			<canvas
				id="mainCanvas"
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				onMouseUp={onMouseUp}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove} />
		</div>
	)
}