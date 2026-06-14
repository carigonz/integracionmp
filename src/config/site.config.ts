import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  business: {
    name: 'IntegracionMP Servicios Eléctricos',
    legalName: 'IntegracionMP',
    tagline: 'Soluciones eléctricas confiables para hogares, comercios y edificios',
    description:
      'Servicio integral de reparaciones eléctricas con más de 10 años de experiencia. Electricidad residencial, comercial, edificios y emergencias 24/7 en Gran Buenos Aires.',
    foundedYear: 2015,
    email: 'info@integracionmp.com.ar',
    phone: '+54 11 7364-4604',
    whatsapp: '5491173644604',
    address: {
      street: '',
      city: 'Gran Buenos Aires',
      state: 'Buenos Aires',
      zip: '',
      country: 'AR',
    },
    geo: {
      latitude: -34.6037,
      longitude: -58.3816,
    },
    hours: {
      weekdays: 'Lunes a Viernes: 08:00 - 18:00',
      saturday: 'Sábados: 09:00 - 14:00',
      sunday: 'Emergencias 24/7',
    },
    socialMedia: [
      { platform: 'instagram', url: 'https://instagram.com/integracionmp', label: 'Instagram' },
      { platform: 'whatsapp', url: 'https://wa.me/5491173644604', label: 'WhatsApp' },
    ],
  },

  site: {
    url: 'https://www.integracionmp.com',
    locale: 'es-AR',
  },

  theme: {
    logoText: 'IntegracionMP',
  },

  seo: {
    defaultTitle: 'IntegracionMP | Electricista Profesional en Gran Buenos Aires',
    titleTemplate: '%s | IntegracionMP',
    defaultImage: '/og-default.jpg',
    schemaType: 'Electrician',
    areaServed: ['Gran Buenos Aires', 'GBA Norte', 'GBA Sur', 'GBA Oeste', 'GBA Este'],
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
        { label: 'Emergencias 24/7', href: '/services/emergencias' },
      ],
    },
    { label: 'Nosotros', href: '/about' },
    { label: 'Contacto', href: '/contact' },
  ],

  stats: [
    { value: '10+', label: 'Años de experiencia', icon: 'lucide:calendar-check' },
    { value: '1.500+', label: 'Proyectos completados', icon: 'lucide:check-circle' },
    { value: '800+', label: 'Clientes satisfechos', icon: 'lucide:users' },
    { value: '24/7', label: 'Emergencias disponibles', icon: 'lucide:clock' },
  ],

  process: [
    {
      title: 'Contacto',
      description: 'Comunicate por WhatsApp o email y contanos tu necesidad. Atención rápida y personalizada.',
      icon: 'lucide:phone-call',
    },
    {
      title: 'Presupuesto',
      description: 'Evaluamos tu caso y te enviamos un presupuesto sin cargo. Para trabajos complejos, visitamos el lugar.',
      icon: 'lucide:file-text',
    },
    {
      title: 'Trabajo Profesional',
      description: 'Realizamos el servicio con personal matriculado, cumpliendo todas las normas de seguridad eléctrica.',
      icon: 'lucide:wrench',
    },
    {
      title: 'Garantía',
      description: 'Todos nuestros trabajos incluyen garantía escrita y seguimiento post-servicio.',
      icon: 'lucide:shield-check',
    },
  ],

  integrations: {
    forms: {
      provider: 'web3forms',
      accessKey: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? 'YOUR_WEB3FORMS_ACCESS_KEY',
    },
    analytics: {
      provider: 'none',
    },
    maps: {
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168878895463!2d-58.38375!3d-34.6037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzEzLjMiUyA1OMKwMjMnMDEuNSJX!5e0!3m2!1ses!2sar!4v1234567890',
    },
  },

  features: {
    blog: false,
    team: false,
    testimonials: false,
    faq: true,
    whatsappButton: true,
  },
};
