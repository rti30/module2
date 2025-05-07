import { Cell } from '../cell/cell';
import { ICellDTO } from '../cell/cell.interface';
import { IDirection } from '../movement/movement.interface';
import { IScoreName } from '../score/score.interfaces';

export type IPromiseVoid = Promise<void>;

export type IPromisePromise = (() => void) | null;

interface StartOperation {
	op: 'start';
	fields: Cell[][];
	direction: IDirection;
}

interface EndOperation {
	op: 'end';
	mergedCells: Set<Cell>;
}

export type GameOperation = StartOperation | EndOperation;

export interface IStateDto {
	direction: IDirection | null;
	fields: ICellDTO[][] | null;
	mergedCells?: ICellDTO[] | null;
	op: StartOperation['op'] | EndOperation['op'];
	score?: number;
	record?: number;
}
