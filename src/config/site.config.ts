import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  business: {
    name: 'ElectriPro Servicios Integrales',
    legalName: 'ElectriPro S.R.L.',
    tagline: 'Soluciones eléctricas profesionales para hogares, comercios y edificios',
    description:
      'Servicio integral de reparaciones eléctricas con más de 15 años de experiencia. Electricidad residencial, comercial, edificios, seguridad e higiene y asesoría de construcción en Buenos Aires.',
    foundedYear: 2010,
    email: 'contacto@electripro.com',
    phone: '+54 11 1234-5678',
    whatsapp: '5491112345678',
    address: {
      street: 'Av. Corrientes 1234',
      city: 'Buenos Aires',
      state: 'CABA',
      zip: 'C1043',
      country: 'AR',
    },
    geo: {
      latitude: -34.6037,
      longitude: -58.3816,
    },
    hours: {
      weekdays: 'Lunes a Viernes: 08:00 - 18:00',
      saturday: 'Sábados: 09:00 - 13:00',
      sunday: 'Domingos: Cerrado',
    },
    socialMedia: [
      { platform: 'instagram', url: 'https://instagram.com/electripro', label: 'Instagram' },
      { platform: 'facebook', url: 'https://facebook.com/electripro', label: 'Facebook' },
      { platform: 'linkedin', url: 'https://linkedin.com/company/electripro', label: 'LinkedIn' },
      { platform: 'google', url: 'https://g.page/electripro', label: 'Google Business' },
    ],
  },

  site: {
    url: 'https://www.electripro.com',
    locale: 'es-AR',
  },

  theme: {
    logoText: 'ElectriPro',
  },

  seo: {
    defaultTitle: 'ElectriPro | Electricista Profesional en Buenos Aires',
    titleTemplate: '%s | ElectriPro',
    defaultImage: '/og-default.jpg',
    schemaType: 'Electrician',
    areaServed: ['Buenos Aires', 'CABA', 'GBA Norte', 'GBA Sur', 'GBA Oeste'],
  },

  navigation: [
    { label: 'Inicio', href: '/' },
    {
      label: 'Servicios',
      href: '/services',
      children: [
        { label: 'Electricidad Residencial', href: '/services/electricidad-residencial' },
        { label: 'Electricidad Comercial', href: '/services/electricidad-comercial' },
        { label: 'Edificios', href: '/services/edificios' },
        { label: 'Seguridad e Higiene', href: '/services/seguridad-e-higiene' },
        { label: 'Asesoría de Construcción', href: '/services/asesoria-de-construccion' },
      ],
    },
    { label: 'Equipo', href: '/team' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contacto', href: '/contact' },
  ],

  stats: [
    { value: '15+', label: 'Años de experiencia', icon: 'lucide:calendar-check' },
    { value: '2.500+', label: 'Proyectos completados', icon: 'lucide:check-circle' },
    { value: '1.200+', label: 'Clientes satisfechos', icon: 'lucide:users' },
    { value: '24hs', label: 'Respuesta de emergencia', icon: 'lucide:clock' },
  ],

  process: [
    {
      title: 'Consulta Inicial',
      description: 'Nos contactás y evaluamos tu necesidad. Podés llamarnos, escribirnos por WhatsApp o completar el formulario.',
      icon: 'lucide:phone-call',
    },
    {
      title: 'Diagnóstico',
      description: 'Visitamos tu ubicación, realizamos un relevamiento técnico completo y te presentamos un presupuesto detallado.',
      icon: 'lucide:search',
    },
    {
      title: 'Ejecución',
      description: 'Nuestro equipo de profesionales matriculados realiza el trabajo cumpliendo todas las normas de seguridad.',
      icon: 'lucide:wrench',
    },
    {
      title: 'Garantía',
      description: 'Entregamos certificación de los trabajos realizados con garantía escrita. Seguimiento post-servicio incluido.',
      icon: 'lucide:shield-check',
    },
  ],

  integrations: {
    forms: {
      provider: 'web3forms',
      accessKey: 'YOUR_WEB3FORMS_ACCESS_KEY',
    },
    analytics: {
      provider: 'none',
    },
    maps: {
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168878895463!2d-58.38375!3d-34.6037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzEzLjMiUyA1OMKwMjMnMDEuNSJX!5e0!3m2!1ses!2sar!4v1234567890',
    },
  },

  features: {
    blog: true,
    team: true,
    testimonials: true,
    faq: true,
    whatsappButton: true,
  },
};
