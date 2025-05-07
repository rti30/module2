import { Cell } from '../cell/cell';
import { AnimationFrame } from '../effects/animation-frame';
import { AnimationCallback } from '../effects/animation-frame.interface';
import { useDoAfter, useAnimationMoving } from '../effects/effect.cell.list';
import { IDirection } from '../movement/movement.interface';
import { IPromiseVoid } from './game-magager.interfaces';

export class AnimationManager {
	private activeAnimations: IPromiseVoid[] = [];
	public needAnimation: Set<Cell> = new Set();

	private async runAnimation(
		callback: AnimationCallback,
		duration: number,
		doAfter: (...args: any[]) => any,
	) {
		const animationFrame = new AnimationFrame(callback, duration, doAfter);
		const animationPromise = animationFrame.start();
		if (!animationPromise) {
			return;
		}
		this.activeAnimations.push(animationPromise);
		animationPromise.finally(() => {
			this.activeAnimations = this.activeAnimations.filter((p) => p !== animationPromise);
		});
	}

	public async run(direction: IDirection) {
		return this.runAnimation(
			useAnimationMoving(direction, this.needAnimation),
			100,
			useDoAfter(this.needAnimation),
		);
	}

	async wait() {
		return Promise.all(this.activeAnimations);
	}

	get isAnimating() {
		return this.activeAnimations.length > 0;
	}

	public addCell(cell: Cell) {
		this.needAnimation.add(cell);
	}
}
