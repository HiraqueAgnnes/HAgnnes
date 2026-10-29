# Portal de Planejamento, Eventos e Eleições — CPRM

Repositório de referência e consolidação dos dois portais existentes. Em 28/10/2026 foi incorporado um **subconjunto revisado dos fontes**, com documentação, dependências, esquemas, migrações e regras de acesso/localização. **Ainda não é uma cópia completa nem implantável dos portais.**

| Projeto | Portal | Versão observada no Sites |
| --- | --- | --- |
| Planejamento e Eventos | https://cprm-planejamento-eventos.ia-agnnes.chatgpt.site | 139 |
| Policiamento das Eleições | https://policiamento-eleicoes-2026.ia-agnnes.chatgpt.site | 144 |

Os projetos têm repositórios de origem próprios no Sites. O HAgnnes não é, neste momento, a origem de implantação. Nenhuma mudança desta consolidação foi publicada nos portais.

As versões da tabela foram conferidas em 29/10/2026, incluindo os commits e o sucesso das implantações registradas. O manifesto do subconjunto inicial continua descrevendo a importação de 28/10. Ver [evidências e trabalho restante](docs/verificacao-2026-10-29.md).

## Conteúdo

- `apps/planejamento/` e `apps/eleicoes/`: subconjunto inicial preservado em conteúdo canônico LF e novos módulos revisados. Não executar build destes diretórios incompletos.
- `docs/source-manifest.json`: commits de origem, versões observadas e SHA-256 de cada arquivo incorporado.
- `docs/inventario-*.txt`: lista completa dos caminhos encontrados na origem; listar um caminho não significa que seu conteúdo foi importado.
- [Permissões](docs/permissoes.md), [funcionalidades](docs/funcionalidades.md), [execução e implantação](docs/execucao.md), [pendências](docs/pendencias.md).
- [Fontes privadas e continuidade das escalas](docs/configuracao-privada.md): leitura atualizada das planilhas e preservação dos destinos de edição e inserção durante a preparação.

## Verificação desta consolidação

Requisitos: Node.js 24 e Python 3, sem instalar dependências dos portais.

```sh
node --test tests/*.test.mjs
python3 scripts/verify-repository.py
```

A integração contínua executa os mesmos comandos. São 16 testes de regras selecionadas, autenticação e sessão, configuração privada, abertura autenticada de links e atualização das escalas, com fronteiras externas simuladas e dados sintéticos. O verificador também confere integridade do subconjunto inicial, padrões sensíveis e migrações em SQLite vazio. Esses resultados não substituem homologação das APIs completas, navegador, D1 ou produção.

## Importação integral

A origem contém referências a fontes de autenticação e arquivos operacionais misturados ao código. Esses conteúdos não foram copiados para este repositório público. A próxima etapa é separar configuração privada, cadastros, escalas e arquivos de produção, gerar dados sintéticos e só então importar e compilar os aplicativos completos. Ver [pendências e critérios de conclusão](docs/pendencias.md).
