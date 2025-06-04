export const USER_NAME_DEFAULT = 'User';

export interface IRequestScoreStart {
	id?: string;
}

/* export interface IRequestScoreEnd {
	startTime: string;
} */

export interface IResponseScoreStart {
	username: string;
	time: null | number;
	_id: string;
	createdAt: string;
	updatedAt: string;
}
type OmittedResponseEnd = Omit<IResponseScoreStart, 'time'>;

export interface IResponseScore extends OmittedResponseEnd {
	time: number;
	isRecord: boolean;
}
