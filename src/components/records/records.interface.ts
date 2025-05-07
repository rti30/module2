export const USER_NAME_DEFAULT = 'User';

export interface IRequestScoreStart {
	username: string;
}

export interface IRequestScoreEnd {
	startTime: string;
}

export interface IResponseScoreStart {
	username: string;
	startTime: string | null;
	endTime: null;
	duration: null;
	_id: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}
type OmittedResponseEnd = Omit<IResponseScoreStart, 'duration' | 'endTime'>;

export interface IResponseScore extends OmittedResponseEnd {
	endTime: string;
	duration: number;
}
