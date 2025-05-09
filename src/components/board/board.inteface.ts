import type { ICellValue } from '@/components/cell/cell.interface';
export type IBoardSize = 4 | 5;

type RowLengthArray<T, L extends ICellValue> = T[] & { length: L };
