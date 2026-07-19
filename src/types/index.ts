export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'youtube' | 'google' | 'whatsapp' | 'tiktok';
  url: string;
  label: string;
}

export interface BusinessHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface StatItem {
  value: string;
  label: string;
  icon?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
  icon: string;
}

export interface SiteConfig {
  business: {
    name: string;
    legalName?: string;
    tagline: string;
    description: string;
    foundedYear: number;
    email: string;
    phone: string;
    whatsapp?: string;
    address: Address;
    geo: GeoCoordinates;
    hours: BusinessHours;
    socialMedia: SocialLink[];
  };
  site: {
    url: string;
    locale: string;
  };
  theme: {
    logoText?: string;
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultImage: string;
    schemaType: string;
    areaServed: string[];
  };
  navigation: NavItem[];
  stats: StatItem[];
  process: ProcessStep[];
  integrations: {
    forms: {
      provider: 'web3forms';
      accessKey: string;
    };
    supabase?: {
      url: string;
      anonKey: string;
    };
    analytics?: {
      provider: 'google' | 'umami' | 'plausible' | 'none';
      siteId?: string;
      scriptUrl?: string;
      measurementId?: string;
    };
    maps?: {
      embedUrl: string;
    };
  };
  features: {
    blog: boolean;
    team: boolean;
    testimonials: boolean;
    faq: boolean;
    whatsappButton: boolean;
  };
}
