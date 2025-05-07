import { Cell } from '../cell/cell';
import { ICellDTO } from '../cell/cell.interface';
import { IDirection } from '../movement/movement.interface';
import { IBoard, IBoardSize } from './board.inteface';
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
		this.fields[0][0].value = 1024;
		this.fields[0][1].value = 1024;
		/*   this.fields[0][0].value = 4;
    this.fields[0][1].value = 8;
    this.fields[0][2].value = 16;
    this.fields[0][3].value = 32;
    this.fields[0][4].value = 64;

    this.fields[1][0].value = 128;
    this.fields[1][1].value = 256;
    this.fields[1][2].value = 512;
    this.fields[1][3].value = 1024;
    this.fields[1][4].value = 2048; */

		/*        this.fields[0][0].value = 1024;
    this.fields[0][1].value = 1024;
    this.fields[0][2].value = 423;
    this.fields[0][3].value = 12;
    this.fields[0][4].value = 13;
    this.fields[1][0].value = 52;
    this.fields[1][1].value = 63;
    this.fields[1][2].value = 523;
    this.fields[1][3].value = 12;
    this.fields[1][4].value = 11;
    this.fields[2][0].value = 22;
    this.fields[2][1].value = 234;
    this.fields[2][2].value = 44;
    this.fields[2][3].value = 62;
    this.fields[2][4].value = 53;
    this.fields[3][0].value = 4;
    this.fields[3][1].value = 7;
    this.fields[3][2].value = 5;
    this.fields[3][3].value = 15;
    this.fields[3][4].value = 18;
    this.fields[4][0].value = 1;
    this.fields[4][1].value = 8;
    this.fields[4][2].value = 2;
    this.fields[4][3].value = 3;
    this.fields[4][4].value = 4; */
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
