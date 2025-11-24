// Shared types across all packages
export type SyncItemType = "text" | "link" | "image";

export interface SyncItem {
  _id: string;
  userId: string;
  type: SyncItemType;
  content: string;
  metadata: {
    source: "web" | "cli" | "mobile";
    userAgent?: string;
    createdAt: number;
    updatedAt: number;
  };
  encryptedContent: string;
  iv: string;
  salt: string;
}

export interface User {
  _id: string;
  email: string;
  passwordHash: string;
  storageUsed: number;
  storageLimit: number;
  createdAt: number;
}

export interface ApiKey {
  _id: string;
  userId: string;
  key: string; // hashed
  name: string;
  lastUsed: number;
  createdAt: number;
}

