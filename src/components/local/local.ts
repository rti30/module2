import { StorageService } from '@/utils/localStorage';
import { IScoreName } from '../score/score.interfaces';
import { ICellDTO } from '../cell/cell.interface';

export class Local {
	public readonly storage: StorageService = new StorageService();
	private readonly ttl: number = 3600 * 24 * 7;

	public setScore(name: IScoreName, value: number) {
		this.storage.set(name, value, this.ttl);
	}

	public getScore(name: IScoreName) {
		return this.storage.get(name) as number | null;
	}

	public setFields(fields: ICellDTO[][]) {
		this.storage.set('fields', fields, this.ttl);
	}

	public getFields() {
		return this.storage.get('fields') as ICellDTO[][];
	}

	public clear(): void {
		this.storage.remove('score');
		this.storage.remove('fields');
	}
}
