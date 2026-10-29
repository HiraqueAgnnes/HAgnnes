# Verificação em 29/10/2026

## Escopo entregue neste incremento

Configuração privada de autenticação e das planilhas eleitorais; abertura autenticada da pasta de escalas; listas privadas de controle de relatórios; fixtures sintéticas em testes de autenticação, sessões, permissões, links e atualização das escalas. O verificador local passou a examinar também arquivos novos ainda não adicionados ao Git.

Não conclui a importação integral nem encerra as issues #1, #2 e #3.

## Compilações locais

Dependências dos dois projetos instaladas com `pnpm install --frozen-lockfile --ignore-scripts`, preservando os lockfiles. Os scripts de instalação de dependências não foram executados; a compilação foi executada separadamente.

- Eleições: cópia dos arquivos versionados do commit local `2c02e94ad8ddebd1aad765acd4ed4ec39695871e`, com as alterações revisadas aplicadas na cópia isolada. Compilação final concluída após integrar as listas privadas e a abertura autenticada da pasta.
- Planejamento: cópia dos arquivos versionados do commit local `0f821f1`, com compilação concluída.

Esses resultados não significam que o checkout público parcial já compila. Dados e ativos da origem privada continuaram somente nas cópias locais; não foram publicados.

## Testes adicionais da origem

- COPOM: autorização, validação, persistência SQLite, deduplicação, edição, datas e totais aprovados.
- Presença em guarda e votação: autorização, campos obrigatórios, isolamento por local/turno, edição concorrente, controle e exportação aprovados.
- ENEM: cadastro/edição, conflito de versões, exclusão, dois postos, duplicidade diária e geração de PDF aprovados.
- Exportação ENEM: nove colunas, ordem, filtros, CPF textual, datas/horários, XLSX e PDF multipágina aprovados.
- Estatísticas e mapas: os dois testes antigos falhavam no Windows por importação dinâmica de caminhos `C:` sem conversão para URL de arquivo e não incluíam duas dependências atuais. O adaptador `scripts/verify-planning-origin.mjs` aplica essas correções somente em cópias temporárias dos testes, preservando as asserções. Ambos passaram: autorização de endpoints, índices, períodos, perfis, filtros, coordenadas, CSV e restrição de registros individuais.

Para reproduzir as verificações de origem, instalar as dependências fixadas na cópia completa e isolada e executar `node scripts/verify-planning-origin.mjs <cópia-isolada-do-Planejamento>` a partir da raiz deste repositório. Os arquivos temporários dos testes são removidos; artefatos de teste permanecem no diretório privado ignorado `.sites-runtime` da cópia de origem.

Na preparação pública: `node --test tests/*.test.mjs` aprovou os 16 testes. O verificador Python confirmou a integridade do subconjunto e as migrações em SQLite vazio; isso não demonstra migração de base populada nem equivalência com D1.

As verificações não incluem homologação visual completa nem um ambiente D1 remoto isolado.

## Proveniência confirmada pelo Sites

As versões salvas e seus respectivos registros de implantação foram consultados, sem nova publicação:

| Aplicativo | Versão | Commit registrado no artefato | Implantação consultada |
| --- | --- | --- | --- |
| Eleições | 144 | `4b5e3a042799f8718f9a3e3a22a37b58c32f4508` | succeeded |
| Planejamento | 139 | `6faac3a01717c39670961a330975cdb9b857ecb4` | succeeded |

O manifesto inicial observou Planejamento 136. A revisão integral precisa reconciliar os fontes atuais com a versão 139, preservando as alterações em andamento. Os commits locais compilados acima não foram declarados equivalentes aos artefatos salvos.

## Impedimentos e trabalho restante

- A origem eleitoral contém dois snapshots de escalas e um cadastro derivado de usuários; a revisão desses dados não está concluída. Há 15 PDFs operacionais na pasta de documentos eleitoral.
- Planejamento contém dados operacionais incorporados, documentos e 58 arquivos cifrados de COPOM. Não foram espelhados para o GitHub.
- Restam referências privadas, permissões com identificadores pessoais, fixtures completas e revisão de licenças dos ativos antes da importação integral.
- Faltam testes completos de navegador, mapas e DOCX, migrações com base sintética populada e D1 isolado.
- A consulta de proteção da branch retornou `403 Resource not accessible by integration`. A conexão do GitHub não fornece esse acesso administrativo; não foi inferida nem alterada a proteção efetiva.
- A integração de implantação permanece desvinculada da preparação pública.
