import { FilePreviewModel } from "ngx-awesome-uploader";

/**
 * Information of a card
 */
export interface Card {
  id: number;
  title: string;
  files: FileURL[];
  tags: string[];
  website: string;
  author: string;
  created: Date;
  modified: Date;
}

export interface CardRequest {
  id?: number;
  title: string;
  files: FilePreviewModel[];
  tags: string[];
  website: string;
  author: string;
}

export interface FileURL {
  fileURL: string;
  thumbnailURL: string;
}

export interface Pagination {
  pageIndex: number;
  pageSize: number;
  pageLength?: number;
}

/**
 * Used to transmit data between {@link NavMenuComponent} and {@link CardListComponent} in a single batch
 */
export interface CardResult {
  cards: Card[],
  pagination: Pagination
}

export interface TagResult {
  tags: string[]
}

export interface OperationResponse {
  message: string;
  results?: Card[];
}

/**
 * Sorting options of the app
 */
export interface Sorting {
  sort: number;
  order: number;
}

export type Status = 'Create' | 'Edit' | 'Search';
