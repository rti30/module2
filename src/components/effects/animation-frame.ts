import { IPromisePromise, IPromiseVoid } from '../game/game-magager.interfaces';

export interface AnimationCallback {
	(progress: number, deltaTime: number): void;
}

export class AnimationFrame {
	private animationId: number | null = null;
	private startTime: number = 0;
	private lastFrameTime: number = 0;
	private isRunning: boolean = false;
	private resolvePromise: IPromisePromise = null;
	private promise: IPromiseVoid;

	constructor(
		private readonly callback: AnimationCallback,
		private readonly duration: number,
		private readonly doAfter?: (...args: any[]) => any,
	) {}

	start(): IPromiseVoid {
		if (this.isRunning) {
			return Promise.reject(new Error('уже запущена'));
		}

		this.isRunning = true;
		this.startTime = performance.now();
		this.lastFrameTime = this.startTime;
		this.promise = new Promise((resolve) => {
			this.resolvePromise = resolve;
			this.animationId = requestAnimationFrame(this.loop.bind(this));
		});
		return this.promise;
	}

	stop(): void {
		if (!this.isRunning) return;

		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}

		this.isRunning = false;
		this.resolvePromise?.();
		this.resolvePromise = null;

		this.promise?.then(() => {
			if (this.doAfter) {
				this.doAfter();
			}
		});
	}

	private loop(timestamp: number): void {
		if (!this.isRunning) return;

		const elapsed = timestamp - this.startTime;
		const progress = Math.min(elapsed / this.duration, 1);
		const deltaTime = timestamp - this.lastFrameTime;
		this.lastFrameTime = timestamp;
		this.callback(progress, deltaTime);

		if (progress < 1) {
			this.animationId = requestAnimationFrame(this.loop.bind(this));
		} else {
			this.stop();
		}
	}

	get running(): boolean {
		return this.isRunning;
	}
}
