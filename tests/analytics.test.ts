import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('../public/js/analytics.js', import.meta.url), 'utf8');

function setup(globalPrivacyControl = false, choice: string | null = null, storageFails = false) {
  let reloads = 0;
  let loaders = 0;
  const dataLayer: ArrayLike<unknown>[] = [];
  let activeElement: unknown = null;
  const nodes = Object.fromEntries(['consent', 'settings', 'allow', 'deny', 'status'].map((name) => {
    const listeners: Record<string, () => void> = {};
    const node = {
      hidden: name === 'consent' || name === 'settings',
      disabled: false,
      textContent: '',
      addEventListener: (event: string, listener: () => void) => { listeners[event] = listener; },
      focus: () => { if (!node.disabled && !node.hidden) activeElement = node; },
      click: () => { if (!node.disabled) listeners.click?.(); },
    };
    return [name, node];
  }));
  const document = {
    referrer: '', title: 'Utilitas',
    querySelector: (selector: string) => selector.startsWith('meta')
      ? { getAttribute: (key: string) => key === 'content' ? 'G-FEXQ1TD4Z4' : 'utilitas.app' }
      : nodes[selector.replace('[data-analytics-', '').replace(']', '')],
    head: { appendChild: () => { loaders++; } },
    createElement: () => ({}),
  };
  const window = {
    dataLayer,
    location: { hostname: 'utilitas.app', origin: 'https://utilitas.app', pathname: '/', reload: () => { reloads++; } },
    localStorage: {
      getItem: () => { if (storageFails) throw new Error('Storage unavailable'); return choice; },
      setItem: (_key: string, value: string) => { if (storageFails) throw new Error('Storage unavailable'); choice = value; },
    },
    history: {}, addEventListener: () => {},
  };
  runInNewContext(source, { document, window, navigator: { globalPrivacyControl }, URL });
  return {
    nodes, active: () => activeElement,
    reloads: () => reloads, loaders: () => loaders,
    commands: () => dataLayer.map((entry) => Array.from(entry)),
    clearChoice: () => { choice = null; },
  };
}

describe('analytics choices keyboard focus', () => {
  it.each(['allow', 'deny'])('returns focus to settings after choosing %s', (button) => {
    const { nodes, active } = setup();
    nodes[button].focus();
    nodes[button].click();
    expect(nodes.consent.hidden).toBe(true);
    expect(nodes.settings.hidden).toBe(false);
    expect(active()).toBe(nodes.settings);
  });

  it('focuses the enabled deny action when GPC prevents allowing analytics', () => {
    const { nodes, active } = setup(true);
    nodes.settings.focus();
    nodes.settings.click();
    expect(nodes.allow.disabled).toBe(true);
    expect(nodes.settings.hidden).toBe(true);
    expect(nodes.consent.hidden).toBe(false);
    expect(active()).toBe(nodes.deny);
  });

  it('does not steal focus when initializing a saved choice', () => {
    const { nodes, active } = setup(false, 'denied');
    expect(nodes.settings.hidden).toBe(false);
    expect(active()).toBe(null);
  });
});

describe('analytics withdrawal without a saved grant', () => {
  it.each(['unavailable', 'cleared'])('revokes loaded analytics when storage is %s', (storage) => {
    const app = setup(false, null, storage === 'unavailable');
    app.nodes.allow.click();
    expect(app.loaders()).toBe(1);
    app.clearChoice();
    app.nodes.settings.click();
    app.nodes.deny.click();
    expect(app.commands().at(-1)).toEqual(['consent', 'update', { analytics_storage: 'denied' }]);
    expect(app.reloads()).toBe(1);
    expect(app.active()).toBe(app.nodes.settings);
  });

  it('does not load or reload analytics when denied before any grant', () => {
    const app = setup(false, null, true);
    app.nodes.deny.click();
    expect(app.loaders()).toBe(0);
    expect(app.commands()).toEqual([]);
    expect(app.reloads()).toBe(0);
  });

  it('continues to revoke a normally persisted grant', () => {
    const app = setup(false, 'granted');
    app.nodes.settings.click();
    app.nodes.deny.click();
    expect(app.commands().at(-1)).toEqual(['consent', 'update', { analytics_storage: 'denied' }]);
    expect(app.reloads()).toBe(1);
  });
});
