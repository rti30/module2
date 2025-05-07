import { AnimationFrame } from '../effects/animation-frame';
import { IScoreAnimationType } from './score.interfaces';
import { useAnimationScore, useAfterAnimationScore } from '../effects/effect.score.list';

export class Score {
	private _score: number = 0;
	private _record: number = 0;
	private scoreEl: HTMLDivElement | null = document.querySelector('#score');
	private recordEl: HTMLDivElement | null = document.querySelector('#record');
	private scoreValueEl: HTMLDivElement | null | undefined =
		this.scoreEl?.querySelector('.score__value');
	private recordValueEl: HTMLDivElement | null | undefined =
		this.recordEl?.querySelector('.score__value');
	private readonly duration = 400;

	public addScore(value: number) {
		switch (value) {
			case 0:
				this.score = 0;
				break;
			default:
				this.score += value;
		}
	}
	public addRecord(value: number) {
		switch (value) {
			case 0:
				this.record = 0;
				break;
			default:
				this.record += value;
		}
	}

	set score(value: number) {
		const oldValue = this._score;
		this._score = value;
		if (this._score > this.record) {
			this.record = value;
		}

		if (!this.scoreValueEl) {
			return;
		}

		const className = this.getAnimationClassName(value, oldValue);
		new AnimationFrame(
			useAnimationScore(oldValue, value, this.scoreValueEl, className),
			this.duration,
			useAfterAnimationScore(this.scoreValueEl, className),
		).start();
	}
	get score() {
		return this._score;
	}

	set record(value: number) {
		const oldValue = this._record;
		this._record = value;
		if (!this.recordValueEl) {
			return;
		}
		const className = this.getAnimationClassName(value, oldValue);
		new AnimationFrame(
			useAnimationScore(oldValue, value, this.recordValueEl, className),
			this.duration,
			useAfterAnimationScore(this.recordValueEl, className),
		).start();
	}
	get record() {
		return this._record;
	}

	private getAnimationClassName(value: number, oldValue: number): IScoreAnimationType {
		const diff = value - oldValue;
		return diff < 0 ? 'negative' : 'positive';
	}
}
