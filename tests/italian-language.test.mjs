import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const source = path => fs.readFileSync(new URL(path, root), 'utf8');
const moduleUrl = text => 'data:text/javascript;base64,' + Buffer.from(text).toString('base64');
const labels = async name => (await import(moduleUrl(source(`Resources/slider/language/${name}.js`)))).languageLabels;
const english = await labels('eng');
const italian = await labels('ita');
const storage = new Map();
globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
Object.defineProperty(globalThis, 'navigator', { value: { languages: ['it-IT'], language: 'it-IT' }, configurable: true });
const indexSource = source('Resources/slider/language/index.js').replace(/from '\.\/(\w+)\.js'/g, (_, name) => `from '${moduleUrl(source(`Resources/slider/language/${name}.js`))}'`);
const language = await import(moduleUrl(indexSource));
const cinemaSource = source('Resources/slider/modules/cinemaPreRollLocale.js')
  .replace('import { getConfig } from "./config.js";', 'const getConfig = () => ({});')
  .replace('import { withServer } from "./jfUrl.js";', 'const withServer = path => path;');
const cinema = await import(moduleUrl(cinemaSource));

test('Italian covers every translation and preserves interpolation parameters', () => {
  let count = 0;
  function visit(en, it, path = '') {
    for (const key of Object.keys(en)) {
      const name = `${path}.${key}`;
      assert.ok(it?.[key] != null, name);
      if (typeof en[key] === 'object') visit(en[key], it[key], name);
      else {
        assert.equal(typeof it[key], 'string', name);
        assert.ok(it[key].trim(), name);
        const placeholders = value => [...value.matchAll(/\{\w+\}/g)].map(match => match[0]).sort();
        assert.deepEqual(placeholders(it[key]), placeholders(en[key]), name);
        count++;
      }
    }
  }
  visit(english, italian);
  assert.ok(count > 2000);
  assert.equal(italian.timeLocale, 'it-IT');
  assert.equal(italian.detailsTitle, 'Dettagli');
});

test('Italian aliases, automatic browser detection and explicit preference', () => {
  for (const code of ['ita', 'it', 'it-IT', 'IT_it', 'it-CH']) assert.equal(language.normalizeLanguageCode(code), 'ita');
  assert.equal(language.getEffectiveLanguage(), 'ita');
  language.setLanguagePreference('auto');
  assert.equal(language.getEffectiveLanguage(), 'ita');
  language.setLanguagePreference('por');
  assert.equal(language.getEffectiveLanguage(), 'por');
  language.setLanguagePreference('ita');
  assert.equal(language.getLanguageLabels(language.getEffectiveLanguage()).detailsTitle, 'Dettagli');
  navigator.languages = ['en-US'];
  assert.equal(language.getEffectiveLanguage(), 'ita');
  language.setLanguagePreference('auto');
  assert.equal(language.getEffectiveLanguage(), 'eng');
});

test('Automatic cinema trailers use Italian titles and Italian region', () => {
  for (const code of ['ita', 'it', 'it-IT', 'it_it']) assert.equal(cinema.normalizeCinemaPreRollLanguage(code), 'it-IT');
  const locale = cinema.resolveCinemaPreRollLocale({ defaultLanguage: 'ita', cinemaPreRollLanguage: 'auto' });
  assert.equal(locale.language, 'it-IT');
  assert.equal(locale.region, 'IT');
  assert.equal(locale.cacheKey, 'it-IT:IT');
  const url = cinema.buildCinemaPreRollCacheUrl(locale);
  assert.equal(url.searchParams.get('language'), 'it-IT');
  assert.equal(url.searchParams.get('region'), 'IT');
});
