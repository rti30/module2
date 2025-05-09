import { IGameParams, KeyList } from './game2048.interface';
import { Board } from '../board/board';
import { Movement } from '../movement/movement';
import { GameManager } from './game-manager';
import { AnimationManager } from './animation-manager';
import { Score } from '../score/score';
import { Local } from '../local/local';

export class Game2048 {
	private startX: number;
	private startY: number;
	private minMouseDiff: number = 12;
	private g2048El: HTMLDivElement | null = document.querySelector('#game2048 .game2048__board');
	private local: Local;
	private board: Board;
	private movement: Movement;
	private gameManager: GameManager;
	private animationManager: AnimationManager;
	private score: Score;

	constructor(private readonly gameParams: IGameParams) {
		if (!this.g2048El) {
			return;
		}
		this.local = new Local();
		this.score = new Score();
		this.animationManager = new AnimationManager();
		this.board = new Board(gameParams.boardSize, this.g2048El);

		this.gameManager = new GameManager(
			this.local,
			this.board,
			this.board.boardDirection,
			this.animationManager,
			this.score,
		);

		this.movement = new Movement(this.board, this.gameManager, this.animationManager);
		this.keyEventListeners();
		this.mouseMoveEventListeners();
	}

	private keyEventListeners(): void {
		document.addEventListener('keydown', (e) => {
			if (this.animationManager.isAnimating || this.gameManager.isStop()) {
				return;
			}
			const key = e.key as KeyList;
			switch (key) {
				case KeyList.Up:
					this.movement.move('up');
					break;
				case KeyList.Right:
					this.movement.move('right');
					break;
				case KeyList.Down:
					this.movement.move('down');
					break;
				case KeyList.Left:
					this.movement.move('left');
					break;
				default:
					const _exhaustiveCheck: never = key;
					return _exhaustiveCheck;
			}
		});
	}

	private mouseMoveEventListeners(): void {
		this.board.elBoard.addEventListener('pointerdown', (e: PointerEvent) => {
			if (this.animationManager.isAnimating || this.gameManager.isStop()) {
				return;
			}
			this.startX = e.pageX;
			this.startY = e.pageY;
			e.preventDefault();
			document.addEventListener('pointerup', this.pointerUp);
		});
	}

	private pointerUp = (e: PointerEvent) => {
		const xMouseDiff = e.pageX - this.startX;
		const yMouseDiff = e.pageY - this.startY;
		const isVertical = Math.abs(yMouseDiff) > Math.abs(xMouseDiff);

		if (isVertical && Math.abs(yMouseDiff) >= this.minMouseDiff) {
			this.movement.move(yMouseDiff < 0 ? 'up' : 'down');
		} else if (Math.abs(xMouseDiff) >= this.minMouseDiff) {
			this.movement.move(xMouseDiff < 0 ? 'left' : 'right');
		}
		document.removeEventListener('pointerup', this.pointerUp);
	};
}
