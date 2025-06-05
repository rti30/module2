import {
	IResponseScore,
	IResponseScoreStart,
	IRequestScoreStart,
	USER_NAME_DEFAULT,
} from './records.interface';
import { ApiClient } from '@/api/http-rest';
import { StorageService } from '@/utils/localStorage';
import { MessageList } from '@/ui/message/message';

export class RecordManager {
	private _userName: string = USER_NAME_DEFAULT;
	private _id: string | null = null;
	private scoreList: IResponseScore[];
	private readonly apiCliend: ApiClient = new ApiClient('http://localhost:3001/api/v1');
	private readonly storageServie: StorageService = new StorageService();
	private processingStart = false;
	private readonly ttl: number = 3600 * 24 * 7;
	private readonly userNameEl: HTMLDivElement | null = document.querySelector('#username');
	private scoreListEl: HTMLTableElement | null = document.querySelector('#body-record');
	private readonly messages = MessageList.getInstance();

	constructor() {
		this.getAll();
	}

	public set userName(name: string) {
		this._userName = name;

		if (this.userNameEl) {
			this.userNameEl.textContent = name;
		}
	}

	get userName() {
		return this._userName;
	}

	public restart() {
		this.reset();
		this.start();
	}

	public async start() {
		this.getInLocal();
		if (this.storageServie.get('thisGameInStorage') && this._id) {
			return;
		}
		if (this.processingStart) {
			return;
		}

		try {
			this.processingStart = true;
			const req: IRequestScoreStart = this._id
				? {
						id: this._id,
					}
				: {};
			const res = await this.apiCliend.post<IResponseScoreStart>('/record/', req);
			this.processingStart = false;

			if (res.ok && res.data) {
				const { username, _id } = res.data;

				if (!_id) {
					this.messages.create('Ошибка соединения. Рекорд не будет зафиксирован', 'warn');
					return;
				}

				this._id = _id;
				this.userName = username;
				this.saveStore();
				this.messages.create('Игра начата', 'info');
			}
		} catch (error) {
			this.messages.create('Ошибка соединения. Рекорд не будет зафиксирован', 'warn');
			this.processingStart = false;
			console.error('start: ', error);
		}
	}

	public async end() {
		if (!this._id) {
			this.messages.create('Ошибка, рекорд не зафиксирован(', 'warn');
			return;
		}
		try {
			const res = await this.apiCliend.patch<IResponseScore>(`/record/${this._id}`);
			if (res.ok) {
				this.getAll();
				this.reset();
				if (!res.data) {
					this.messages.create('Нет данных о рекорде', 'warn');
					throw new Error('Нет данных о рекорде');
				}
				const { isRecord, time } = res.data;
				console.log(res.data);

				const timeGame = this.formatLongDuration(time);
				if (isRecord) {
					this.messages.create(`Рекорд зафиксирован. Время прохождения: ${timeGame}`, 'info');
				} else {
					this.messages.create(`Рекорд не побит! Время прохождения: ${timeGame}`, 'warn');
				}
			}
		} catch (error) {
			this.messages.create('Ошибка, рекорд не зафиксирован(', 'warn');
			console.error('End:', error);
		}
	}

	private async getAll() {
		try {
			const res = await this.apiCliend.get<IResponseScore[]>('/record/');

			if (res.ok && res.data) {
				this.scoreList = res.data;
				this.render();
			}
		} catch (error) {
			console.error('All:', error);
		}
	}

	private async reset() {
		//? TODO пока оставил
	}

	public getInLocal() {
		const local_id = this.storageServie.get('_id') as string | null;
		const localUserName = this.storageServie.get('username') as string | null;

		this._id = local_id ?? null;
		this.userName = localUserName ?? USER_NAME_DEFAULT;
	}

	public saveStore() {
		this.storageServie.set('_id', this._id, this.ttl);
		this.storageServie.set('username', this.userName, this.ttl);
	}

	private formatLongDuration(ms: number): string {
		const seconds = Math.floor(ms / 1000) % 60;
		const minutes = Math.floor(ms / (1000 * 60)) % 60;
		const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
		const days = Math.floor(ms / (1000 * 60 * 60 * 24));

		const parts = [];

		if (days > 0) {
			parts.push(`${days} дн.`);
		}

		if (hours > 0) {
			parts.push(`${hours} ч.`);
		}

		if (minutes > 0) {
			parts.push(`${minutes} мин.`);
		}

		if (seconds > 0) {
			parts.push(`${seconds} сек.`);
		}

		return parts.join(' ') || '0 сек.';
	}

	private render() {
		if (!this.scoreListEl) {
			return;
		}

		this.scoreListEl.textContent = '';
		this.scoreList
			.sort((a, b) => a.time - b.time)
			.forEach((score, i) => {
				const { time, username } = score;

				const tr = document.createElement('tr');
				tr.classList.add('top-record');

				const tdRank = document.createElement('td');
				tdRank.classList.add('top-record__rank');
				tdRank.textContent = (i + 1).toString();

				const tdName = document.createElement('td');
				tdName.classList.add('top-record__name');
				tdName.textContent = username;

				const tdRecord = document.createElement('td');
				tdRecord.classList.add('top-record__score');
				tdRecord.textContent = this.formatLongDuration(time);

				[tdRank, tdName, tdRecord].forEach((el) => {
					tr.append(el);
				});
				this.scoreListEl?.append(tr);
			});
	}
}
