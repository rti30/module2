import type { ICellValue } from '@/components/cell/cell.interface';
export type IBoardSize = 4 | 5;

type RowLengthArray<T, L extends ICellValue> = T[] & { length: L };

export type IBoard<T, Rows extends ICellValue, Cols extends ICellValue> = RowLengthArray<
	RowLengthArray<T, Cols>,
	Rows
>;
