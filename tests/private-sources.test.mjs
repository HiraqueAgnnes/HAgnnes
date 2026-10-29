import test from 'node:test';
import assert from 'node:assert/strict';
import { privateSourceUrl, sourceLink, SourceConfigurationError, sourceNames } from '../apps/eleicoes/app/lib/private-sources.ts';

test('configuração ausente ou inválida falha explicitamente sem revelar o valor', () => {
  const credentialed = new URL('https://example.invalid/file');
  credentialed.username = 'synthetic-user';
  credentialed.password = 'synthetic-password';
  for (const value of [undefined, '', '   ', 'not-a-url', 'http://example.invalid/file', credentialed.href, 'javascript:alert(1)']) {
    assert.throws(() => privateSourceUrl({ELECTION_LOGIN_URL: value}, 'ELECTION_LOGIN_URL'), error => {
      assert.ok(error instanceof SourceConfigurationError);
      assert.equal(error.message, 'Fonte privada não configurada ou inválida: ELECTION_LOGIN_URL');
      return true;
    });
  }
});
test('links mantêm caminho e parâmetros de edição, upload e leitura', () => {
  const url = 'https://example.invalid/scales/edit?mode=edit&upload=1&token=synthetic#sheet';
  for (const name of sourceNames) {
    assert.equal(privateSourceUrl({[name]: url}, name), url);
    const link = new URL(sourceLink(name), 'https://portal.test');
    assert.equal(link.pathname, '/api/private-source');
    assert.equal(link.searchParams.get('name'), name);
    assert.ok(!link.href.includes('synthetic'));
  }
});
test('mudança de configuração passa a valer sem recompilar ou congelar as escalas', () => {
  const settings = {ELECTION_WORKBOOK_2_URL: 'https://example.invalid/version-a'};
  assert.equal(privateSourceUrl(settings, 'ELECTION_WORKBOOK_2_URL'), settings.ELECTION_WORKBOOK_2_URL);
  settings.ELECTION_WORKBOOK_2_URL = 'https://example.invalid/version-b?mode=edit';
  assert.equal(privateSourceUrl(settings, 'ELECTION_WORKBOOK_2_URL'), settings.ELECTION_WORKBOOK_2_URL);
});
