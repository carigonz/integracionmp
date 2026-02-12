import { siteConfig } from '@/config/site.config';

export function buildLocalBusinessSchema(): Record<string, any> {
  const { business, site, seo } = siteConfig;

  return {
    '@context': 'https://schema.org',
    '@type': seo.schemaType,
    name: business.name,
    legalName: business.legalName,
    description: business.description,
    url: site.url,
    telephone: business.phone,
    email: business.email,
    foundingDate: String(business.foundedYear),
    image: `${site.url}${seo.defaultImage}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      postalCode: business.address.zip,
      addressCountry: business.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00',
      },
    ],
    areaServed: seo.areaServed.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    sameAs: business.socialMedia.map((social) => social.url),
  };
}
