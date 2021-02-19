import React from "react"
import Helmet from "react-helmet"

export default React.memo(
  ({
    author,
    siteUrl,
    datePublished,
    defaultTitle,
    description,
    image,
    isBusinessPost,
    organization,
    title,
    url,
  }) => {
    const baseSchema = [
      {
        "@context": "http://schema.org",
        "@type": "WebSite",
        url,
        name: title,
        alternateName: defaultTitle,
      },
    ]

    const schema = isBusinessPost
      ? [
          ...baseSchema,
          {
            "@context": "http://schema.org",
            "@type": "Organization",
            url,
            name: title,
            alternateName: defaultTitle,
            headline: title,
            image: {
              "@type": "ImageObject",
              url: image,
            },
            description,
            mainEntityOfPage: {
              "@type": "WebSite",
              "@id": siteUrl,
            },
          },
        ]
      : baseSchema

    return (
      <Helmet>
        {/* Schema.org tags */}
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
    )
  }
)
