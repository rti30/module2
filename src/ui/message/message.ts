import { IMessageValue, ITypeMessage } from './message.interface';

class Message {
	public readonly el: HTMLLIElement;

	constructor(value: string, type: ITypeMessage) {
		this.el = document.createElement('li');
		this.el.textContent = value;
		switch (type) {
			case 'warn':
				this.el.classList.add('warn');
				break;
			case 'info':
				this.el.classList.add('info');
				break;
		}

		this.el.classList.add('message-item');
	}
}

export class MessageList {
	private static instance: MessageList;
	private messageList: IMessageValue[] = [];
	private readonly timeOut = 3000;
	private messageId: number = 0;
	private messageListEl: HTMLUListElement | null = document.querySelector('#message-list');

	private constructor() {}

	public static getInstance(): MessageList {
		if (!MessageList.instance) {
			MessageList.instance = new MessageList();
		}
		return MessageList.instance;
	}

	public create(value: string, type: ITypeMessage, isTemp = true) {
		const message = new Message(value, type);

		const id = this.messageId;
		this.messageList.push({ id, text: value });
		this.messageListEl?.append(message.el);
		message.el.classList.add('active');

		if (!isTemp) {
			return;
		}

		setTimeout(() => {
			const handleAnimationEnd = (e: AnimationEvent) => {
				if (e.animationName === 'fadeOut') {
					message.el.removeEventListener('animationend', handleAnimationEnd);
					message.el.remove();
				}
			};
			
			this.messageList = this.messageList.filter((message) => message.id !== id);
			message.el.addEventListener('animationend', handleAnimationEnd);
			message.el.classList.add('end');
			message.el.classList.remove('active');
		}, this.timeOut);
	}
}
