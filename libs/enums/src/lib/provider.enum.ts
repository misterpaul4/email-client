export enum ProviderEnum {
  google = 'google',
  outlook = 'outlook',
  zoho = 'zoho'
}

export enum ConnectionType {
  oAuth = 'oAuth',
  appPassword = 'appPassword',
}

export enum ProviderStatus {
  active = 'active',
  inactive = 'inactive',
}

export const ProviderDefaults: Record<
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
  [ProviderEnum.zoho]: {
    host: 'smtp.zoho.com',
    port: 465,
  },
} as const;
