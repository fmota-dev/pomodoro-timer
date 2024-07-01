let timer
let emExecucao = false
let modoAtual = 'Pomodoro'
let tempoRestante = 1500 // 25 minutos em segundos para Pomodoro
const tempos = {
	Pomodoro: 5, // 25 minutos em segundos para Pomodoro
	'Pausa Curta': 5, // 10 minutos em segundos para Pausa Curta
	'Pausa Longa': 5, // 20 minutos em segundos para Pausa Longa
}
let btnIniciarPausar = document.getElementById('btn-iniciar-pauser')
let btnReiniciar = document.getElementById('btn-reiniciar')
let displayTempo = document.getElementById('tempo')
let historicoPausas = document.getElementById('historico-pausas')
let btnResetar = document.getElementById('btn-resetar')
let horarioInicio

// Som para o timer
const beep = new Audio('./assets/audio/alarm.mp3') // Substitua 'beep.mp3' pelo caminho do seu arquivo de som

// Função para formatar a hora
function formatarHora(data) {
	let horas = data.getHours().toString().padStart(2, '0')
	let minutos = data.getMinutes().toString().padStart(2, '0')
	return `${horas}:${minutos}`
}

// Função para atualizar o display do tempo
function atualizarDisplay() {
	let minutos = Math.floor(tempoRestante / 60)
	let segundos = tempoRestante % 60
	displayTempo.textContent = `${minutos.toString().padStart(2, '0')}:${segundos
		.toString()
		.padStart(2, '0')}`
}

// Função para iniciar ou pausar o timer
function iniciarTimer() {
	if (!emExecucao) {
		emExecucao = true
		btnIniciarPausar.textContent = 'PAUSAR'
		horarioInicio = new Date()
		timer = setInterval(() => {
			if (tempoRestante > 0) {
				tempoRestante--
				atualizarDisplay()
			} else {
				clearInterval(timer)
				emExecucao = false
				btnIniciarPausar.textContent = 'INICIAR'
				registrarPausa()
				beep.play() // Reproduz o som ao terminar o timer
			}
		}, 1000)
	} else {
		emExecucao = false
		clearInterval(timer)
		btnIniciarPausar.textContent = 'INICIAR'
	}
}

// Função para reiniciar o timer
function reiniciarTimer() {
	clearInterval(timer)
	emExecucao = false
	tempoRestante = tempos[modoAtual]
	atualizarDisplay()
	btnIniciarPausar.textContent = 'INICIAR'
}

// Função para abrir uma aba (modo)
function abrirAba(modo) {
	modoAtual = modo
	reiniciarTimer()
	document.querySelectorAll('.tab-link').forEach((btn) => {
		btn.classList.remove('active')
	})
	document
		.querySelector(`button[onclick="abrirAba('${modo}')"]`)
		.classList.add('active')

	// Atualiza a classe do body para mudar a cor de fundo conforme o modo
	document.body.className = ''
	document.body.classList.add(modo.toLowerCase().replace(' ', '-')) // Substitui espaço por hífen
}

// Função para registrar uma pausa no histórico
function registrarPausa() {
	let horarioFim = new Date()
	let li = document.createElement('li')
	let icone = ''

	if (modoAtual === 'Pomodoro') {
		icone = '<span>🚀</span>' // Ícone para Pomodoro
	} else if (modoAtual === 'Pausa Curta') {
		icone = '<span>🍵</span>' // Ícone para Pausa Curta
	} else if (modoAtual === 'Pausa Longa') {
		icone = '<span>🛏️</span>' // Ícone para Pausa Longa
	}

	li.innerHTML = `${icone} ${modoAtual} iniciou às ${formatarHora(
		horarioInicio
	)} e terminou às ${formatarHora(horarioFim)}`
	historicoPausas.insertBefore(li, historicoPausas.firstChild)

	// Remove a classe de destaque da pausa anterior
	let pausas = historicoPausas.getElementsByTagName('li')
	if (pausas.length > 1) {
		pausas[1].classList.remove('pausa-recente')
	}

	// Mostra o botão de resetar histórico
	btnResetar.classList.remove('hidden')

	// Salva o histórico no localStorage
	salvarHistoricoPausas()
}

// Função para salvar o histórico de pausas no localStorage
function salvarHistoricoPausas() {
	localStorage.setItem('historicoPausas', historicoPausas.innerHTML)
}

// Função para carregar o histórico de pausas do localStorage
function carregarHistoricoPausas() {
	let historicoSalvo = localStorage.getItem('historicoPausas')
	if (historicoSalvo) {
		historicoPausas.innerHTML = historicoSalvo
		btnResetar.classList.remove('hidden') // Mostra o botão se houver histórico salvo
	}
}

// Função para resetar o histórico de pausas
function resetarHistorico() {
	historicoPausas.innerHTML = '' // Limpa o histórico na página
	localStorage.removeItem('historicoPausas') // Remove do localStorage
	btnResetar.classList.add('hidden') // Esconde o botão de resetar
}

// Adiciona event listeners aos botões
btnIniciarPausar.addEventListener('click', iniciarTimer)
btnReiniciar.addEventListener('click', reiniciarTimer)

// Inicializa o display de tempo e a aba inicial ao carregar a página
atualizarDisplay()
abrirAba('Pomodoro') // Define a aba inicial

// Carrega o histórico de pausas ao iniciar a página
carregarHistoricoPausas()
