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

export enum MicrosoftSmtpServers {
  outlook = 'smtp-mail.outlook.com',
  office365 = 'smtp.office365.com',
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
    host: MicrosoftSmtpServers.outlook,
    port: 587,
  },
  [ProviderEnum.zoho]: {
    host: 'smtp.zoho.com',
    port: 465,
  },
} as const;

export enum ProviderCallbackParams {
  SUCCESS = "success",
  FAILED = "failed",
}
