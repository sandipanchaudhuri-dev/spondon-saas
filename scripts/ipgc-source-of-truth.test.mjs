// Regression gate for the 9 November 2026 IPGC production incident.
// Static contract checks are deliberately narrow: they prevent the precise
// chat-snapshot/gallery regressions reported, but do NOT replace database
// integration, permissions, image-quality, or end-to-end tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const app = 'ipgc-app/src/app';
const source = (path) => readFileSync(path, 'utf8');
const route = (name) => source(join(app, name));

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

test('finalist attributes come from live approved registration records', () => {
  const reader = route('ipgc-finalist-details.ts');
  assert.match(reader, /\/rest\/v1\/rpc\/ipgc_public_finalist_details/);
  assert.match(reader, /cache:\s*['"]no-store['"]/);
  assert.match(reader, /if\s*\(!response\.ok\)\s*throw/);
  assert.match(reader, /Duplicate approved finalist registration/);
  const home = route('page.tsx');
  const detail = route('pujo/[slug]/page.tsx');
  for (const [name, page] of [['home',home], ['detail',detail]]) {
    assert.match(page, /loadFinalistDetails\(/, name + ' must load live registrations');
    assert.match(page, /details\[/, name + ' must index canonical registration details');
    assert.doesNotMatch(page, /Not provided/i, name + ' must not invent placeholder values');
  }
});

test('finalist route registry contains identifiers only, not copied club attributes', () => {
  const registry = route('finalists.ts');
  assert.match(registry, /slug\s*:\s*string/);
  assert.match(registry, /registration\s*:\s*string/);
  for (const forbidden of ['club_name', 'puja_name', 'established', 'theme_artist', 'idol_artist', 'address', 'area', 'publishedPhotos', 'hero_image_url']) {
    assert.doesNotMatch(registry, new RegExp('(?:^|[,;{\\s])' + forbidden + '\\s*:', 'm'), 'Forbidden stored finalist field: ' + forbidden);
  }
});

test('public albums use a live eligibility read model and original source IDs', () => {
  const gallery = route('ipgc-gallery.ts');
  assert.match(gallery, /\/rest\/v1\/rpc\/ipgc_public_gallery/);
  assert.match(gallery, /cache:\s*['"]no-store['"]/);
  assert.match(gallery, /registration_ref/);
  assert.match(gallery, /source_id/);
  assert.match(gallery, /source_kind/);
  assert.match(gallery, /if\s*\(!response\.ok\)\s*throw/);
  assert.match(gallery, /gallery-image\?kind=/);
  for (const page of [route('page.tsx'), route('pujo/[slug]/page.tsx')]) {
    assert.match(page, /loadPublishedAlbums\(/);
  }
});

test('no gallery snapshots or invented missing-information strings in app source', () => {
  for (const path of filesUnder(app).filter(p => /\.(tsx?|jsx?)$/.test(p))) {
    const content = source(path).replace(/\/\*[\s\S]*?\*\//g, '');
    assert.doesNotMatch(content, /\bpublishedPhotos\b/, relative(app,path) + ' contains a static gallery collection');
    assert.doesNotMatch(content, /['"`]Not provided['"`]/i, relative(app,path) + ' invents missing-information text');
  }
});
