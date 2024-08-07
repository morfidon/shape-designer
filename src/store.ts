import {
  boundingBox,
  initialState,
  intersection,
  isInCanvas,
  limitToCanvas,
  Point,
  Shape,
  State,
  ToolType
} from './model/canvas'
import { create } from 'zustand'

export const useStore = create(() => initialState)

// Selectors

export const previewSelector = (state: State) => {
  if (state.toolType === 'pan_tool') {
    return undefined
  }
  if (state.dragStart === undefined) {
    return undefined
  }

  const preview = boundingBox(state.dragStart, state.currentMousePosition)
  const canvas = {
    x: 0,
    y: 0,
    width: state.canvasSize.width - 1,
    height: state.canvasSize.height - 1
  }
  return intersection(preview, canvas)
}

// Actions
export const setCanvasWidth = (canvasWidth: number) => {
  useStore.setState(s => ({
    canvasSize: { ...s.canvasSize, width: canvasWidth }
  }))
}

export const setCanvasHeight = (canvasHeight: number) => {
  useStore.setState(s => ({
    canvasSize: { ...s.canvasSize, height: canvasHeight }
  }))
}

export const setTool = (tool: ToolType) => {
  useStore.setState({ toolType: tool })
}

export const onMouseMove = (mousePosition: Point) => {
  useStore.setState(state => {
    const adjustedPosition = limitToCanvas(mousePosition, state.canvasSize)
    return { ...state, currentMousePosition: adjustedPosition }
  })
}

export const onMouseDown = (mousePosition: { x: number; y: number }) => {
  useStore.setState(state => {
    return isInCanvas(mousePosition, state.canvasSize)
      ? { ...state, dragStart: mousePosition }
      : state
  })
}

export const onMouseUp = () => {
  useStore.setState(state => {
    if (state.dragStart === undefined) {
      return state
    }

    if (state.toolType === 'pan_tool') {
      return { ...state, dragStart: undefined }
    }
    if (state.toolType === 'select_tool') {
      return { ...state, dragStart: undefined }
    }

    const bb = boundingBox(state.dragStart, state.currentMousePosition)

    const newShape: Shape = {
      type:
        state.toolType === 'rectangle_tool'
          ? 'rectangle_shape'
          : 'ellipse_shape',
      isSelected: false,
      x: bb.x,
      y: bb.y,
      width: bb.width,
      height: bb.height
    }

    return {
      ...state,
      dragStart: undefined,
      shapes: [...state.shapes, newShape]
    }
  })
}
