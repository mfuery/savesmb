import React from "react"
import * as PropTypes from "prop-types"
import TagList from "../components/TagList"
import menuTree from "../data/menuTree"
import select from "../components/utils"
import { graphql, Link } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO/SEO"
import Content, { HTMLContent } from "../components/Content"
import { FormattedMessage } from "react-intl"
import PaymentForm from "../components/PaymentForm"

const DonatePageTemplate = ({
  title,
  content,
  contentComponent,
  description,
  tags,
  langKey,
  image,
}) => {
  const PageContent = contentComponent || Content
  const sel = select(langKey)

  return (
    <div className="container content donate">
      <div className="padded-width-container">
        <section className="section">
          <div className="rows is-multiline donate-form">
            <div className="row">
              <h1>Support And Make A Difference</h1>
              <p className="subtitle">
                100% of your donation will support the merchant toward their
                operating costs.{" "}
              </p>
              <div className="donate-step-1">
                <h3>Step 1: Select Donation Amount</h3>
              </div>
              <div className="row donate-step-2">
                <h3>Step 2: Enter Payment Information</h3>
                <p>
                  Your transaction is secure and 100% of the funds will go
                  directly to the owner to help sustain their business.
                </p>
                <PaymentForm paymentForm={window.SqPaymentForm}></PaymentForm>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section className="section">
        <PageContent className="content" content={content} />
        <TagList tags={tags} langKey={langKey} />
      </section>
    </div>
  )
}

DonatePageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

class DonatePage extends React.Component {
  render() {
    let dataMarkdown = []
    let data
    if (this.props.data !== null) {
      dataMarkdown = this.props.data.markdownRemark
      data = this.props.data
    }
    const jsonData = data.allArticlesJson.edges[0].node.articles
    const { frontmatter } = dataMarkdown
    const image = frontmatter.image.childImageSharp.fluid.src
    const langKey = frontmatter.lang
    const tags = frontmatter.tags

    return (
      <Layout
        className="container"
        data={data}
        jsonData={jsonData}
        location={this.props.location}
      >
        <SEO frontmatter={frontmatter} postImage={image} />
        <div>
          <DonatePageTemplate
            title={dataMarkdown.frontmatter.title}
            content={dataMarkdown.html}
            contentComponent={HTMLContent}
            description={frontmatter.description}
            tags={tags}
            langKey={langKey}
            image={dataMarkdown.frontmatter.image}
          />
        </div>
      </Layout>
    )
  }
}

DonatePage.propTypes = {
  data: PropTypes.object.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  langKey: PropTypes.string,
}

export default DonatePage

export const pageQuery = graphql`
  query DonatePageQuery($id: String!) {
    site {
      siteMetadata {
        languages {
          defaultLangKey
          langs
        }
      }
    }
    allArticlesJson(filter: { title: { eq: "home" } }) {
      edges {
        node {
          articles {
            en
            cn
          }
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        id
        title
        description
        tags
        lang
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
              src
            }
          }
        }
      }
      fields {
        slug
      }
    }
  }
`
