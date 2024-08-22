export enum ProviderEnum {
  google = 'google',
  outlook = 'outlook',
}

export enum ConnectionType {
  oAuth = 'oAuth',
  appPassword = 'appPassword',
}

export enum ProviderStatus {
  active = 'active',
  inactive = 'inactive',
}

export const DefaultProviderHostPort: Record<
  ProviderEnum,
  { host: string; port?: number }
> = {
  [ProviderEnum.google]: {
    host: 'smtp.gmail.com',
    port: 465,
  },
  [ProviderEnum.outlook]: {
    host: 'smtp-mail.outlook.com',
    port: 587,
  },
} as const;
