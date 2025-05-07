import { Cell } from '../cell/cell';
import { IDirection } from '../movement/movement.interface';

export const useAnimationMoving = (direction: IDirection, cells: Set<Cell>) => {
	return (progress: number) => {
		cells.forEach((cell) => {
			let x: number, y: number;
			let value = 100 * progress;
			switch (direction) {
				case 'up':
					[x, y] = [0, -value];
					break;
				case 'right':
					[x, y] = [value, 0];
					break;
				case 'down':
					[x, y] = [0, value];
					break;
				case 'left':
					[x, y] = [-value, 0];
					break;
			}
			cell.valueEl.style.transform = `translate(${x}%, ${y}%)`;
		});
	};
};

export const useDoAfter = (cells: Set<Cell>) => () => {
	cells.forEach((cell) => {
		cell.valueEl.style.transform = 'translate(0, 0)';
	});
	cells.clear();
};
