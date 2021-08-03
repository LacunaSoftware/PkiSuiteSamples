export interface TrustServiceAuthParameters {
  serviceInfo: TrustServiceInfo;
  authUrl: string;
}

export interface TrustServiceInfo {
  service: TrustServiceName;
  provider: string;
  badgeUrl: string;
}

export interface TrustServiceName {
  name: string;
}
