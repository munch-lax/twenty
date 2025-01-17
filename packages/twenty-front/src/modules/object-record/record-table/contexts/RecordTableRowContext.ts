import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { createContext } from 'react';

export type RecordTableRowContextProps = {
  pathToShowPage: string;
  objectNameSingular: string;
  recordId: string;
  rowIndex: number;
  isSelected: boolean;
  isPendingRow?: boolean;
  isDragging: boolean;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
  inView?: boolean;
  isDragDisabled?: boolean;
};

export const RecordTableRowContext = createContext<RecordTableRowContextProps>(
  {} as RecordTableRowContextProps,
);
