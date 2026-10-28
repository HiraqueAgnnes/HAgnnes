# Próximas entregas

## P0 — Separar configuração e dados privados

- Remover dos fontes candidatos a publicação os links que concedem acesso a diretórios e fontes restritas, inclusive autenticação eleitoral.
- Revisar cadastros, escalas, PDFs, dados incorporados e scripts auxiliares antes da importação pública.
- Externalizar configuração e criar fixtures sintéticas; verificar também conteúdo histórico antes de qualquer espelhamento Git.
- Conclusão: checkout candidato revisado, sem dados pessoais/credenciais/fontes privadas, com fixtures e falha explícita quando faltar configuração.

## P1 — Importar os dois aplicativos completos

- Partir dos commits do manifesto, preservando os projetos em diretórios separados.
- Importar frontend, APIs, serviços, scripts e ativos revisados; verificar licenças de fontes/arquivos de terceiros.
- Instalar dependências pelo lockfile e compilar ambos; documentar configurações reais sem valores secretos.
- Conclusão: execução local reproduzível, builds aprovados e correspondência com versão publicada verificada.

## P1 — Homologar APIs e exportações

- Testar acesso anônimo, cada perfil, área/turno e chamadas diretas às APIs.
- Cobrir filtros, totais, PDF/DOCX/Excel, mapa por área e informações dos pontos.
- Reaproveitar os testes já existentes na origem, após revisão dos dados e URLs utilizados.
- Conclusão: testes automatizados e verificação visual sem usar cadastros reais.

## P2 — Implantação e governança

- Estabelecer revisão por pull request, proteção de branch e CI de build/testes completos.
- Definir se HAgnnes será referência pública ou origem de implantação; preparar rollback e backup privado dos dados.
- Preencher descrição do repositório. Não presumir licença de redistribuição dos ativos incorporados.

Já entregue: inventário dos 867 arquivos de origem, rastreabilidade por commit/hash, subconjunto revisado, esquemas e migrações, documentação, configuração de exemplo e CI de verificação desse subconjunto.
