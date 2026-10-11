// ============================================================
// SamayYudh 2.0 — Avatar System
// Centralized avatar definitions & localStorage persistence.
// Extensible: just add entries to AVATARS to grow the gallery.
// ============================================================

export interface AvatarDef {
  id: string;
  src: string;
  label: string;
}

/**
 * All available avatars.
 * To add more, simply append entries here and drop the image in public/avatars/.
 */
export const AVATARS: AvatarDef[] = [
  { id: 'red-hoodie',         src: '/avatars/avatar-red-hoodie.jpg',         label: 'Red Hoodie' },
  { id: 'dual-hoodie',        src: '/avatars/avatar-dual-hoodie.jpg',        label: 'Dual Hoodie' },
  { id: 'dark-bun',           src: '/avatars/avatar-dark-bun.jpg',           label: 'Dark Bun' },
  { id: 'blue-short',         src: '/avatars/avatar-blue-short.jpg',         label: 'Blue Short' },
  { id: 'straight-black',     src: '/avatars/avatar-straight-black.jpg',     label: 'Straight Hair' },
  { id: 'curly-glasses',      src: '/avatars/avatar-curly-glasses.jpg',      label: 'Curly Glasses' },
  { id: 'center-part',        src: '/avatars/avatar-center-part.jpg',        label: 'Center Part' },
  { id: 'cool-cat',           src: '/avatars/avatar-cool-cat.jpg',           label: 'Cool Cat' },
  { id: 'flower-bear',        src: '/avatars/avatar-flower-bear.jpg',        label: 'Flower Cap' },
  { id: 'hacker-hoodie',      src: '/avatars/avatar-hacker-hoodie.jpg',      label: 'Hacker Hoodie' },
  { id: 'cat-hat-girl',       src: '/avatars/avatar-cat-hat-girl.jpg',       label: 'Cat Head' },
  { id: 'rockstar-girl',      src: '/avatars/avatar-rockstar-girl.jpg',      label: 'Rockstar' },
  { id: 'spidey-cat',         src: '/avatars/avatar-spidey-cat.jpg',         label: 'Spidey Cat' },
  { id: 'spunky-pigtails',    src: '/avatars/avatar-spunky-pigtails.jpg',    label: 'Pigtails' },
  { id: 'heart-glasses',      src: '/avatars/avatar-heart-glasses.jpg',      label: 'Heart Glasses' },
  { id: 'baby-hoodie',        src: '/avatars/avatar-baby-hoodie.jpg',        label: 'Baby Hoodie' },
  { id: 'smug-boy',           src: '/avatars/avatar-smug-boy.jpg',           label: 'Smug Boy' },
  { id: 'side-eye',           src: '/avatars/avatar-side-eye.jpg',           label: 'Side Eye' },
  { id: 'ice-cream-happy',        src: '/avatars/avatar-ice-cream-happy.jpg',        label: 'Ice Cream' },
  { id: 'chubby-cheeks',          src: '/avatars/avatar-chubby-cheeks.jpg',          label: 'Chubby Cheeks' },
  { id: 'wolf-clapping',          src: '/avatars/avatar-wolf-clapping.jpg',          label: 'Applause' },
  { id: 'baby-smirk',             src: '/avatars/avatar-baby-smirk.jpg',             label: 'Baby Smirk' },
  { id: 'pouting-kid',            src: '/avatars/avatar-pouting-kid.jpg',            label: 'Pouting Kid' },
  { id: 'baby-round-glasses',     src: '/avatars/avatar-baby-round-glasses.jpg',     label: 'Little Scholar' },
];

const STORAGE_KEY = 'samayyudh_selected_avatar';

/** Read the persisted avatar id from localStorage. */
export function getSelectedAvatarId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

/** Persist the selected avatar id to localStorage and notify listeners. */
export function setSelectedAvatarId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, id);
  window.dispatchEvent(new CustomEvent('samayyudh:avatar-change', { detail: { avatarId: id } }));
}

/** Clear the selected avatar (revert to initials) and notify listeners. */
export function clearSelectedAvatar(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('samayyudh:avatar-change', { detail: { avatarId: null } }));
}

/** Resolve the full avatar definition from the stored id. Returns null if nothing selected / not found. */
export function getSelectedAvatar(): AvatarDef | null {
  const id = getSelectedAvatarId();
  if (!id) return null;
  return AVATARS.find(a => a.id === id) ?? null;
}
