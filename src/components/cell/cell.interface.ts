export type ICellValue = number;
export type ICellAnimationType = 'merge' | 'apear' | 'back';

export const CELL_LEVEL_STYLE: Readonly<Record<number, string>> = {
	2: 'level-0',
	4: 'level-1',
	8: 'level-2',
	16: 'level-3',
	32: 'level-4',
	64: 'level-5',
	128: 'level-6',
	256: 'level-7',
	512: 'level-8',
	1024: 'level-9',
	2048: 'level-10',
	4096: 'level-11',
	8192: 'level-12',
};

export interface ICellDTO {
	x: number;
	y: number;
	value: number;
}
