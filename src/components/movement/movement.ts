import { Board } from '../board/board';
import { Cell } from '../cell/cell';
import { IDirection } from './movement.interface';
import { GameManager } from '../game/game-manager';
import { AnimationManager } from '../game/animation-manager';
import { IPromisePromise, IPromiseVoid } from '../game/game-magager.interfaces';

export class Movement {
	private mergedCells: Set<Cell> = new Set();
	private wasMove = false;

	constructor(
		private readonly board: Board,
		private readonly gameManager: GameManager,
		private readonly animationManager: AnimationManager,
	) {}

	public move = async (direction: IDirection): IPromiseVoid => {
		this.gameManager.saveGame({
			op: 'start',
			fields: this.board.fields,
			direction,
		});

		const boardDirection = this.board.boardDirection[direction];

		for (let i = 0; i < this.board.size; i++) {
			let cellResolve: IPromisePromise = null;
			const promise: IPromiseVoid = new Promise((resolve) => {
				cellResolve = resolve;
			});
			for (let j = 0; j < this.board.size; j++) {
				const cell = boardDirection[i][j];
				cell.addAnimationPromise(promise);
				if (!cell.isEmpty()) {
					j = this.moveCell(boardDirection, cell, i, j);
				}
			}
			this.animationManager.run(direction);
			this.animationManager.wait().then(() => {
				if (cellResolve) {
					cellResolve();
				}
			});
		}

		if (this.wasMove) {
			await this.animationManager.wait();
			this.board.addNewValue();
			this.gameManager.checkGame();
			this.gameManager.checkWin(this.mergedCells);
			this.wasMove = false;
			this.gameManager.addScore(this.mergedCells);
			this.gameManager.saveGame({
				op: 'end',
				mergedCells: this.mergedCells,
			});
		}
		this.resetFreezeCells();
		this.mergedCells.clear();
	};

	public moveCell(board: Cell[][], cell: Cell, i: number, j: number): number {
		if (j === 0) {
			return j;
		}
		const prevCell = board[i][j - 1];
		const value = cell.value;

		if (prevCell.isEmpty()) {
			this.animationManager.addCell(cell);

			cell.value = 0;
			prevCell.value = value;

			if (cell.isNoMerge()) {
				cell.allowMerge();
				prevCell.denyMerge();
			}

			this.wasMove = true;
			return j - 2;
		}
		const prevValue = prevCell.value;
		const canMerge = prevValue === value && !prevCell.isNoMerge() && !cell.isNoMerge();

		if (canMerge) {
			this.animationManager.addCell(cell);
			cell.value = 0;
			prevCell.merge();
			prevCell.denyMerge();
			this.mergedCells.add(prevCell);
			this.wasMove = true;
			return j - 2;
		}

		return j;
	}

	private resetFreezeCells(): void {
		this.mergedCells.forEach((cell) => cell.allowMerge());
	}
}
