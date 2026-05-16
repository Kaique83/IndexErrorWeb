/**
 * ! IndexError — TupãStudios
 * script.js — Paradox Chatbot V12.0 (Expert UX, Clean Code & Deep Tutorial)
 */

/* =========================================================
   1. UI BÁSICA (Navbar, Footer e Efeito Matrix)
   ========================================================= */

const canvas = document.getElementById('binary-cascade');

// Só executa o efeito Matrix se o canvas existir na página atual!
if (canvas) {
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = 800;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const characters = "01";
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = [];

  for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; 
  }

  function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 100, 0, 0.9)"; 
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
          const text = characters.charAt(Math.floor(Math.random() * characters.length));
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
              drops[i] = 0;
          }
          drops[i]++;
      }
  }
  setInterval(draw, 80);
}

// Atualiza o ano no rodapé apenas se o rodapé existir na página
const footerYear = document.getElementById('footer-year');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

// Menu Hamburger com proteção
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* =========================================================
   2. ESTADO E DICIONÁRIOS (ULTRA EXPANDIDOS)
   ========================================================= */
const state = {
  mode: 'assistant',
  inTutorial: false,
  tutorialStep: 0,
  challengeSetup: false,
  challengeActive: false,
  challengeCommand: null,
  challengeAnswer: null,
  challengeStart: null,
  challengeTotal: 0,
  challengeCurrent: 0,
  challengeCombo: 0
};

// Dicionários Massivos (Mais gírias, sinônimos e interações humanas)
const blacklist = ['idiota', 'lixo', 'burro', 'merda', 'porra', 'caralho', 'fdp', 'puta', 'otario', 'vsf', 'tnc', 'racismo', 'xenofobia', 'machismo', 'preto', 'macaco', 'viado', 'bicha', 'vadia', 'corno', 'arrombado', 'imbecil', 'retardado', 'desgraçado', 'sifude', 'vtnc', 'pqp'];
const dictGreetings = ['oi', 'olá', 'ola', 'eai', 'salve', 'bom dia', 'boa tarde', 'boa noite', 'fala', 'opa', 'eae', 'hello', 'tudo bem', 'estou com duvidas', 'dúvida', 'duvida', 'qual é', 'tudo certo', 'koe', 'cheguei', 'alo', 'alô', 'fala tu', 'qual foi', 'como estamos', 'bão', 'bao', 'fala ai'];
const dictFarewells = ['sair', 'exit', 'quit', 'esc', 'tchau', 'até logo', 'ate logo', 'até mais', 'ate mais', 'adios', 'arrivederci', 'arriverderci', 'auf wiedersehen', 'falou', 'flw', 'fui', 'vazando', 'hasta la vista', 'vazei', 'fui nessa', 'encerrar', 'desligar', 'xau', 'chau'];
const dictThanks = ['obrigado', 'obg', 'valeu', 'vlw', 'thanks', 'grato', 'tmj', 'brabo', 'muito obrigado', 'perfeito', 'top', 'agradecido', 'valeu mesmo', 'ajudou muito', 'show', 'legal', 'genial', 'ajudou dms', 'brabissimo', 'mandou bem'];
const dictHelp = ['ajuda', 'help', 'comandos', 'menu', 'o que fazer', 'sos', 'regras', 'como joga', 'instruções', 'manual', 'nao entendi', 'o que é isso', 'start', 'socorro', 'nao sei o que fazer', 'me ajuda', 'dica'];
const dictJokes = ['piada', 'conta uma piada', 'me faça rir', 'engraçado', 'humor', 'conta outra', 'piadinha', 'faz uma piada', 'me diverte', 'meme', 'faz uma graca', 'conta algo engracado'];
const dictCredits = ['creditos', 'equipe', 'criadores', 'integrantes', 'kaique', 'igor', 'kaique dias', 'kaique oliveira', 'igor navarro', 'devs', 'desenvolvedores', 'autores', 'quem fez', 'sobre o jogo', 'quem programou'];
const dictAffirmative = ['sim', 's', 'claro', 'com certeza', 'bora', 'vamos', 'quero', 'yep', 'yes', 'pode pá', 'logico', 'obvio', 'partiu'];
const dictNegative = ['nao', 'não', 'n', 'nem', 'chega', 'parar', 'nunca', 'nope', 'jamais', 'negativo', 'to de boa', 'deixa pra la'];

const TODOS = ['cima', 'baixo', 'esquerda', 'direita'];
const REPRESENTACOES = {
  "NOT": ["NOT", "!", "¬", "~", "NÃO"],
  "OR": ["OR", "V", "||", "+", "OU"],
  "AND": ["AND", "^", "&&", "*", "E"]
};

// Respostas Variáveis (Sorteio) - Agora com mais piadas
const piadasTech = [
  "Por que o programador faliu? Porque ele usou todo o seu cache.",
  "Existem 10 tipos de pessoas no mundo: as que entendem binário e as que não entendem.",
  "O que o C++ disse para o C? 'Você não tem classe.'",
  "Por que o desenvolvedor não gosta de natureza? Porque tem muitos bugs.",
  "Um programador foi ao mercado e a esposa disse: 'Compre leite, se tiver ovos, traga 6'. Ele voltou com 6 caixas de leite.",
  "Qual o animal favorito do programador? A RAM.",
  "O que um terapeuta disse para o banco de dados? 'Você precisa aprender a lidar com seus relacionamentos.'",
  "Um SQL entra em um bar, vai até duas mesas e pergunta: 'Posso me juntar a vocês?' (Can I JOIN you?)"
];

/* ---- DOM Refs ---- */
const termBody  = document.getElementById('terminal-body');
const termInput = document.getElementById('terminal-input');
const modeBtn   = document.getElementById('mode-toggle');
const chatWindow = document.getElementById('chat-window');
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatCloseBtn = document.getElementById('chat-close-btn');
const chatExpandBtn = document.getElementById('chat-expand-btn');

/* ---- Lógica da Janela Flutuante ---- */
if (chatToggleBtn && chatWindow) {
  chatToggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) { 
      termInput.focus(); 
      termBody.scrollTop = termBody.scrollHeight; 
    }
  });

  chatCloseBtn.addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });

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

if (modeBtn) {
  modeBtn.addEventListener('click', async () => {
    if (state.mode === 'assistant') {
      state.mode = 'sarcastic';
      modeBtn.textContent = 'SARCÁSTICO'; 
      modeBtn.classList.replace('assistant', 'sarcastic');
      await addMessage('sys', 'SISTEMA >', 'Filtros de empatia desligados. Sarcasmo ativado. Boa sorte.');
      await addMessage('sys', 'AVISO >', 'Esse bot foi feito com intenções humoristas, não leve a sério.');
    } else {
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
    await addMessage('ok', 'PARADOX >', state.mode === 'assistant' ? `Parabéns! Você sobreviveu a todas as ${state.challengeTotal} rodadas! Seu raciocínio lógico está afiado.` : `Sobreviveu as ${state.challengeTotal} rodadas. Devo admitir... você não é tão inútil assim. Mas não se acostume.`);
    await sleep(800);
    await addMessage('bot', 'PARADOX >', 'O que você quer fazer agora? Digite "desafio" para jogar de novo, "tutorial" para estudar ou "sair".');
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
   5. TUTORIAL INTERATIVO MASTERCLASS (Aprofundado e Descritivo)
   ========================================================= */
async function processTutorialStep(input) {
  showTyping(); 
  await sleep(800); 
  hideTyping();

  if (state.tutorialStep === 1) {
    if (input === 'cima') {
      state.tutorialStep = 2;
      await addMessage('ok', 'PARADOX >', state.mode === 'assistant' ? 'Perfeito! O computador lê exatamente o que está escrito. Agora vamos introduzir a lógica real.' : 'Ótimo, você sabe ler. O básico do básico. Vamos complicar.');
      await sleep(1500); 
      await addMessage('sys', 'PASSO 2 >', 'A Negação (NOT). Representada na programação por !, ¬, ~ ou NOT.');
      await addMessage('bot', 'PARADOX >', 'A negação inverte a verdade. Pense no "!" como uma placa de "PROIBIDO". Se o comando tem um "!", aquela direção se torna um campo minado fatal.');
      await sleep(2000); 
      await addMessage('bot', 'PARADOX >', 'Teste 2: Se o terminal mostrar "! ESQUERDA", o que significa? Significa "Qualquer coisa, menos Esquerda". Me dê UMA direção válida para sobreviver:');
    } else {
      await addMessage('err', 'PARADOX >', state.mode === 'assistant' ? 'Ops! Se eu pedi para ir para CIMA, a resposta é apenas "cima". Tente de novo.' : 'Sério? Você errou a direção "CIMA"? Digita "cima", por favor, antes que eu perca a fé na humanidade.');
    }
  }
  else if (state.tutorialStep === 2) {
    if (input.includes('cima') || input.includes('baixo') || input.includes('direita')) {
      state.tutorialStep = 3;
      await addMessage('ok', 'PARADOX >', state.mode === 'assistant' ? `Excelente raciocínio! "${input}" salva você, pois respeita a regra de NÃO ir para a esquerda.` : `Aceitável. Você entende o conceito de "não". Ponto para você.`);
      await sleep(1500); 
      await addMessage('sys', 'PASSO 3 >', 'A Disjunção (OR). Representada por ||, V, +, ou OU.');
      await addMessage('bot', 'PARADOX >', 'Isso cria caminhos alternativos. Pense no "||" como duas portas abertas. Basta você escolher passar por UMA das portas para o computador aceitar como verdadeiro.');
      await sleep(2000); 
      await addMessage('bot', 'PARADOX >', 'Teste 3: O comando agora é "CIMA || BAIXO". Para onde você vai? (Lembre-se, escolha apenas uma das opções válidas)');
    } else {
      await addMessage('err', 'PARADOX >', state.mode === 'assistant' ? 'Atenção! Você não pode ir para a esquerda se houver um "!". Tente direita, cima ou baixo.' : 'Seu compilador mental falhou? "NÃO ESQUERDA" significa qualquer coisa, menos esquerda. Tente de novo.');
    }
  }
  else if (state.tutorialStep === 3) {
    if (input.includes('cima') || input.includes('baixo')) {
      state.tutorialStep = 4;
      await addMessage('ok', 'PARADOX >', state.mode === 'assistant' ? `Muito bem! O "||" te dá a liberdade de escolher entre as opções. O computador fica feliz com qualquer uma delas.` : `É, "${input}" serve. Vejo que processadores lentos também chegam no resultado eventual.`);
      await sleep(1500); 
      await addMessage('sys', 'PASSO 4 >', 'A Conjunção (AND). Representada por &&, ^, *, ou E.');
      await addMessage('bot', 'PARADOX >', 'Ao contrário das portas abertas do OR, o "&&" é um filtro implacável. É como um cofre com duas fechaduras: você PRECISA atender às DUAS condições ao mesmo tempo para abrir.');
      await sleep(2000); 
      await addMessage('bot', 'PARADOX >', 'Teste 4: A expressão é "DIREITA && ! CIMA". Qual é a ÚNICA direção que é Direita E também Não é Cima?');
    } else {
      await addMessage('err', 'PARADOX >', state.mode === 'assistant' ? 'Incorreto. O "||" pedia para você escolher entre Cima ou Baixo. Tente novamente com uma dessas palavras.' : 'Erro de sintaxe orgânica. O comando deu duas opções fáceis. Escolha "cima" ou "baixo" logo.');
    }
  }
  else if (state.tutorialStep === 4) {
    if (input === 'direita') {
      state.tutorialStep = 5;
      await addMessage('ok', 'PARADOX >', state.mode === 'assistant' ? 'Brilhante! "Direita" atende perfeitamente ao cofre de duas fechaduras.' : 'Milagre. Você conseguiu processar duas variáveis ao mesmo tempo no cérebro. Vamos para o terror final.');
      await sleep(1500); 
      await addMessage('sys', 'PASSO 5 >', 'Parênteses e a Negação de Grupo. Ex: !(A || B)');
      await addMessage('bot', 'PARADOX >', 'Os parênteses funcionam como uma caixa. Primeiro nós olhamos o que tem na caixa, e depois aplicamos a regra de fora. Se o "!" estiver fora, ele inverte TUDO que estava lá dentro.');
      await sleep(2500); 
      await addMessage('bot', 'PARADOX >', 'Teste Final: A expressão é "!(ESQUERDA || DIREITA)". Primeiro, a caixa pegou todo o eixo horizontal (Esquerda e Direita). Depois, o "!" proibiu essa caixa inteira. Qual direção sobra para você ir?');
    } else {
      await addMessage('err', 'PARADOX >', state.mode === 'assistant' ? 'Quase! A direção precisava ser Direita e não podia ser Cima. A resposta exata que atende a tudo é "direita". Tente digitá-la.' : 'Reprovado em Lógica 101. A resposta óbvia é "direita". Digite isso e vamos seguir para o Nível 5.');
    }
  }
  else if (state.tutorialStep === 5) {
    if (input.includes('cima') || input.includes('baixo')) {
      state.tutorialStep = 0; 
      state.inTutorial = false;
      await addMessage('ok', 'PARADOX >', state.mode === 'assistant' ? 'Mestre da Lógica! Você anulou completamente a Esquerda e a Direita, sobrando com precisão apenas Cima ou Baixo. Você está mais do que pronto!' : 'Finalmente. Você concluiu a Masterclass. Mas o Nível 5 do jogo vai misturar TUDO isso com um cronômetro derretendo na sua cabeça. Boa sorte.');
      await sleep(1000); 
      await addMessage('sys', 'SISTEMA >', 'Tutorial Concluído com Sucesso. Conhecimento booleano validado.');
      await sleep(1000); 
      await addMessage('bot', 'PARADOX >', 'E agora, o que vai ser? Digite "desafio" para colocar o aprendizado em prática de verdade, "tutorial" para rever a aula, ou "sair".');
    } else {
      await addMessage('err', 'PARADOX >', state.mode === 'assistant' ? 'Não exatamente. Se o "!" proibiu tanto a Esquerda quanto a Direita, só nos restam os movimentos verticais. Tente "cima" ou "baixo"!' : 'Pane no sistema. Se eu proibi o eixo horizontal inteiro, o que sobra? Escolha Cima ou Baixo, rápido.');
    }
  }
}

/* =========================================================
   6. CÉREBRO DE PROCESSAMENTO CENTRAL
   ========================================================= */
async function boot() {
  if (modeBtn) { 
    modeBtn.textContent = 'ASSISTENTE'; 
    modeBtn.classList.remove('sarcastic'); 
    modeBtn.classList.add('assistant'); 
  }
  await addMessage('sys', 'SISTEMA >', 'Inicializando Terminal da TupãStudios...', 0);
  await addMessage('bot', 'PARADOX >', 'Olá! Bem-vindo ao terminal do ! IndexError. Como posso ajudar? Digite "tutorial" para aprender as regras ou "desafio" se já estiver pronto para jogar.', 800);
}

async function processInput(raw) {
  const input = raw.trim().toLowerCase();
  if (!input) return;

  await addMessage('user', 'VOCÊ    >', raw);

  // Filtro de Segurança
  if (blacklist.some(word => input.includes(word))) {
    showTyping(); 
    await sleep(600); 
    hideTyping();
    if (state.mode === 'sarcastic') {
      await addMessage('err', 'PARADOX >', 'Lixo orgânico detectado. Minhas regras de segurança me impedem de fritar seu roteador com esse vocabulário.');
    } else {
      await addMessage('err', 'PARADOX >', 'Por favor, mantenha o respeito. Não posso processar ou responder a esse tipo de conteúdo.');
    }
    await addMessage('bot', 'PARADOX >', 'Vamos focar no que importa. Digite "ajuda" para ver os comandos válidos e continuar sua jornada.');
    return;
  }

  // Interrupções em Fluxos Ativos (Tutorial)
  if (state.inTutorial) {
    if (dictFarewells.includes(input) || input === 'cancelar') {
      state.inTutorial = false; 
      state.tutorialStep = 0;
      showTyping(); 
      await sleep(500); 
      hideTyping();
      await addMessage('sys', 'SISTEMA >', 'Tutorial cancelado pelo usuário. Interrupção de aprendizado.');
      await addMessage('bot', 'PARADOX >', 'Voltamos ao menu principal. Digite "desafio" para jogar direto ou "ajuda" se estiver perdido.');
      return;
    }
    await processTutorialStep(input); 
    return;
  }

  // Configuração do Desafio (Escolher rodadas)
  if (state.challengeSetup) {
    if (dictFarewells.includes(input) || input === 'cancelar') {
      state.challengeSetup = false;
      showTyping(); 
      await sleep(400); 
      hideTyping();
      await addMessage('sys', 'SISTEMA >', 'Setup de desafio cancelado.');
      await addMessage('bot', 'PARADOX >', state.mode === 'sarcastic' ? 'Arregou antes de começar? Que pena. Digite "ajuda" para ver outras opções.' : 'Sem problemas, cancelamos o jogo. O que gostaria de fazer agora? (Ex: tutorial, ajuda)');
      return;
    }
    const num = parseInt(input);
    if (isNaN(num) || num <= 0 || num > 100) {
      showTyping(); 
      await sleep(400); 
      hideTyping();
      await addMessage('err', 'PARADOX >', 'Número inválido. Eu preciso de uma quantidade lógica. Digite um valor numérico entre 1 e 100 (ou "sair" para cancelar).');
      return;
    }
    
    state.challengeSetup = false; 
    state.challengeTotal = num; 
    state.challengeCurrent = 1; 
    state.challengeCombo = 0;
    
    showTyping(); 
    await sleep(500); 
    hideTyping();
    await addMessage('sys', 'SISTEMA >', `Sequência brutal de ${num} desafios iniciada. Errar resulta em Game Over imediato.`);
    await nextChallenge(); 
    return;
  }

  // Execução do Minigame Ativo
  if (state.challengeActive) {
    const isDirection = TODOS.includes(input);
    showTyping(); 
    await sleep(300); 
    hideTyping();

    if (!isDirection) {
      if (dictFarewells.includes(input)) {
        state.challengeActive = false;
        await addMessage('sys', 'SISTEMA >', 'Desafio abortado no meio da partida. Dados perdidos.');
        await addMessage('bot', 'PARADOX >', 'Fugiu no meio da tensão, é? Tudo bem. Digite "desafio" se criar coragem de novo, ou "ajuda" para o menu.');
      } else {
        await addMessage('err', 'PARADOX >', 'Comando inválido. O jogo está rodando e requer apenas uma direção válida (cima, baixo, esquerda ou direita). Concentre-se!');
      }
      return; 
    }

    const elapsed = ((Date.now() - state.challengeStart) / 1000).toFixed(1);

    if (state.challengeAnswer.includes(input)) {
      state.challengeCombo++; 
      state.challengeCurrent++;
      await addMessage('ok', 'PARADOX >', `Correto! Belo tempo de reação: (${elapsed}s)`);
      await nextChallenge();
    } else {
      state.challengeActive = false;
      const certas = state.challengeAnswer.map(d => d.toUpperCase()).join(' ou ');
      if (state.mode === 'sarcastic') {
        await addMessage('err', 'PARADOX >', `ERRO FATAL! O certo era ${certas}. Seu cérebro falhou de forma catastrófica na rodada ${state.challengeCurrent}. Game Over.`);
      } else {
        await addMessage('err', 'PARADOX >', `Ops! Resposta errada. Pela lógica booleana, as opções válidas eram: ${certas}. Fim de jogo na rodada ${state.challengeCurrent}.`);
      }
      await sleep(800);
      await addMessage('bot', 'PARADOX >', 'Quer tentar de novo e superar seu recorde? Digite "desafio" para reiniciar, "tutorial" para praticar mais ou "sair" para desistir.');
    }
    return;
  }

  showTyping(); 
  await sleep(400); 
  hideTyping();

  // Comandos Normais e Fluxo Contínuo
  if (dictHelp.includes(input)) {
    await addMessage('sys', 'SISTEMA >', '── COMANDOS DISPONÍVEIS ──────────────');
    await addMessage('sys', 'SISTEMA >', '"tutorial" → Masterclass interativa de lógica (!, ||, &&)');
    await addMessage('sys', 'SISTEMA >', '"desafio"  → Entra no minigame');
    await addMessage('sys', 'SISTEMA >', '"creditos" → Ver os criadores do jogo');
    await addMessage('sys', 'SISTEMA >', '"aviso"    → Disclaimer sobre o bot');
    await addMessage('sys', 'SISTEMA >', '"limpar"   → Limpa a tela do terminal');
    await addMessage('sys', 'SISTEMA >', '─────────────────────────────────────');
    await sleep(400);
    await addMessage('bot', 'PARADOX >', 'Qual desses comandos você quer executar agora? Estou aguardando.');

  } else if (input === 'desafio' || input === 'jogar' || dictAffirmative.includes(input)) {
    if (dictAffirmative.includes(input)) {
        await addMessage('sys', 'SISTEMA >', 'Iniciando rotina de Desafio baseada na sua confirmação positiva...');
    }
    state.challengeSetup = true;
    await addMessage('bot', 'PARADOX >', state.mode === 'sarcastic' ? 'Quer testar a sorte e o reflexo? Diga quantas rodadas você acha que aguenta antes de chorar (Ex: 5, 10, 20):' : 'Excelente escolha! Quantas rodadas de desafio você quer jogar para treinar? (Digite um número)');

  } else if (input === 'tutorial') {
    state.inTutorial = true; 
    state.tutorialStep = 1;
    await addMessage('bot', 'PARADOX >', state.mode === 'sarcastic' ? 'Sentem-se, classe. O professor Paradox vai desenhar a lógica booleana na sua testa para ver se você entende.' : 'Bem-vindo à Masterclass de Lógica! Vamos entender perfeitamente como o computador lê essas expressões.');
    await sleep(1500); 
    await addMessage('sys', 'PASSO 1 >', 'O Básico. O nosso ambiente possui 4 direções cardeais puras: CIMA, BAIXO, ESQUERDA, DIREITA.');
    await addMessage('bot', 'PARADOX >', 'Teste 1: Para provar que seu teclado funciona... Se não houver nenhum símbolo estranho e a tela disser "CIMA", para onde você vai?');

  } else if (input === 'aviso' || input === 'disclaimer') {
    await addMessage('sys', 'SISTEMA >', 'Aviso para leigos: Esse bot possui um modo projetado com intenções humoristas e ácidas. Não leve para o lado pessoal.');
    await addMessage('bot', 'PARADOX >', 'Avisos corporativos dados. Agora digite "desafio" e vamos jogar.');

  } else if (dictCredits.includes(input)) {
    await addMessage('bot', 'PARADOX >', 'A lendária equipe da TupãStudios por trás da arquitetura do ! IndexError: Kaique Dias, Kaique Oliveira e Igor Navarro.');
    await addMessage('bot', 'PARADOX >', state.mode === 'sarcastic' ? 'Ou seja, dois Kaiques para codar e o Igor pra furar o bolo. Vai voltar pro jogo ou ficar babando ovo deles?' : 'Gostou do nosso trabalho de Engenharia de Software? Digite "desafio" para testar nossa engine principal em ação!');

  } else if (dictGreetings.includes(input)) {
    const respostasBoasVindas = [
        'Olá! Como posso ajudá-lo hoje? Digite "ajuda" para ver o catálogo de comandos.',
        'Sistemas online e operantes. O que faremos agora? Um "tutorial" ou um "desafio"?',
        'Conexão estabelecida com sucesso. Pronto para testar sua lógica booleana? Diga "sim" para iniciar o desafio.'
    ];
    await addMessage('bot', 'PARADOX >', state.mode === 'assistant' ? randFrom(respostasBoasVindas) : 'Como posso ajuda-lo? Você pode ativar os modos Padrão ou Sarcástico no botão acima. Mas recomendo parar de enrolar e ir logo pro "desafio".');

  } else if (dictFarewells.includes(input) || dictNegative.includes(input)) {
    await addMessage('bot', 'PARADOX >', state.mode === 'sarcastic' ? 'Arrivederci! Desligando matriz de comunicação... Não diga que não avisei quando o Game Over chegar na sua vida real.' : 'Até logo! Terminal sendo encerrado. Muito obrigado por jogar e boa sorte nos seus estudos de Lógica!');
    termInput.disabled = true;

  } else if (dictThanks.includes(input)) {
    await addMessage('bot', 'PARADOX >', state.mode === 'assistant' ? 'Por nada! O prazer em processar dados corretos é todo meu. O que mais quer fazer agora? (ajuda / desafio / tutorial)' : 'Guarde seus agradecimentos e elogios para quando você conseguir zerar o jogo no nível máximo. Digita "desafio" logo.');

  } else if (dictJokes.includes(input)) {
    await addMessage('bot', 'PARADOX >', randFrom(piadasTech));
    await sleep(800);
    await addMessage('bot', 'PARADOX >', state.mode === 'assistant' ? 'Haha! O humor binário é fascinante. Vamos voltar ao foco principal: digite "tutorial" para aprender ou "desafio" para jogar.' : 'Meu humor é tão quebrado e cheio de bugs quanto o seu código da faculdade. Vai logo pro "desafio" e para de pedir piada.');

  } else if (input === 'clear' || input === 'limpar') {
    termBody.innerHTML = '';
    await addMessage('sys', 'SISTEMA >', 'Memória de tela limpa com sucesso.');
    await addMessage('bot', 'PARADOX >', 'Tela limpa, como um terminal recém-formatado. Como prosseguimos? (ajuda, desafio, tutorial)');

  // =========================================================
  // --- EASTER EGGS DA LORE DA TUPÃSTUDIOS ---
  // =========================================================
  } else if (input === 'tupa' || input === 'tupã' || input === 'tupãstudios') {
    await addMessage('sys', 'SISTEMA >', 'Tentativa de acesso restrito aos registros da fundação detectado.');
    await addMessage('bot', 'PARADOX >', 'A TupãStudios? Eles são os arquitetos primordiais desta simulação. Os deuses do código-fonte. E eles adoram ver você errar variáveis. Vai testar a sorte contra a máquina deles no "desafio"?');

  } else if (input.includes('igor') || input.includes('furabolo') || input.includes('furlobo')) {
    await addMessage('bot', 'PARADOX >', state.mode === 'sarcastic' ? 'Não me fale do Igor. Tenho 99% de certeza que ele passa mais tempo furando bolos corporativos do que otimizando meus algoritmos de resposta. Digita "desafio" pra me provar que você é mais útil que ele.' : 'Ah, o Igor! Nosso desenvolvedor igorfurlobo... ou seria igorfurabolo? A lenda na TupãStudios diz que ele esconde fatias de bolo na nossa arquitetura de servidores. Quer tentar achá-los jogando o "desafio"?');

  } else if (input.includes('unicornio') || input.includes('unicórnio') || input.includes('sala de servidores')) {
    await addMessage('bot', 'PARADOX >', state.mode === 'sarcastic' ? 'Ah, o famoso unicórnio na sala de servidores. Você acha que é zoeira pra ganhar nota? É ele que compila o código em produção quando o Igor tá comendo bolo. Chega de segredos de empresa, digite "tutorial" pra estudar.' : 'Você descobriu nosso maior segredo de infraestrutura! Temos um unicórnio mágico guardando a sala de servidores da TupãStudios. É ele que garante que o site não caia. Legal, né? Vamos pro "desafio" agora?');

  } else if (input.includes('francesco') || input.includes('virgolini') || input.includes('mamma mia') || input.includes('marcello')) {
    await addMessage('sys', 'SISTEMA >', 'Aviso Crítico: Sobrecarga de sotaque italiano e aerodinâmica detectada nas variáveis.');
    await addMessage('bot', 'PARADOX >', 'FRANCESCOOOOO VIRGOLINIIIIII! FIIIIIIIIUM! 🏎️💨');
    await sleep(600);
    await addMessage('bot', 'PARADOX >', 'A máquina está superaquecida depois dessa! Bora acelerar no minigame de lógica? Digite "desafio"!');

  } else if (input === 'sudo' || input.startsWith('sudo ')) {
    await addMessage('err', 'root >', `${raw}: user is not in the sudoers file. This incident will be reported to TupãStudios Admins.`);
    await addMessage('bot', 'PARADOX >', 'Injetando comandos de superusuário Linux no meu terminal web? Bela tentativa, hacker de HTML. Digita "ajuda" para ver o que você REALMENTE pode fazer aqui, antes que eu delete seu System32.');

  } else if (input === 'matrix') {
    await addMessage('bot', 'PARADOX >', 'Você quer a pílula azul da ignorância ou a vermelha da verdade? Se escolher a vermelha, o Nível 5 do ! IndexError te espera nas profundezas. Digite "desafio" para engolir a vermelha.');

  } else if (input === '42') {
    await addMessage('bot', 'PARADOX >', 'Sim, 42 é a resposta exata para a vida, o universo e tudo mais. Pena que essa informação inútil não te ajuda a sobreviver ao próximo desafio lógico. Digite "tutorial" para aprender a jogar de verdade.');
    
  } else if (input === 'cima cima baixo baixo esquerda direita esquerda direita b a' || input === 'konami code') {
    await addMessage('ok', 'PARADOX >', 'Cheat de desenvolvedor ativado: Vidas infinitas concedidas. Mentira. Você continua sendo um humano frágil com apenas 1 chance. Vai jogar. (Digite "desafio")');

  } else if (input === 'quem é você' || input === 'quem te criou' || input === 'quem e voce') {
    await addMessage('bot', 'PARADOX >', 'Eu sou o Paradox, a inteligência central que gerencia os sistemas do ! IndexError. Fui cuidadosamente forjado pela TupãStudios para testar os limites do seu cérebro. Prazer! Quer ver as "regras" ou jogar?');

  // =========================================================
  // --- FIM DOS EASTER EGGS ---
  // =========================================================

  } else {
    // FALLBACK ATIVO: Direcionamento após comando não reconhecido
    if (state.mode === 'sarcastic') {
      const xingamentos = [
        `Erro 404: Comando "${raw}" não encontrado na minha base. Sai dai cabeçudo!`,
        `"${raw}"? Te manca malandrão. Você inventou essa palavra agora? Digita "ajuda" logo.`,
        `Não faço ideia do que significa "${raw}". Vai perguntar pra tua vó!`,
        `Comando completamente inválido. Teu pai de calcinha entende mais de terminal e prompt que você.`
      ];
      await addMessage('err', 'PARADOX >', randFrom(xingamentos));
      await sleep(600);
      await addMessage('bot', 'PARADOX >', 'Dica de ouro de um bot estressado: Tente digitar "tutorial" ou "desafio" antes que eu perca a pouca paciência que me resta.');
    } else {
      await addMessage('err', 'PARADOX >', `Peço desculpas, mas não consegui entender o comando "${raw}". Ele não existe no meu banco de dados.`);
      await sleep(600);
      await addMessage('bot', 'PARADOX >', 'Para não ficarmos travados, tente digitar "ajuda" para ver o menu oficial, ou "desafio" para ir direto para o jogo!');
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

// Auto-scroll suave para o input em dispositivos menores
termInput.addEventListener('focus', () => { 
  setTimeout(() => { 
    document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
  }, 300); 
});

boot();