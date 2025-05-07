import '@styles/main.scss';
import './ui/popup/popup.scss';
import './ui/popup/popup.rules.scss';
import './ui/popup/popup.records.scss';
import { Game2048 } from './components/game/game2048';
import popupInstuctions from './components/popup/popup-instructions';
import popupRecords from './components/popup/popup-records';

document.addEventListener('DOMContentLoaded', () => {
	new Game2048({ boardSize: 5 });
	popupInstuctions();
	popupRecords();
});
