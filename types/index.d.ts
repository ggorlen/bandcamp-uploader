import { Page } from "puppeteer";

export interface Track {
  file: string;
  title: string;
  price: string;
  enablePurchase: boolean;
  fansPayIfWant: boolean;
  requireEmail: boolean;
  about?: string;
  lyrics?: string;
  credits?: string;
  artist?: string;
}

export interface Album {
  private: boolean;
  title: string;
  artist: string;
  art: string;
  price: string;
  about: string;
  release_date: string;
  tags: string;
  cat_number: string;
  upc?: string;
  credits: string;
  enablePayMore: boolean;
  enablePreorder: boolean;
  tracks: Track[];
}

export function uploadAlbumForPage(
  page: Page,
  album: Album,
  creds: { username: string; password: string }
): Promise<void>;

export function uploadAlbum(
  album: Album,
  creds: { username: string; password: string }
): Promise<void>;

