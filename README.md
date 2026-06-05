Este documento detalha as especificações técnicas e funcionais da plataforma web e do assistente virtual Paradox, desenvolvidos para o projeto **! IndexError** da **TupãStudios**.

---

# Documentação Técnica: Ecossistema Web e Assistente Paradox

## 1. Interface e Arquitetura Web
A plataforma web foi projetada para atuar como o centro de introdução, instrução e suporte ao usuário, apresentando uma estrutura modular e responsiva.

* **Modularização de Páginas**: O projeto utiliza uma arquitetura de múltiplas abas (`index.html`, `tutorial.html` e `tupa.html`) para segmentar a experiência do usuário entre a apresentação do produto, o aprendizado das mecânicas e a identidade institucional da empresa.
* **Design Responsivo**: A interface utiliza tecnologias de layout flexível (*CSS Grid* e *Flexbox*), garantindo compatibilidade total com dispositivos móveis e desktops.
* **Identidade Visual (Cyberpunk)**: A estética é fundamentada em terminais retro-futuristas, incorporando elementos visuais como *scanlines*, animações de *glitch* e sistemas de iluminação neon aplicados via propriedades de sombra textual dinâmicas (`text-shadow`).

## 2. Assistente Virtual Paradox (v10.0)
O núcleo interativo da plataforma reside no assistente Paradox, implementado via JavaScript puro para fornecer suporte em tempo real.

### 2.1. Interface de Interação (Widget)
* **Janela Flutuante**: O assistente opera em uma janela de terminal persistente no canto inferior da interface.
* **Funcionalidades de Janela**: O sistema permite a minimização, o encerramento da sessão ou a expansão para modo de tela cheia, facilitando apresentações e treinamentos imersivos.

### 2.2. Gerenciamento de Personalidade e Modos
O sistema possui uma máquina de estados que altera o comportamento do bot conforme a preferência do usuário:
* **Modo Assistente (Padrão)**: Focado em auxílio didático, operando com protocolos de cortesia e explicações claras.
* **Modo Sarcástico**: Desativa os filtros de empatia, adotando um tom irônico e crítico em relação ao desempenho do usuário. Este modo exige a aceitação de um aviso legal informando que as interações possuem intenções humorísticas.

### 2.3. Funcionalidades Integradas
* **Gerador de Desafios (Minigame)**: O Paradox integra a lógica de expressões booleanas desenvolvida originalmente para o jogo em Python, permitindo que o usuário execute sequências de desafios lógicos multiníveis diretamente no navegador.
* **Masterclass Interativa**: Um sistema de tutorial em cinco etapas onde o usuário deve validar seu conhecimento através de comandos de terminal para avançar na explicação teórica sobre negações, disjunções e conjunções.
* **Filtros de Segurança**: O processamento de mensagens é monitorado por uma lista de termos restritos (*blacklist*). Qualquer entrada contendo vocabulário impróprio, discurso de ódio ou ofensas resulta no bloqueio imediato da resposta e em uma advertência contextualizada ao modo ativo.

## 3. Elementos de Interatividade Oculta (Easter Eggs)
* **Acesso a Arquivos Confidenciais**: Na página institucional, foi implementado um mecanismo de descoberta baseado em interações sequenciais.
* **Gatilho Secreto**: Ao acionar o elemento ... três vezes consecutivas, a interface revela uma seção oculta contendo a narrativa interna e curiosidades da TupãStudios.

## 4. Guia de Comandos do Terminal
O assistente responde a uma variedade de entradas linguísticas e operacionais:
* **Operacionais**: `tutorial`, `desafio`, `ajuda`, `limpar`.
* **Institucionais**: `creditos`, `equipe`, `aviso`, `tupa`.

## 5. Equipe de Desenvolvimento
Projeto desenvolvido e mantido pela equipe da **TupãStudios**:
* **Kaique Dias**: Arquiteto de Sistemas e Desenvolvedor.
* **Kaique Oliveira**: Desenvolvedor e Especialista em Lógica.
* **Igor Navarro**: Desenvolvedor e Designer.
