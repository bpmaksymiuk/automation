export type PaintTool = 'pencil' | 'eraser';

export const DEFAULT_PAINT_STATE = {
  activeTool: 'pencil' as PaintTool,
  activeColor: '#000000',
  palette: ['#000000', '#FFFFFF', '#808080', '#000080', '#008080', '#FF0000'],
};
