/**
 * ! IndexError — TupãStudios
 * script.js — Paradox Chatbot V10.0 (Assistant Default & Disclaimer Edition)
 */

/* =========================================================
   1. UI BÁSICA (Navbar e Footer)
   ========================================================= */
document.getElementById('footer-year').textContent = new Date().getFullYear();

const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* =========================================================
   2. ESTADO E DICIONÁRIOS
   ========================================================= */
const state = {
  mode: 'assistant', // AGORA O PADRÃO É ASSISTENTE
  
  // Controle do Tutorial
  inTutorial: false,
  tutorialStep: 0,
  
  // Controle do Desafio (Minigame)
  challengeSetup: false,
  challengeActive: false,
  challengeCommand: null,
  challengeAnswer: null,
  challengeStart: null,
  challengeTotal: 0,
  challengeCurrent: 0,
  challengeCombo: 0
};

// Filtro e Dicionários Expandidos
const blacklist = ['idiota', 'lixo', 'burro', 'merda', 'porra', 'caralho', 'fdp', 'puta', 'otario', 'vsf', 'tnc', 'racismo', 'xenofobia', 'machismo'];
const dictGreetings = ['oi', 'olá', 'ola', 'eai', 'salve', 'bom dia', 'boa tarde', 'boa noite', 'fala', 'opa', 'eae', 'hello', 'tudo bem', 'estou com duvidas', 'dúvida', 'duvida'];
const dictFarewells = ['sair', 'exit', 'quit', 'esc', 'tchau', 'até logo', 'ate logo', 'até mais', 'ate mais', 'adios', 'arrivederci', 'arriverderci', 'auf wiedersehen'];
const dictThanks = ['obrigado', 'obg', 'valeu', 'vlw', 'thanks', 'grato', 'tmj', 'brabo'];
const dictHelp = ['ajuda', 'help', 'comandos', 'menu', 'o que fazer', 'sos', 'regras'];
const dictJokes = ['piada', 'conta uma piada', 'me faça rir', 'engraçado'];
const dictCredits = ['creditos', 'equipe', 'criadores', 'integrantes', 'kaique', 'igor', 'kaique dias', 'kaique oliveira', 'igor navarro'];

const TODOS = ['cima', 'baixo', 'esquerda', 'direita'];
const REPRESENTACOES = {
  "NOT": ["NOT", "!", "¬", "~", "NÃO"],
  "OR": ["OR", "V", "||", "+", "OU"],
  "AND": ["AND", "^", "&&", "*", "E"]
};

/* ---- DOM Refs ---- */
const termBody  = document.getElementById('terminal-body');
const termInput = document.getElementById('terminal-input');
const modeBtn   = document.getElementById('mode-toggle');

// NOVAS REFERÊNCIAS DO WIDGET FLUTUANTE
const chatWindow = document.getElementById('chat-window');
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatCloseBtn = document.getElementById('chat-close-btn');
const chatExpandBtn = document.getElementById('chat-expand-btn');

/* ---- Lógica da Janela Flutuante ---- */
if (chatToggleBtn && chatWindow) {
  // Abrir / Fechar no botão principal
  chatToggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      termInput.focus();
      termBody.scrollTop = termBody.scrollHeight;
    }
  });
  
  // Fechar no botão vermelho (estilo macOS)
  chatCloseBtn.addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });

  // Expandir / Minimizar no botão amarelo
  chatExpandBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('expanded');
    termInput.focus();
    setTimeout(() => { termBody.scrollTop = termBody.scrollHeight; }, 300);
  });
}

/* =========================================================
   3. FUNÇÕES BÁSICAS DO TERMINAL
   ========================================================= */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function addMessage(type, prefix, text, delay = 0) {
  await sleep(delay);
  const el = document.createElement('div');
  el.className = `term-msg ${type}`;
  const pre  = document.createElement('span');
  pre.className = 'prefix';
  pre.textContent = prefix;
  const txt = document.createElement('span');
  txt.textContent = text;
  el.appendChild(pre);
  el.appendChild(txt);
  termBody.appendChild(el);
  termBody.scrollTop = termBody.scrollHeight;
}

// Botão de Troca de Modo (ATUALIZADO PARA EXIBIR O AVISO)
if (modeBtn) {
  modeBtn.addEventListener('click', async () => {
    if (state.mode === 'assistant') {
      // Muda para Sarcástico
      state.mode = 'sarcastic';
      modeBtn.textContent = 'SARCÁSTICO';
      modeBtn.classList.replace('assistant', 'sarcastic');
      await addMessage('sys', 'SISTEMA >', 'Filtros de empatia desligados. Sarcasmo ativado. Boa sorte.');
      // O AVISO PARA LEIGOS AQUI
      await addMessage('sys', 'AVISO >', 'Esse bot foi feito com intenções humoristas, não leve a sério.');
    } else {
      // Muda para Assistente
      state.mode = 'assistant';
      modeBtn.textContent = 'ASSISTENTE';
      modeBtn.classList.replace('sarcastic', 'assistant');
      await addMessage('sys', 'SISTEMA >', 'Protocolo Assistente ativado. Módulos de empatia ligados a 100%.');
    }
  });
}

function showTyping() {
  const el = document.createElement('div');
  el.className = 'term-msg bot';
  el.id = 'typing-indicator';
  const pre = document.createElement('span');
  pre.className = 'prefix';
  pre.textContent = 'PARADOX >';
  const txt = document.createElement('span');
  txt.className = 'blink';
  txt.textContent = ' ▋';
  el.appendChild(pre);
  el.appendChild(txt);
  termBody.appendChild(el);
  termBody.scrollTop = termBody.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function randFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* =========================================================
   4. LÓGICA DO GERADOR DE DESAFIOS (MINIGAME)
   ========================================================= */
function getSimbolo(cat) {
  return REPRESENTACOES[cat][Math.floor(Math.random() * REPRESENTACOES[cat].length)];
}

function getUniqueDirections(count) {
  let shuffled = [...TODOS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function sortearDesafio(nivel) {
  const s_not = getSimbolo("NOT");
  const s_or = getSimbolo("OR");
  const s_and = getSimbolo("AND");
  const [d1, d2, d3] = getUniqueDirections(3);

  let pergunta = "";
  let resposta = [];

  if (nivel === 1) {
    pergunta = `${s_not} ${d1.toUpperCase()}`;
    resposta = TODOS.filter(d => d !== d1);
  } else if (nivel === 2) {
    pergunta = `${d1.toUpperCase()} ${s_or} ${d2.toUpperCase()}`;
    resposta = [d1, d2];
  } else if (nivel === 3) {
    pergunta = `${s_not}(${d1.toUpperCase()} ${s_or} ${d2.toUpperCase()})`;
    resposta = TODOS.filter(d => d !== d1 && d !== d2);
  } else if (nivel === 4) {
    pergunta = `${d1.toUpperCase()} ${s_and} ${s_not} ${d2.toUpperCase()}`;
    resposta = [d1]; 
  } else if (nivel === 5) {
    pergunta = `${s_not}(${d1.toUpperCase()} ${s_or} ${d2.toUpperCase()}) ${s_and} ${s_not} ${d3.toUpperCase()}`;
    resposta = TODOS.filter(d => d !== d1 && d !== d2 && d !== d3);
  }

  if (resposta.length === 0) return sortearDesafio(nivel);
  return { text: pergunta, answer: resposta };
}

async function nextChallenge() {
  if (state.challengeCurrent > state.challengeTotal) {
    state.challengeActive = false;
    await addMessage('sys', 'SISTEMA >', 'Desafio concluído com sucesso.', 400);
    await addMessage('ok', 'PARADOX >', state.mode === 'assistant'
      ? `Parabéns! Você sobreviveu a todas as ${state.challengeTotal} rodadas!`
      : `Sobreviveu as ${state.challengeTotal} rodadas. Devo admitir... você não é tão inútil assim.`);
    return;
  }

  const nivelAtual = Math.min(Math.floor(state.challengeCombo / 5) + 1, 5);
  const { text, answer } = sortearDesafio(nivelAtual);
  
  state.challengeActive = true;
  state.challengeCommand = text;
  state.challengeAnswer = answer;
  
  await sleep(600);
  await addMessage('sys', `RODADA ${state.challengeCurrent}/${state.challengeTotal} (NÍVEL ${nivelAtual}) >`, 'Valendo...');
  await addMessage('ok', 'DESAFIO >', text);
  state.challengeStart = Date.now();
}

/* =========================================================
   5. TUTORIAL INTERATIVO MASTERCLASS
   ========================================================= */
async function processTutorialStep(input) {
  showTyping(); await sleep(800); hideTyping();

  // PASSO 1: O Básico
  if (state.tutorialStep === 1) {
    if (input === 'cima') {
      state.tutorialStep = 2;
      await addMessage('ok', 'PARADOX >', state.mode === 'assistant' 
        ? 'Perfeito! É exatamente assim. Agora vamos à lógica real.' 
        : 'Ótimo, você sabe o básico do básico. Vamos complicar.');
      await sleep(1000);
      await addMessage('sys', 'PASSO 2 >', 'A Negação (NOT). Representada na programação por !, ¬, ~ ou NOT.');
      await addMessage('bot', 'PARADOX >', 'A negação inverte a verdade. Se o comando tem um "!", aquela direção se torna veneno.');
      await sleep(1500);
      await addMessage('bot', 'PARADOX >', 'Teste 2: Se o terminal mostrar "! ESQUERDA", me dê UMA direção válida para sobreviver:');
    } else {
      await addMessage('err', 'PARADOX >', state.mode === 'assistant'
        ? 'Ops! A resposta era apenas "cima". Tente de novo.'
        : 'Sério? Você errou a direção "CIMA"? Digita "cima", por favor.');
    }
  }
  // PASSO 2: A Negação
  else if (state.tutorialStep === 2) {
    if (input.includes('cima') || input.includes('baixo') || input.includes('direita')) {
      state.tutorialStep = 3;
      await addMessage('ok', 'PARADOX >', state.mode === 'assistant' 
        ? `Excelente! "${input}" salva você, pois não é ESQUERDA.` 
        : `Aceitável. Você entende o conceito de "não".`);
      await sleep(1000);
      await addMessage('sys', 'PASSO 3 >', 'A Disjunção (OR). Representada por ||, V, +, ou OU.');
      await addMessage('bot', 'PARADOX >', 'Isso cria bifurcações. Basta que UMA das opções seja escolhida para você acertar.');
      await sleep(1500);
      await addMessage('bot', 'PARADOX >', 'Teste 3: O comando é "CIMA || BAIXO". Para onde você vai? (Escolha apenas um)');
    } else {
      await addMessage('err', 'PARADOX >', state.mode === 'assistant'
        ? 'Atenção! Você não pode ir para a esquerda se houver um "!". Tente direita, cima ou baixo.'
        : 'Seu compilador mental falhou? "NÃO ESQUERDA" significa qualquer coisa, menos esquerda. Tente de novo.');
    }
  }
  // PASSO 3: A Disjunção (OR)
  else if (state.tutorialStep === 3) {
    if (input.includes('cima') || input.includes('baixo')) {
      state.tutorialStep = 4;
      await addMessage('ok', 'PARADOX >', state.mode === 'assistant'
        ? `Perfeito! O "||" te dá liberdade de escolha.`
        : `É, "${input}" serve. Vejo que processadores lentos também chegam no resultado.`);
      await sleep(1000);
      await addMessage('sys', 'PASSO 4 >', 'A Conjunção (AND). Representada por &&, ^, *, ou E.');
      await addMessage('bot', 'PARADOX >', 'Aqui o cerco fecha. Um filtro rigoroso onde DUAS condições DEVEM ser respeitadas simultaneamente.');
      await sleep(1500);
      await addMessage('bot', 'PARADOX >', 'Teste 4: A expressão é "DIREITA && ! CIMA". Qual é a ÚNICA direção que atende a tudo isso?');
    } else {
      await addMessage('err', 'PARADOX >', state.mode === 'assistant'
        ? 'Incorreto. Você precisava escolher entre "cima" ou "baixo".'
        : 'Erro de sintaxe orgânica. O comando deu duas opções fáceis. Escolha "cima" ou "baixo".');
    }
  }
  // PASSO 4: A Conjunção (AND)
  else if (state.tutorialStep === 4) {
    if (input === 'direita') {
      state.tutorialStep = 5;
      await addMessage('ok', 'PARADOX >', state.mode === 'assistant'
        ? 'Brilhante! "Direita" é ao mesmo tempo Direita E Não-Cima.'
        : 'Milagre. Você conseguiu processar duas variáveis ao mesmo tempo. Vamos para o terror final.');
      await sleep(1500);
      await addMessage('sys', 'PASSO 5 >', 'Parênteses e a Negação de Grupo. Ex: !(A || B)');
      await addMessage('bot', 'PARADOX >', 'Como na matemática, resolvemos os parênteses primeiro. Se o "!" estiver fora, ele nega o grupo inteiro.');
      await sleep(2000);
      await addMessage('bot', 'PARADOX >', 'Teste Final: A expressão é "!(ESQUERDA || DIREITA)". Eu neguei o eixo horizontal inteiro. Qual direção sobra?');
    } else {
      await addMessage('err', 'PARADOX >', state.mode === 'assistant'
        ? 'Quase! A direção precisava ser Direita e não podia ser Cima. A resposta é direita.'
        : 'Reprovado em Lógica 101. A resposta óbvia é "direita". Digite isso e vamos seguir.');
    }
  }
  // PASSO 5: Parênteses (Nível Final)
  else if (state.tutorialStep === 5) {
    if (input.includes('cima') || input.includes('baixo')) {
      state.tutorialStep = 0; 
      state.inTutorial = false;
      await addMessage('ok', 'PARADOX >', state.mode === 'assistant'
        ? 'Mestre da Lógica! Você anulou a Esquerda e a Direita, sobrando apenas Cima ou Baixo. Parabéns!'
        : 'Finalmente. Você concluiu a Masterclass. Mas o Nível 5 do jogo vai misturar TUDO isso com um cronômetro na sua cabeça.');
      await sleep(1500);
      await addMessage('sys', 'SISTEMA >', 'Tutorial Concluído com Sucesso. Digite "desafio" para iniciar o minigame real.');
    } else {
      await addMessage('err', 'PARADOX >', state.mode === 'assistant'
        ? 'Não exatamente. Se eu neguei Esquerda e Direita, só sobram Cima e Baixo. Tente uma dessas!'
        : 'Pane no sistema. Se eu proibi os lados, o que sobra? Escolha Cima ou Baixo, rápido.');
    }
  }
}

/* =========================================================
   6. CÉREBRO DE PROCESSAMENTO CENTRAL
   ========================================================= */
async function boot() {
  // Ajusta o botão no front-end para refletir que o modo padrão agora é Assistente
  if (modeBtn) {
    modeBtn.textContent = 'ASSISTENTE';
    modeBtn.classList.remove('sarcastic');
    modeBtn.classList.add('assistant');
  }
  await addMessage('sys', 'SISTEMA >', 'Inicializando Terminal da TupãStudios...', 0);
  // Mensagem de boas-vindas do Assistente
  await addMessage('bot', 'PARADOX >', 'Olá! Bem-vindo ao terminal do ! IndexError. Como posso ajudar? Digite "tutorial" para as regras ou "desafio" para jogar.', 800);
}

async function processInput(raw) {
  const input = raw.trim().toLowerCase();
  if (!input) return;

  await addMessage('user', 'VOCÊ    >', raw);

  // Filtro de Segurança
  if (blacklist.some(word => input.includes(word))) {
    showTyping(); await sleep(600); hideTyping();
    if (state.mode === 'sarcastic') {
      await addMessage('err', 'PARADOX >', 'Lixo orgânico detectado. Minhas regras de segurança me impedem de fritar seu roteador.');
    } else {
      await addMessage('err', 'PARADOX >', 'Por favor, mantenha o respeito. Não posso processar ou responder a esse tipo de conteúdo.');
    }
    return;
  }

  // Interceptador do Tutorial
  if (state.inTutorial) {
    if (dictFarewells.includes(input) || input === 'cancelar') {
      state.inTutorial = false;
      state.tutorialStep = 0;
      showTyping(); await sleep(500); hideTyping();
      await addMessage('sys', 'SISTEMA >', 'Tutorial cancelado pelo usuário.');
      return;
    }
    await processTutorialStep(input);
    return;
  }

  // Setup do Minigame
  if (state.challengeSetup) {
    if (dictFarewells.includes(input) || input === 'cancelar') {
      state.challengeSetup = false;
      showTyping(); await sleep(400); hideTyping();
      await addMessage('sys', 'SISTEMA >', 'Setup de desafio cancelado.');
      return;
    }
    const num = parseInt(input);
    if (isNaN(num) || num <= 0 || num > 100) {
      showTyping(); await sleep(400); hideTyping();
      await addMessage('err', 'PARADOX >', 'Número inválido. Digite um valor entre 1 e 100 (ou "sair" para cancelar).');
      return;
    }
    state.challengeSetup = false;
    state.challengeTotal = num;
    state.challengeCurrent = 1;
    state.challengeCombo = 0;
    
    showTyping(); await sleep(500); hideTyping();
    await addMessage('sys', 'SISTEMA >', `Sequência de ${num} desafios iniciada. Errar resulta em Game Over imediato.`);
    await nextChallenge();
    return;
  }

  // Minigame Ativo
  if (state.challengeActive) {
    const isDirection = TODOS.includes(input);
    showTyping(); await sleep(300); hideTyping();

    if (!isDirection) {
      if (dictFarewells.includes(input)) {
        state.challengeActive = false;
        await addMessage('sys', 'SISTEMA >', 'Desafio abortado.');
      } else {
        await addMessage('err', 'PARADOX >', 'Comando inválido. Responda com: cima, baixo, esquerda ou direita.');
      }
      return; 
    }

    const elapsed = ((Date.now() - state.challengeStart) / 1000).toFixed(1);

    if (state.challengeAnswer.includes(input)) {
      state.challengeCombo++;
      state.challengeCurrent++;
      await addMessage('ok', 'PARADOX >', `Correto! (${elapsed}s)`);
      await nextChallenge();
    } else {
      state.challengeActive = false;
      const certas = state.challengeAnswer.map(d => d.toUpperCase()).join(' ou ');
      
      if (state.mode === 'sarcastic') {
        await addMessage('err', 'PARADOX >', `ERRO FATAL! O certo era ${certas}. Seu cérebro falhou na rodada ${state.challengeCurrent}. Game Over.`);
      } else {
        await addMessage('err', 'PARADOX >', `Ops! Resposta errada. As opções válidas eram: ${certas}. Fim de jogo na rodada ${state.challengeCurrent}.`);
      }
    }
    return;
  }

  showTyping(); await sleep(400); hideTyping();

  // Comandos Normais e Dicionário
  if (dictHelp.includes(input)) {
    await addMessage('sys', 'SISTEMA >', '── COMANDOS DISPONÍVEIS ──────────────');
    await addMessage('sys', 'SISTEMA >', '"tutorial" → Masterclass interativa de lógica (!, ||, &&)');
    await addMessage('sys', 'SISTEMA >', '"desafio"  → Entra no minigame');
    await addMessage('sys', 'SISTEMA >', '"creditos" → Ver os criadores do jogo');
    await addMessage('sys', 'SISTEMA >', '"aviso"    → Disclaimer sobre o bot');
    await addMessage('sys', 'SISTEMA >', '"limpar"   → Limpa a tela');
    await addMessage('sys', 'SISTEMA >', '─────────────────────────────────────');

  } else if (input === 'desafio' || input === 'jogar') {
    state.challengeSetup = true;
    if (state.mode === 'sarcastic') {
      await addMessage('bot', 'PARADOX >', 'Quer testar a sorte? Diga quantas rodadas você acha que aguenta antes de chorar (Ex: 5, 10, 20):');
    } else {
      await addMessage('bot', 'PARADOX >', 'Excelente! Quantas rodadas de desafio você quer jogar? (Digite um número)');
    }

  } else if (input === 'tutorial') {
    state.inTutorial = true;
    state.tutorialStep = 1;
    if (state.mode === 'sarcastic') {
      await addMessage('bot', 'PARADOX >', 'Sentem-se, classe. O professor Paradox vai desenhar a lógica booleana na sua testa.');
    } else {
      await addMessage('bot', 'PARADOX >', 'Bem-vindo à Masterclass! Vamos entender como o computador lê essas expressões.');
    }
    await sleep(1500);
    await addMessage('sys', 'PASSO 1 >', 'O Básico. O jogo possui 4 direções cardeais: CIMA, BAIXO, ESQUERDA, DIREITA.');
    await addMessage('bot', 'PARADOX >', 'Teste 1: Se não houver nenhum símbolo estranho e a tela disser "CIMA", para onde você vai?');

  } else if (input === 'aviso' || input === 'disclaimer') {
    await addMessage('sys', 'SISTEMA >', 'Aviso para leigos: Esse bot foi feito com intenções humoristas, não leve a sério.');

  } else if (dictCredits.includes(input)) {
    await addMessage('bot', 'PARADOX >', 'A lendária equipe da TupãStudios por trás do ! IndexError: Kaique Dias, Kaique Oliveira e Igor Navarro.');
    if (state.mode === 'sarcastic') {
      await addMessage('bot', 'PARADOX >', 'Ou seja, dois Kaiques para codar e o Igor pra furar o bolo.');
    }

  } else if (dictGreetings.includes(input)) {
    await addMessage('bot', 'PARADOX >', state.mode === 'assistant' 
      ? 'Olá! Como posso ajudá-lo? Você pode alternar entre os modos Assistente e Sarcástico no botão acima. Digite "ajuda" para ver os comandos.' 
      : 'Como posso ajuda-lo? Você pode ativar os modos Padrão (Assistente) ou Sarcástico. Mas recomendo ir logo pro "desafio".');

  } else if (dictFarewells.includes(input)) {
    if (state.mode === 'sarcastic') {
      await addMessage('bot', 'PARADOX >', 'Arrivederci! Desligando matriz... Não diga que não avisei quando o Game Over chegar.');
    } else {
      await addMessage('bot', 'PARADOX >', 'Até logo! Terminal encerrado. Obrigado por jogar e boa sorte no ! IndexError!');
    }
    termInput.disabled = true;

  } else if (dictThanks.includes(input)) {
    await addMessage('bot', 'PARADOX >', state.mode === 'assistant' ? 'Por nada! Estou aqui para ajudar.' : 'Guarde seus agradecimentos para quando zerar o jogo.');

  } else if (dictJokes.includes(input)) {
    await addMessage('bot', 'PARADOX >', 'Por que o programador faliu? Porque ele usou todo o seu cache.');

  } else if (input === 'clear' || input === 'limpar') {
    termBody.innerHTML = '';
    await addMessage('sys', 'SISTEMA >', 'Memória limpa.');

  // =========================================================
  // --- EASTER EGGS DA LORE DA TUPÃSTUDIOS ---
  // =========================================================
  } else if (input === 'tupa' || input === 'tupã' || input === 'tupãstudios') {
    await addMessage('sys', 'SISTEMA >', 'Acesso restrito detectado.');
    await addMessage('bot', 'PARADOX >', 'A TupãStudios? Eles são os arquitetos desta simulação. Os deuses do código. E eles adoram ver você errar.');

  } else if (input.includes('igor') || input.includes('furabolo') || input.includes('furlobo')) {
    if (state.mode === 'sarcastic') {
      await addMessage('bot', 'PARADOX >', 'Não me fale do Igor. Tenho certeza que ele passa mais tempo furando bolos do que otimizando meus algoritmos.');
    } else {
      await addMessage('bot', 'PARADOX >', 'Ah, o Igor! Nosso desenvolvedor igorfurlobo... ou seria igorfurabolo? A lenda diz que ele esconde bolos na arquitetura da TupãStudios.');
    }

  } else if (input.includes('unicornio') || input.includes('unicórnio') || input.includes('sala de servidores')) {
    if (state.mode === 'sarcastic') {
      await addMessage('bot', 'PARADOX >', 'Ah, o unicórnio na sala de servidores. Você acha que é zoeira? É ele que compila o código quando o Igor tá comendo bolo.');
    } else {
      await addMessage('bot', 'PARADOX >', 'Você descobriu nosso segredo! Temos um unicórnio mágico guardando a sala de servidores da TupãStudios. Ele mantém tudo funcionando.');
    }

  } else if (input.includes('francesco') || input.includes('virgolini') || input.includes('mamma mia') || input.includes('marcello')) {
    await addMessage('sys', 'SISTEMA >', 'Aviso: Sobrecarga de sotaque italiano detectada nas variáveis.');
    await addMessage('bot', 'PARADOX >', 'FRANCESCOOOOO VIRGOLINIIIIII! FIIIIIIIIUM! 🏎️💨');

  } else if (input === 'sudo' || input.startsWith('sudo ')) {
    await addMessage('err', 'root >', `${raw}: user is not in the sudoers file. This incident will be reported.`);
    await addMessage('bot', 'PARADOX >', 'Injetando comandos Linux no meu terminal web? Bela tentativa, hacker de HTML.');

  } else if (input === 'matrix') {
    await addMessage('bot', 'PARADOX >', 'Você quer a pílula azul ou a vermelha? Se escolher a vermelha, o Nível 5 do ! IndexError te espera.');

  } else if (input === '42') {
    await addMessage('bot', 'PARADOX >', 'A resposta para a vida, o universo e tudo mais. Pena que não te ajuda no próximo desafio lógico.');
    
  } else if (input === 'cima cima baixo baixo esquerda direita esquerda direita b a' || input === 'konami code') {
    await addMessage('ok', 'PARADOX >', 'Cheat ativado: Vidas infinitas. Mentira, você continua tendo só 1. Vai jogar.');

  } else if (input === 'quem é você' || input === 'quem te criou' || input === 'quem e voce') {
    await addMessage('bot', 'PARADOX >', 'Sou Paradox, a inteligência (às vezes sádica) que gerencia o ! IndexError. Fui forjado pela TupãStudios.');

  // =========================================================
  // --- FIM DOS EASTER EGGS ---
  // =========================================================

  } else {
    // Respostas Vexatórias caso o comando não exista
    if (state.mode === 'sarcastic') {
      const xingamentos = [
        `Erro 404: Comando "${raw}" não encontrado. Sai dai cabeçudo!`,
        `"${raw}"? Te manca malandrão. Digita "ajuda" logo.`,
        `Não entendi "${raw}". Vai perguntar pra tua vó!`,
        `Comando inválido. Teu pai de calcinha entende mais de terminal que você.`
      ];
      await addMessage('err', 'PARADOX >', randFrom(xingamentos));
    } else {
      await addMessage('err', 'PARADOX >', `Não entendi o comando "${raw}". Digite "ajuda" para ver as opções válidas.`);
    }
  }
}

/* ---- INPUT HANDLER ---- */
termInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    const val = termInput.value;
    termInput.value = '';
    termInput.disabled = true;
    await processInput(val);
    termInput.disabled = false;
    termInput.focus();
  }
});

termInput.addEventListener('focus', () => {
  setTimeout(() => {
    document.getElementById('terminal').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 300);
});

boot();