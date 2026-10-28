# Portal de Planejamento, Eventos e Eleições — CPRM

Repositório de referência e consolidação dos dois portais existentes. Em 28/10/2026 foi incorporado um **subconjunto revisado dos fontes**, com documentação, dependências, esquemas, migrações e regras de acesso/localização. **Ainda não é uma cópia completa nem implantável dos portais.**

| Projeto | Portal | Versão observada no Sites |
| --- | --- | --- |
| Planejamento e Eventos | https://cprm-planejamento-eventos.ia-agnnes.chatgpt.site | 136 |
| Policiamento das Eleições | https://policiamento-eleicoes-2026.ia-agnnes.chatgpt.site | 144 |

Os projetos têm repositórios de origem próprios no Sites. O HAgnnes não é, neste momento, a origem de implantação. Nenhuma mudança desta consolidação foi publicada nos portais.

## Conteúdo

- `apps/planejamento/` e `apps/eleicoes/`: arquivos selecionados, preservados byte a byte; não executar build destes diretórios incompletos.
- `docs/source-manifest.json`: commits de origem, versões observadas e SHA-256 de cada arquivo incorporado.
- `docs/inventario-*.txt`: lista completa dos caminhos encontrados na origem; listar um caminho não significa que seu conteúdo foi importado.
- [Permissões](docs/permissoes.md), [funcionalidades](docs/funcionalidades.md), [execução e implantação](docs/execucao.md), [pendências](docs/pendencias.md).

## Verificação desta consolidação

Requisitos: Node.js 24 e Python 3, sem instalar dependências dos portais.

```sh
node --test tests/*.test.mjs
python3 scripts/verify-repository.py
```

A integração contínua executa os mesmos comandos. Eles verificam regras selecionadas de acesso, coordenadas, integridade da importação, ausência de padrões sensíveis e aplicação das migrações em SQLite vazio. Não substituem testes de APIs, navegador ou produção.

## Importação integral

A origem contém referências a fontes de autenticação e arquivos operacionais misturados ao código. Esses conteúdos não foram copiados para este repositório público. A próxima etapa é separar configuração privada, cadastros, escalas e arquivos de produção, gerar dados sintéticos e só então importar e compilar os aplicativos completos. Ver [pendências e critérios de conclusão](docs/pendencias.md).
