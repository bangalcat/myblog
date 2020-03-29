import { graphql, Link } from 'gatsby';
import { ITemplateProps } from 'interfaces';
import React from 'react';
import { BlogPostBySlugQuery } from '../../graphql-types';
import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/Seo';
import { rhythm, scale } from '../utils/typography';

type BlogPostTemplateProps = ITemplateProps<{
  previous: any;
  next: any;
}> & {
  data: BlogPostBySlugQuery;
};

function BlogPostTemplate(props: BlogPostTemplateProps): React.ReactElement {
  const { data, pageContext } = props;
  const siteTitle = data.site?.siteMetadata?.title || '';
  const post = data.markdownRemark;
  const { previous, next } = pageContext;

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title={post?.frontmatter?.title || ''} description={post?.frontmatter?.description || post?.excerpt} />
      <article>
        <header>
          <h1
            style={{
              marginTop: rhythm(1),
              marginBottom: 0,
            }}
          >
            {post?.frontmatter?.title}
          </h1>
          <p
            style={{
              ...scale(-1 / 5),
              display: `block`,
              marginBottom: rhythm(1),
            }}
          >
            {post?.frontmatter?.createdDate}
          </p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post?.html || '' }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <footer>
          <Bio />
        </footer>
      </article>

      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  );
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        createdDate(formatString: "MMMM DD, YYYY")
        updatedDate(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`;
