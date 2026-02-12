import { siteConfig } from '@/config/site.config';

export function buildBlogPostingSchema(post: {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  author: string;
  url: string;
}): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.pubDate.toISOString(),
    ...(post.updatedDate && { dateModified: post.updatedDate.toISOString() }),
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.business.name,
      url: siteConfig.site.url,
    },
    url: post.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
  };
}
