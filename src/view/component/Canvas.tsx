import { useCopyPaste } from '../hooks/useCopyPaste'
import useGlobalHotkey from '../hooks/useGlobalHotkey'
import useRelativeMouseDown from '../hooks/useRelativeMouseDown'
import useRelativeMouseMove from '../hooks/useRelativeMouseMove'
import useRelativeMouseUp from '../hooks/useRelativeMouseUp'
import Grid from './Grid'
import Shape from './Shape'
import ToolPreview from './ToolPreview'
import { useStore } from '@/shell/store'
import { useRef } from 'react'

const Canvas = () => {
  const canvasRef = useRef(null)

  const { handleCopy, handlePaste } = useCopyPaste()

  const { width, height } = useStore(state => state.history.present.canvasSize)
  const shapeIds = useStore().getShapeIds()
  const { onMouseDown, onMouseMove, onMouseUp, deleteSelectedShapes } =
    useStore()

  useRelativeMouseUp((_x, _y, e) => {
    onMouseUp(e.ctrlKey ? 'toggle' : 'replace')
  }, canvasRef.current)

  useRelativeMouseDown((x, y) => {
    onMouseDown({ x, y })
  }, canvasRef.current)

  useRelativeMouseMove((x, y) => {
    onMouseMove({ x, y })
  }, canvasRef.current)

  useGlobalHotkey({ key: 'Delete' }, () => {
    deleteSelectedShapes()
  })

  useGlobalHotkey({ key: 'c', ctrl: true }, handleCopy)
  useGlobalHotkey({ key: 'v', ctrl: true }, handlePaste)

  return (
    <svg
      style={{
        width: `${width + 2}px`,
        height: `${height + 2}px`,
        backgroundColor: '#d1d5db'
      }}
    >
      <svg
        ref={canvasRef}
        overflow={'visible'}
        x={1}
        y={1}
        width={width}
        height={height}
        fill='transparent'
      >
        {/* Render the Grid first */}
        <Grid />
        {/* Render existing shapes on top of the Grid */}
        {shapeIds.map(shapeId => (
          <Shape key={shapeId} shapeId={shapeId} />
        ))}
        {/* Render the preview shape on top of everything */}
        <ToolPreview />
      </svg>
    </svg>
  )
}

export default Canvas
