import { IBoardSize } from '../board/board.inteface';

export interface IGameParams {
	boardSize: IBoardSize;
}

export type IRecord = number;
export type IScore = number;

export enum KeyList {
	Up = 'ArrowUp',
	Right = 'ArrowRight',
	Down = 'ArrowDown',
	Left = 'ArrowLeft',
}
