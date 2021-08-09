"use strict"

class TicTacToe {
	state = {
		idEl: "#app",
		btnStart: true,
		btnStopGame: false,
		btnPause: false,
		dafaultSettings: {
			difficulty: "easy",
			sizePlace: 3,
			timeoutStep: 10000,
			players: 1,
			simbol: "x",
		},
		currentPlayer: true,
		userInfo: {},
		gameStep: [],
		placeGame: [],
		endGame: false,
		isPaused: false,
	};

	constructor(idEl, settingPlace, msgBlock) {
		//this.state = state;
		//this.state.idEl = document.querySelector(idEl);
		this.msgBlock = msgBlock;
		this.idEl = document.querySelector(idEl);
		this.settingPlace = settingPlace;
	}

	startGame() {  
		const sizePlace = this.state.dafaultSettings.sizePlace;
		this.state.placeGame = [];
		this.state.currentPlayer = true;
		this.labelTime = document.createElement("label");
		this.labelTime.classList.add("timer");
		this.state.endGame = false;
		const place = document.createElement("div");
		place.classList.add("place");

		for (let i = 0; i < sizePlace; i++) {
		const row = document.createElement("div");
		//row.setAttribute('data-row', `${i}`)
		row.classList.add("rw");
		this.state.placeGame.push(i);
		this.state.placeGame[i] = [];
		for (let j = 0; j < sizePlace; j++) {
			const ceil = document.createElement("div");
			ceil.setAttribute("data-ceil", `${j}`);
			ceil.setAttribute("data-row", `${i}`);
			ceil.classList.add("cl");
			ceil.addEventListener("click", (e) => this.eventCeil(e));
			this.state.placeGame[i].push(null);
			row.append(ceil);
		}
		place.append(row);
		}
		this.idEl.append(place);
		this.createTimer();
	}

	refreshGame() {
		this.startGame();
	}

	createTimer() {
		let seconds = 11;
		const lt = this.labelTime;
		this.settingPlace.append(lt);
		this.timer = setInterval(() => {
		if (!this.state.isPaused) {
			seconds--;
			if (seconds < 1) {
			this.changePlayer(lt);
			} else {
			lt.textContent = `Timer: ${seconds}`;
			}
		}
		}, 1000);
	}

	clearTimer() {
		clearInterval(this.timer);
		this.labelTime.remove();
	}

	changePlayer() {
		this.clearTimer();
		if (this.state.dafaultSettings.players === 1 && !this.state.endGame) {
		this.botGame();
		}
		if (this.state.dafaultSettings.players === 2 && !this.state.endGame) {
		this.createTimer();
		}
		this.state.currentPlayer = !this.state.currentPlayer;
	}

	createBtns(id, name, classList, eventFunction, settingPlace) {
		const btn = document.createElement("button");
		btn.setAttribute("id", id);
		btn.setAttribute("type", "button");
		btn.classList.add(...classList);
		btn.textContent = name;
		btn.addEventListener("click", eventFunction);
		settingPlace.append(btn);
		return btn;
	}

	createSelectPlayer(eventFunction) {
		const el = document.createElement("div");
		el.classList.add("card", "px-2", "py-2", "mt-2");
		el.innerHTML = `
				<div class="form-check">
					<input class="form-check-input" type="radio" name="flexRadio" data-player="1" id="player_1" checked>
					<label class="form-check-label" for="flexRadio1">
						1 Player
					</label>
				</div>
				<div class="form-check">
					<input class="form-check-input" type="radio" name="flexRadio" data-player="2" id="player_2">
					<label class="form-check-label" for="flexRadio2">
						2 Players
					</label>
				</div>
			`;
		this.settingPlace.append(el);
		const els = el.querySelectorAll('[type="radio"]');
		els.forEach((item) => item.addEventListener("change", eventFunction));
		return el;
	}

	createSelectPlace(eventFunction) {
		const el = document.createElement("select");
		el.setAttribute("id", "select_place");
		el.classList.add("form-select", "mt-2");
		el.addEventListener("change", eventFunction);
		el.innerHTML = `
				<option value="3" selected>3 x 3</option>
				<option value="4">4 x 4</option>
				<option value="5">5 x 5</option>
				<option value="6">6 x 6</option>
				<option value="7">7 x 7</option>
				<option value="8">8 x 8</option>
				<option value="9">9 x 9</option>
				<option value="10">10 x 10</option>
			`;
		this.settingPlace.append(el);
		return el;
	}

	selectPlayer(num) {
		this.state.dafaultSettings.players = +num;
	}

	selectPlaceSize(num) {
		this.state.dafaultSettings.sizePlace = +num;
	}

	botGame() {
		// Так сказать ИИ :)
		const spg = this.state.placeGame;
		let tx = null,
		ty = null,
		tp = 0; // tp - приоритет выбранной целевой клетки.
		let stX = 0,
		stY = 0;
		for (stX = 0; stX < spg.length; stX++)
		for (stY = 0; stY < spg[0].length; stY++) {
			let lC = spg[stX][stY];
			if (lC != "x" && lC != "o") {
			// только для пустых клеток
			spg[stX][stY] = "x";
			if (this.checkPlace() == "x") {
				// пробуем победить
				tx = stX;
				ty = stY;
				tp = 3;
			} else if (tp < 3) {
				spg[stX][stY] = "o";
				if (this.checkPlace() == "o") {
				// или помешать победить игроку.
				tx = stX;
				ty = stY;
				tp = 2;
				} else if (tp < 2) {
				// или...
				let mini = -1,
					maxi = 1,
					minj = -1,
					maxj = 1;
				if (stX >= spg.length - 1) maxi = 0;
				if (stY >= spg[0].length - 1) maxj = 0;
				if (stX < 1) mini = 0;
				if (stY < 1) minj = 0; // найти ближайший нолик...
				for (let i = mini; i <= maxi; i++)
					for (let j = minj; j <= maxj; j++)
					if (i != 0 && j != 0) {
						// если есть рядом своя занятая клетка - поближе к своим
						if (spg[stX + i][stY + j] == "o") {
						tx = stX;
						ty = stY;
						tp = 1;
						}
					}
				if (tp < 1) {
					// или хотя бы на свободную клетку поставить.
					tx = stX;
					ty = stY;
				}
				}
			}
			spg[stX][stY] = lC;
			}
		}
		if (tx != null && ty != null) {
		// если целевая клетка выбранна
		this.setCell(tx, ty, "o"); // поставим нолик в клетку.
		}
	}

	checkPlace() { 
		// Проверка победы.
		const spg = this.state.placeGame;
		let pS = this.state.dafaultSettings.sizePlace > 4 ? 5 : 3;
		for (let stX = 0; stX <= spg.length - pS; stX++)
		for (let stY = 0; stY <= spg[0].length - pS; stY++) {
			// Если размер поля больше трёх.
			let lC = spg[stX][stY]; // проверка линии
			if (lC != null)
			for (let i = 0; i < pS; i++)
				if (spg[i + stX][i + stY] != lC) lC = null; // если проверяемая клетка не содержит lC, то сбросить значение lC
			if (lC != null) return lC; // если победа обнаружена.
			lC = spg[(pS - 1) + stX][stY];
			if (lC != null)
			for (let i = 0; i < pS; i++)
				if (spg[(pS - 1) - i + stX][i + stY] != lC) lC = null;
			if (lC != null) return lC;

			for (let i = 0; i < pS; i++) {
			// проверка по горизонтали
			lC = spg[stX + i][stY];
			if (lC != null)
				for (let j = 0; j < pS; j++)
				if (spg[i + stX][j + stY] != lC) lC = null;
			if (lC != null) return lC;
			}
			for (let j = 0; j < pS; j++) {
			// проверка по вертикали
			lC = spg[stX][stY + j];
			if (lC != null)
				for (let i = 0; i < pS; i++)
				if (spg[i + stX][j + stY] != lC) lC = null;
			if (lC != null) return lC;
			}
		}
		return this.checkFullPlace() ? false : true; // если никто не победил
	}

	checkFullPlace() {
		for(let i = 0; i < this.state.placeGame.length; i++){
			if (this.state.placeGame[i].includes(null)) {
				return true;
			}
		}  
		return false;
	}

	eventCeil(e) {
		const el = e.target;
		const x = +el.dataset.row;
		const y = +el.dataset.ceil;
		const ceil = this.state.placeGame[x][y];
		if (!ceil && !this.state.endGame) {
			if (this.state.currentPlayer) {
				this.setCell(x, y, "x", el);
				//this.clearTimer();
				if (this.state.dafaultSettings.players === 1 && !this.state.endGame) {
				this.botGame();
				}
			} else {
				this.setCell(x, y, "o", el);
			}
		}
		if(!this.state.endGame && this.state.dafaultSettings.players === 1){
			localStorage.setItem('current_game', JSON.stringify(this.state.placeGame))
		}
	}

	setCell(x, y, t, el = null) {
		// Поставить крестик или нолик
		if (!el) el = document.querySelector(`[data-row="${x}"][data-ceil="${y}"]`);
		this.state.placeGame[x][y] = t; // Запомнить t в массиве
		el.textContent = t; // подставляем знак
		this.state.gameStep.push([t, x, y])
		this.stepGame()
		this.state.currentPlayer = !this.state.currentPlayer;
		const checkGame = this.checkPlace();
		this.clearTimer();
		if (checkGame) {
			this.endGame(checkGame, x, y);
		}else{
		//if (!this.state.endGame) {
			this.createTimer();
			if(this.state.isPaused){
				this.pauseGame(document.querySelector('#pausegame'))
			}
		}
	}

	stepGame(){
		const stepArea = document.querySelector('#step_game');
		stepArea.innerHTML = '';
		this.state.gameStep.forEach((step, index) => {
			const msg = document.createElement('div');
			msg.classList.add("alert", "alert-light", "mt-2");
			msg.innerHTML = `Step ${index + 1}: Simbol - ${step[0]}, Coordinates: x: ${step[2] + 1}, y: ${step[1] + 1}`;
			stepArea.append(msg);
		})
	}

	endGame(checkGame, x, y) {
		const btnEnd = document.querySelector("#exitgame");
		const btnPause = document.querySelector("#pausegame");
		const btnRefrash = document.querySelector("#refreshgame");
		const ceilEndGame = document.querySelector(`[data-row="${x}"][data-ceil="${y}"]`)
		btnEnd.remove();
		btnPause.remove();
		btnRefrash.classList.toggle("visually-hidden", "");

		this.createBtns(
			"exitgame",
			"exitGame",
			["btn", "btn-danger", "me-2", "mt-2"],
			this.exitGame,
			this.settingPlace
		);
		localStorage.removeItem('current_game');
	
		this.state.endGame = true;
		this.state.gameStep = [];

		let strWin = '';
		switch (checkGame) {
		case "x":
			if(this.state.dafaultSettings.players === 1){
				strWin = "You WIN!!!";
			}
			else strWin = "Player 1, WIN!";
			ceilEndGame.classList.add('bg-success', 'text-white');
			this.setHistory("WIN");
		break;
		case "o":
			if (this.state.dafaultSettings.players === 1) {
				strWin = "You LOSE!!!";
			} else strWin = "Player 2, WIN!";
			ceilEndGame.classList.add('bg-danger', 'text-white');
			this.setHistory("LOSE");
		break;
		default:
			strWin = "DRAW!!!";
			this.setHistory("DRAW");
		break;
		}
		this.msgBlock.innerHTML = `<div class="alert alert-info mt-2">${strWin}</div>`;
	}

	setHistory(info){
		const history = JSON.parse(localStorage.getItem('history_game'));
		const Data = new Date();
		const Year = Data.getFullYear();
		const Month = Data.getMonth();
		const Day = Data.getDate();
		const Hour = Data.getHours();
		const Minutes = Data.getMinutes();
		const Seconds = Data.getSeconds();
		const curDataFormat = `${Day}/${Month}/${Year} ${Hour}:${Minutes}:${Seconds}`;

		const infoHistory = {
			data: curDataFormat,
			info,
			players:this.state.dafaultSettings.players
		}
		
		if(history){
			history.push(infoHistory);
			localStorage.setItem('history_game', JSON.stringify(history));
		}else{
			localStorage.setItem('history_game', JSON.stringify([infoHistory]))
		}
	}

	exitGame() {
		location.reload();
	}

	pauseGame(btn) {
		if (!this.state.isPaused) {
			btn.classList.remove("btn-info");
			btn.classList.add("btn-warning");
			btn.textContent = "Continue";
		} else {
			btn.classList.remove("btn-warning");
			btn.classList.add("btn-info");
			btn.textContent = "Pause";
		}

		this.state.isPaused = !this.state.isPaused;
	}
}

