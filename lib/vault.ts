'use client';

import { STORAGE_KEYS, type StorageKey } from '@/lib/storage-keys';

type EncryptedPayload = {
  iv: string;
  ct: string;
};

type VaultMeta = {
  version: 1;
  enabledAt: string;
  salt: string;
  iterations: number;
  verifier: EncryptedPayload;
};

const VAULT_META_KEY = 'jt_vault_meta_v1';
const VAULT_DATA_PREFIX = 'jt_vault_data__';
const VERIFY_PLAINTEXT = 'jt_vault_verifier_v1';
const DEFAULT_ITERATIONS = 210_000;

let vaultKey: CryptoKey | null = null;

function isBrowser() {
  return typeof window !== 'undefined';
}

function notifyVaultChange() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event('jt_vault_change'));
}

function getCrypto() {
  return globalThis.crypto;
}

function encodeUtf8(value: string) {
  return new TextEncoder().encode(value);
}

function decodeUtf8(value: ArrayBuffer) {
  return new TextDecoder().decode(value);
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function getMeta(): VaultMeta | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(VAULT_META_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as VaultMeta;
  } catch {
    return null;
  }
}

function setMeta(meta: VaultMeta | null) {
  if (!isBrowser()) return;
  if (!meta) {
    window.localStorage.removeItem(VAULT_META_KEY);
    return;
  }
  window.localStorage.setItem(VAULT_META_KEY, JSON.stringify(meta));
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations: number
) {
  const crypto = getCrypto();
  const normalizedSalt = new Uint8Array(salt);
  const material = await crypto.subtle.importKey(
    'raw',
    encodeUtf8(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: normalizedSalt, iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptString(
  key: CryptoKey,
  plaintext: string
): Promise<EncryptedPayload> {
  const crypto = getCrypto();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodeUtf8(plaintext)
  );
  return { iv: bytesToBase64(iv), ct: bytesToBase64(new Uint8Array(ct)) };
}

async function decryptString(
  key: CryptoKey,
  payload: EncryptedPayload
): Promise<string> {
  const crypto = getCrypto();
  const iv = base64ToBytes(payload.iv);
  const ct = base64ToBytes(payload.ct);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  return decodeUtf8(pt);
}

function vaultDataKey(key: StorageKey) {
  return `${VAULT_DATA_PREFIX}${key}`;
}

export function isVaultEnabled() {
  return Boolean(getMeta());
}

export function isVaultUnlocked() {
  return Boolean(vaultKey);
}

export function lockVault() {
  vaultKey = null;
  notifyVaultChange();
}

export async function unlockVault(password: string) {
  const meta = getMeta();
  if (!meta) return false;
  try {
    const key = await deriveKey(
      password,
      base64ToBytes(meta.salt),
      meta.iterations
    );
    const verifier = await decryptString(key, meta.verifier);
    if (verifier !== VERIFY_PLAINTEXT) return false;
    vaultKey = key;
    notifyVaultChange();
    return true;
  } catch {
    return false;
  }
}

async function migrateIntoVault(key: CryptoKey) {
  const targets: StorageKey[] = [
    STORAGE_KEYS.draft,
    STORAGE_KEYS.history,
    STORAGE_KEYS.bookmarks,
    STORAGE_KEYS.readingProgress,
  ];

  for (const target of targets) {
    const plaintext = window.localStorage.getItem(target);
    if (plaintext === null) continue;
    const encrypted = await encryptString(key, plaintext);
    window.localStorage.setItem(
      vaultDataKey(target),
      JSON.stringify(encrypted)
    );
    window.localStorage.removeItem(target);
  }
}

export async function enableVault(password: string) {
  if (!isBrowser()) return;
  const crypto = getCrypto();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt, DEFAULT_ITERATIONS);
  const verifier = await encryptString(key, VERIFY_PLAINTEXT);

  const meta: VaultMeta = {
    version: 1,
    enabledAt: new Date().toISOString(),
    salt: bytesToBase64(salt),
    iterations: DEFAULT_ITERATIONS,
    verifier,
  };

  setMeta(meta);
  await migrateIntoVault(key);
  vaultKey = key;
  notifyVaultChange();
}

async function migrateOutOfVault(key: CryptoKey) {
  const targets: StorageKey[] = [
    STORAGE_KEYS.draft,
    STORAGE_KEYS.history,
    STORAGE_KEYS.bookmarks,
    STORAGE_KEYS.readingProgress,
  ];

  for (const target of targets) {
    const raw = window.localStorage.getItem(vaultDataKey(target));
    if (!raw) continue;
    try {
      const payload = JSON.parse(raw) as EncryptedPayload;
      const plaintext = await decryptString(key, payload);
      window.localStorage.setItem(target, plaintext);
      window.localStorage.removeItem(vaultDataKey(target));
    } catch {
      // If something is corrupt, keep the encrypted blob to avoid data loss.
    }
  }
}

export async function disableVault() {
  if (!isBrowser()) return;
  const meta = getMeta();
  if (!meta || !vaultKey) throw new Error('vault_locked');
  await migrateOutOfVault(vaultKey);
  setMeta(null);
  vaultKey = null;
  notifyVaultChange();
}

export async function changeVaultPassword(newPassword: string) {
  if (!isBrowser()) return;
  const meta = getMeta();
  if (!meta || !vaultKey) throw new Error('vault_locked');

  // Decrypt all known items with old key, then re-encrypt with new key + new salt.
  const crypto = getCrypto();
  const newSalt = crypto.getRandomValues(new Uint8Array(16));
  const newKey = await deriveKey(newPassword, newSalt, DEFAULT_ITERATIONS);

  const targets: StorageKey[] = [
    STORAGE_KEYS.draft,
    STORAGE_KEYS.history,
    STORAGE_KEYS.bookmarks,
    STORAGE_KEYS.readingProgress,
  ];

  for (const target of targets) {
    const raw = window.localStorage.getItem(vaultDataKey(target));
    if (!raw) continue;
    const payload = JSON.parse(raw) as EncryptedPayload;
    const plaintext = await decryptString(vaultKey, payload);
    const reencrypted = await encryptString(newKey, plaintext);
    window.localStorage.setItem(
      vaultDataKey(target),
      JSON.stringify(reencrypted)
    );
  }

  const verifier = await encryptString(newKey, VERIFY_PLAINTEXT);
  const nextMeta: VaultMeta = {
    version: 1,
    enabledAt: meta.enabledAt,
    salt: bytesToBase64(newSalt),
    iterations: DEFAULT_ITERATIONS,
    verifier,
  };
  setMeta(nextMeta);
  vaultKey = newKey;
  notifyVaultChange();
}

export function getVaultStatus() {
  return { enabled: isVaultEnabled(), unlocked: isVaultUnlocked() };
}

export async function getRaw(key: StorageKey): Promise<string | null> {
  if (!isBrowser()) return null;
  const meta = getMeta();
  if (!meta) return window.localStorage.getItem(key);
  if (!vaultKey) return null;
  const raw = window.localStorage.getItem(vaultDataKey(key));
  if (!raw) return null;
  const payload = JSON.parse(raw) as EncryptedPayload;
  return decryptString(vaultKey, payload);
}

export async function setRaw(
  key: StorageKey,
  value: string | null
): Promise<void> {
  if (!isBrowser()) return;
  const meta = getMeta();
  if (!meta) {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
    return;
  }
  if (!vaultKey) throw new Error('vault_locked');
  if (value === null) {
    window.localStorage.removeItem(vaultDataKey(key));
    return;
  }
  const payload = await encryptString(vaultKey, value);
  window.localStorage.setItem(vaultDataKey(key), JSON.stringify(payload));
}
