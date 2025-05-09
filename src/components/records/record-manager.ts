import {
	IResponseScore,
	IResponseScoreStart,
	IRequestScoreStart,
	IRequestScoreEnd,
	USER_NAME_DEFAULT,
} from './records.interface';
import { ApiClient } from '@/api/http-rest';
import { StorageService } from '@/utils/localStorage';
import { MessageList } from '@/ui/message/message';

export class RecordManager {
	private _userName: string = USER_NAME_DEFAULT;
	private startTime: string | null = null;
	private _id: string | null = null;
	private scoreList: IResponseScore[];
	private readonly apiCliend: ApiClient = new ApiClient('http://localhost:3000/api/v1');
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

		if (this.startTime || this.processingStart) {
			return;
		}

		try {
			this.processingStart = true;
			const req: IRequestScoreStart = {
				username: this._userName,
			};
			const res = await this.apiCliend.post<IResponseScoreStart>('/score/', req);
			this.processingStart = false;

			if (res.ok && res.data) {
				const { username, _id, startTime } = res.data;

				if (!startTime || !_id) {
					this.messages.create('Ошибка соединения. Рекорд не будет зафиксирован', 'warn');
					return;
				}

				this.startTime = startTime;
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
		if (!this._id || !this.startTime) {
			this.messages.create('Ошибка, рекорд не зафиксирован(', 'warn');
			return;
		}
		try {
			const req: IRequestScoreEnd = {
				startTime: this.startTime,
			};
			const res = await this.apiCliend.patch<IResponseScore>(`/score/${this._id}`, req);

			if (res.ok) {
				this.getAll();
				this.reset();
				this.messages.create('Рекорд зафиксирован. Время прохождения:', 'info');
			}
		} catch (error) {
			this.messages.create('Ошибка, рекорд не зафиксирован(', 'warn');
			console.error('End:', error);
		}
	}

	private async getAll() {
		try {
			const res = await this.apiCliend.get<IResponseScore[]>('/score/');

			if (res.ok && res.data) {
				this.scoreList = res.data;
				this.render();
			}
		} catch (error) {
			console.error('All:', error);
		}
	}

	private async reset() {
		this.startTime = null;
		this._id = null;

		this.storageServie.remove('_id');
		this.storageServie.remove('startTime');
	}

	public getInLocal() {
		const local_id = this.storageServie.get('_id') as string | null;
		const localStartTime = this.storageServie.get('startTime') as string | null;
		const localUserName = this.storageServie.get('username') as string | null;

		this._id = local_id ?? null;
		this.startTime = localStartTime ?? null;
		this.userName = localUserName ?? USER_NAME_DEFAULT;
	}

	public saveStore() {
		this.storageServie.set('_id', this._id, this.ttl);
		this.storageServie.set('username', this.userName, this.ttl);
		this.storageServie.set('startTime', this.startTime, this.ttl);
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
			.sort((a, b) => a.duration - b.duration)
			.forEach((score, i) => {
				const { duration, username } = score;

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
				tdRecord.textContent = this.formatLongDuration(duration);
				
				[tdRank, tdName, tdRecord].forEach((el) => {
					tr.append(el);
				});
				this.scoreListEl?.append(tr);
			});
	}
}
