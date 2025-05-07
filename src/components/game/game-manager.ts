import { Board } from '../board/board';
import { Cell } from '../cell/cell';
import { IDirection } from '../movement/movement.interface';
import { AnimationManager } from './animation-manager';
import { Score } from '../score/score';
import { RecordManager } from '../records/record-manager'; //TODO Подумать над генераций событий для этого модуля без внедрения.

import { GameOperation, IPromiseVoid, IStateDto } from './game-magager.interfaces';
import { Local } from '../local/local';

export class GameManager {
	startY: number;
	private step: number = 0;
	private maxSteps = 5;
	private state: IStateDto[] = [];
	private gameMessageEl: HTMLDivElement | null = document.querySelector('.game-message');
	private gameWinEl: HTMLDivElement | null = document.querySelector('.game-win');
	private readonly recordManager = new RecordManager();

	private gameContinueEl: HTMLDivElement | null = document.querySelector('.game-win__continue');

	private gameOverEl: HTMLDivElement | null = document.querySelector('.game-over');

	private buttonBackEl: HTMLButtonElement | null = document.querySelector('button#back');

	private restartEl: HTMLButtonElement | null = document.querySelector('button#restart');
	private restartElms: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.button-restart');

	private flagStop: boolean = false;
	private flagLoop: boolean = false;

	constructor(
		private readonly local: Local,
		private readonly board: Board,
		private readonly boardDirection: Record<IDirection, Cell[][]>,
		private readonly animationManager: AnimationManager,
		private readonly score: Score,
	) {
		this.buttonBackEl?.addEventListener('click', this.goBack);
		[this.restartEl, ...this.restartElms].forEach((el) =>
			el?.addEventListener('click', this.restart),
		);
		this.gameContinueEl?.addEventListener('click', this.continueGame);
		this.getInLocal();
		this.recordManager.start();
	}

	public saveGame(operation: GameOperation): void {
		switch (operation.op) {
			case 'start':
				const { direction, fields, op } = operation;
				this.state[this.step] = {
					direction,
					fields: Board.toDTO(fields),
					op,
				};
				this.state[this.step].score = this.score.score;
				this.state[this.step].record = this.score.record;
				break;

			case 'end':
				const { mergedCells } = operation;
				if (!this.state[this.step]) {
					break;
				}
				this.state[this.step].mergedCells = Array.from(mergedCells).map((cell) => cell.toDTO());
				this.state[this.step].op = operation.op;

				this.step++;
				while (this.state.length > this.maxSteps) {
					this.state.shift();
					this.step = Math.max(0, this.step - 1);
				}
				this.saveInLocal();
				if (this.state.length && this.buttonBackEl) {
					this.buttonBackEl.disabled = false;
				}
				break;
			default:
				const _exhaustiveCheck: never = operation;
				return _exhaustiveCheck;
		}
	}

	public goBack = (e: MouseEvent): void => {
		if (!this.state.length || !this.buttonBackEl) {
			return;
		}
		e.preventDefault();
		if (this.state[this.state.length - 1].op === 'start') {
			this.state.pop();
			if (!this.state.length) {
				return;
			}
		}
		const { mergedCells, fields, score, record } = this.state[this.state.length - 1];

		this.state.pop();
		this.step = Math.max(0, this.step - 1);

		if (fields) {
			const backFields = Board.fromDTO(fields);
			this.restoreFields(backFields);
			this.score.record = record ?? 0;
			this.score.score = score ?? 0;
			mergedCells?.forEach(({ x, y }) => {
				this.board.fields[x][y].back();
			});
		}
		this.saveInLocal();
		if (!this.state.length) {
			this.buttonBackEl.disabled = true;
			return;
		}
	};

	public checkGame(): boolean {
		for (const [_, board] of Object.entries(this.boardDirection)) {
			for (const row of board) {
				for (let j = 0; j < row.length; j++) {
					const value = row[j].value;
					if (value === 0) {
						return false;
					}
					if (j > 0 && row[j - 1].value === value) {
						return false;
					}
				}
			}
		}
		this.gameOver();
		return true;
	}

	public checkWin(cells: Set<Cell>): boolean {
		cells.forEach((cell) => {
			if (cell.value >= 2048 && !this.flagLoop) {
				this.gameWin();
				return true;
			}
		});
		return false;
	}

	public restart = (): void => {
		this.flagLoop = false;
		this.flagStop = false;
		this.state = [];

		this.score.addScore(0);
		this.local.setScore('record', this.score.record);
		this.board.fields.forEach((row) => {
			row.forEach((cell) => cell.reset());
		});
		this.gameMessageEl?.classList.remove('active');
		this.gameMessageEl?.setAttribute('hidden', '');
		this.board.addNewValue();
		this.local.clear();
		if (this.buttonBackEl) {
			this.buttonBackEl.disabled = true;
		}
		this.recordManager.restart();
	};

	private async gameOver(): IPromiseVoid {
		this.flagStop = true;
		await this.animationManager.wait();
		this.gameOverEl?.classList.add('active');
		this.gameWinEl?.classList.remove('active');
		this.gameMessageEl?.classList.add('active');
		this.gameMessageEl?.removeAttribute('hidden');
	}

	private async gameWin(): IPromiseVoid {
		this.flagStop = true;
		await this.animationManager.wait();
		this.gameOverEl?.classList.remove('active');
		this.gameWinEl?.classList.add('active');
		this.gameMessageEl?.classList.add('active');
		this.gameMessageEl?.removeAttribute('hidden');
		this.recordManager.end();
	}

	public isStop() {
		return this.flagStop;
	}

	private continueGame = () => {
		this.flagLoop = true;
		this.flagStop = false;
		this.gameMessageEl?.classList.remove('active');
		this.gameMessageEl?.setAttribute('hidden', '');
		this.checkGame();
	};

	public addScore(mergedCells: Set<Cell>): void {
		mergedCells.forEach((cell) => {
			this.score.addScore(cell.value);
		});
	}

	private async saveInLocal(): Promise<void> {
		await this.animationManager.wait();
		this.local.setFields(Board.toDTO(this.board.fields));
		this.local.setScore('score', this.score.score);
		this.local.setScore('record', this.score.record);
	}

	private getInLocal(): void {
		const localScore = this.local.getScore('score');
		const localRecord = this.local.getScore('record');
		this.score.record = localRecord ?? 0;
		const localFields = this.local.getFields();
		if (!localFields) {
			return;
		}
		const backFields = Board.fromDTO(localFields);
		this.restoreFields(backFields);
		this.score.score = localScore ?? 0;
	}

	private restoreFields(fields: Cell[][]) {
		const backFields = Board.fromDTO(fields);
		this.board.fields = backFields;
		this.board.elBoard.textContent = '';
		this.board.fields.forEach((row) =>
			row.forEach((cell) => {
				this.board.elBoard.append(cell.el);
				cell.value = cell.value;
			}),
		);
	}
}
