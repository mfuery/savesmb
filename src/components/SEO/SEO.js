import React from "react"
import Helmet from "react-helmet"
import { StaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"
import SchemaOrg from "./SchemaOrg"

const SEO = ({ postData, frontmatter = {}, postImage, isBusinessPost }) => (
  <StaticQuery
    query={graphql`
      {
        site {
          siteMetadata {
            title
            description
            siteUrl
            image
            organization {
              name
              url
              logo
            }
            social {
              twitter
              fbAppID
              instagram
            }
          }
        }
      }
    `}
    render={({ site: { siteMetadata: seo } }) => {
      const postMeta =
        frontmatter || postData.childMarkdownRemark.frontmatter || {}

      const title = postMeta.title || seo.title
      const description = postMeta.description || seo.description
      const image = postImage ? `${seo.siteUrl}${postImage}` : seo.image
      const url = postMeta.slug
        ? `${seo.siteUrl}/${postMeta.slug}/`
        : seo.siteUrl
      const datePublished = isBusinessPost ? postMeta.datePublished : false

      return (
        <React.Fragment>
          <Helmet>
            {/* General tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="image" content={image} />
            <link rel="canonical" href={url} />

            {/* OpenGraph tags */}
            <meta property="og:url" content={url} />
            {isBusinessPost ? (
              <meta property="og:type" content="article" />
            ) : null}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="fb:app_id" content={seo.social.fbAppID} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={seo.social.twitter} />
            <meta name="twitter:creator" content={seo.social.twitter} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
          </Helmet>
          <SchemaOrg
            isBusinessPost={isBusinessPost}
            url={url}
            title={title}
            image={image}
            description={description}
            datePublished={datePublished}
            siteUrl={seo.siteUrl}
            author={seo.author}
            organization={seo.organization}
            defaultTitle={seo.title}
          />
        </React.Fragment>
      )
    }}
  />
)

SEO.propTypes = {
  isBusinessPost: PropTypes.bool,
  postData: PropTypes.shape({
    childMarkdownRemark: PropTypes.shape({
      frontmatter: PropTypes.any,
      excerpt: PropTypes.any,
    }),
  }),
  postImage: PropTypes.string,
}

SEO.defaultProps = {
  isBusinessPost: false,
  postData: { childMarkdownRemark: {} },
  postImage: null,
}

export default SEO
