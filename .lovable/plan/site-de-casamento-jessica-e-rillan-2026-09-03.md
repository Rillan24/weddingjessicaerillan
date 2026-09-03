# Site de Casamento — Jessica e Rillan

Site completo inspirado na referência enviada: paleta verde sálvia + rosa claro, tipografia serifada elegante, colagens de fotos com blocos de cor.

## Estrutura da página (rolagem única, com menu fixo)

1. **Capa** — monograma "J & R" com folhagem, nomes, data e local, contagem regressiva.
2. **Nossa história** — colagem estilo referência (foto grande + fotos sobrepostas em blocos rosa/verde) com o texto do casal.
3. **Cerimônia e festa** — horário, endereço, mapa e orientações (traje, estacionamento).
4. **Cronograma do dia** — linha do tempo (cerimônia, coquetel, jantar, festa).
5. **Padrinhos e madrinhas** — grade de retratos com nomes.
6. **Galeria** — grade em mosaico assimétrico, como na referência.
7. **Hospedagem** — sugestões de hotéis/pousadas com link.
8. **Lista de presentes** — cartões de presente com valores e chave PIX (copiar com um clique).
9. **Confirmação de presença (RSVP)** — formulário: nome, e-mail/telefone, número de acompanhantes, presença sim/não, restrição alimentar, recado.
10. **FAQ** — perguntas frequentes em acordeão.
11. **Rodapé** — monograma, data e frase do casal.

## Conteúdo

Data, local e textos ainda não definidos: entram como conteúdo de exemplo claramente marcado, fácil de substituir depois. Fotos: imagens temporárias no estilo da referência (casal, buquês, local), que você troca pelas suas quando enviar.

## Backend

RSVP e lista de presentes precisam guardar dados, então ativo o Lovable Cloud:
- tabela de confirmações (inserção pública, leitura restrita)
- tabela de presentes com marcação de "já escolhido"
- página administrativa protegida por login para você ver a lista de confirmados e exportar

## Detalhes técnicos

- Tokens de design em `src/styles.css` (sálvia, rosa poeira, off-white, dourado suave) + fontes serifada/sans via `<link>` no `__root.tsx`.
- Página principal em `src/routes/index.tsx`, seções como componentes em `src/components/wedding/`.
- Rota `/admin` autenticada para as confirmações.
- Formulário RSVP com validação Zod + server function; SEO com `head()` próprio (título, descrição, og).
