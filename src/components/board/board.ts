import { Cell } from '../cell/cell';
import { ICellDTO } from '../cell/cell.interface';
import { IDirection } from '../movement/movement.interface';
import { IBoardSize } from './board.inteface';
import { UseCssVariables } from '@/utils/use-css-variables';
const NEW_VALUE_PROBABILITY = 0.9;

export class Board {
	public size: IBoardSize = 4;
	private _fields: Cell[][];
	public boardDirection: Record<IDirection, Cell[][]>;

	constructor(
		borderSize: IBoardSize,
		public elBoard: HTMLDivElement,
	) {
		this.size = borderSize;
		UseCssVariables.setRootVariables({ 'board-size': this.size.toString() });

		this.fields = new Array(this.size).fill([]).reduce((acc, _, i) => {
			acc[i] = [];
			for (let j = 0; j < this.size; j++) {
				const cell = new Cell(i, j);
				acc[i][j] = cell;
				elBoard.append(cell.el);
			}
			return acc;
		}, []);
		this._fields[0][1].value = 1024;
		this._fields[0][0].value = 1024;
		this.addNewValue();
	}

	public get fields() {
		return this._fields;
	}

	set fields(fields) {
		this._fields = fields;
		this.boardDirection = {
			left: this.fields,
			right: this.fields.map((row) => [...row].reverse()),
			up: this.fields[0].map((_, col) => this.fields.map((row) => row[col])),
			down: this.fields[0].map((_, col) => [...this.fields].reverse().map((row) => row[col])),
		};
	}

	public addNewValue(): void {
		const emptyCells: Cell[] = this.fields.flat().filter((cell) => cell.isEmpty());

		if (emptyCells.length === 0) {
			return;
		}
		const emptyCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
		const newValue = Math.random() < NEW_VALUE_PROBABILITY ? 2 : 4;
		emptyCell.rollDice(newValue);
	}

	public static toDTO(fields: Cell[][]): ICellDTO[][] {
		return fields.map((cells) => cells.map((cell) => cell.toDTO()));
	}

	public static fromDTO(fields: ICellDTO[][]): Cell[][] {
		return fields.map((cells) => cells.map((cell) => Cell.fromDTO(cell)));
	}
}
