import { IPromiseVoid } from '../game/game-magager.interfaces';
import { CELL_LEVEL_STYLE, ICellAnimationType, ICellDTO } from './cell.interface';

export class Cell {
	public readonly el: HTMLDivElement;
	public readonly valueEl: HTMLDivElement;
	private _value: number = 0;
	private noMerge: boolean = false;
	animationPromise: IPromiseVoid;

	constructor(
		public readonly x: number,
		public readonly y: number,
		value: number = 0,
	) {
		this.el = this.createDivElement(['cell']);
		this.valueEl = this.createDivElement(['cell__value']);
		this.el.append(this.valueEl);
		this._value = value;
	}

	set value(value: number) {
		if (this.noMerge) {
			return;
		}
		this._value = value;
		this.render();
	}

	get value(): number {
		return this._value;
	}

	public denyMerge(): void {
		this.noMerge = true;
	}

	public allowMerge(): void {
		this.noMerge = false;
	}

	public isNoMerge() {
		return this.noMerge;
	}

	private async render(): IPromiseVoid {
		await this.animationPromise;
		this.valueEl.textContent = this.isEmpty() ? '' : this._value.toString();
		this.updateStyle();
	}

	private updateStyle(): void {
		const target = this.valueEl;
		Array.from(target.classList)
			.filter((className) => className.startsWith('level-'))
			.forEach((className) => target.classList.remove(className));

		if (!this.isEmpty()) {
			const styleClass = CELL_LEVEL_STYLE[this._value] ?? CELL_LEVEL_STYLE[8192];
			target.classList.add(styleClass);
		}
	}

	public isEmpty() {
		return this._value === 0;
	}

	private createDivElement(classNames: string[] | null = null): HTMLDivElement {
		const el = document.createElement('div');
		if (classNames) {
			el.classList.add(...classNames);
		}
		return el;
	}

	public rollDice(value: number): void {
		this.playAppearAnimation();
		this.value = value;
	}

	public merge(): void {
		this.playMergeAnimation();
		this.value *= 2;
	}

	public back(value: number = this.value): void {
		this.playBackAnimation();
		this.value = value;
	}

	public reset(): void {
		this._value = 0;
		this.render();
	}

	private async playAnimation(className: ICellAnimationType): IPromiseVoid {
		await this.animationPromise;
		this.valueEl.classList.add(className);
		const handleAnimationEnd = () => {
			this.valueEl.classList.remove(className);
		};
		this.valueEl.addEventListener('animationend', handleAnimationEnd);
	}

	private playMergeAnimation(): IPromiseVoid {
		return this.playAnimation('merge');
	}

	private playAppearAnimation(): IPromiseVoid {
		return this.playAnimation('apear');
	}

	private playBackAnimation(): IPromiseVoid {
		return this.playAnimation('back');
	}

	public addAnimationPromise(animationPromises: IPromiseVoid): void {
		this.animationPromise = animationPromises;
	}

	public toDTO(): ICellDTO {
		return {
			x: this.x,
			y: this.y,
			value: this._value,
		};
	}

	public static fromDTO({ x, y, value }: ICellDTO): Cell {
		const cell = new Cell(x, y, value);
		return cell;
	}
}
