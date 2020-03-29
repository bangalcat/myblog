import { graphql } from 'gatsby';
import { ITemplateProps } from 'interfaces';
import React from 'react';
import { BlogIndexQuery } from '../../graphql-types';
import Bio from '../components/Bio';
import Layout from '../components/Layout';
import PostLink from '../components/PostLink';
import SEO from '../components/Seo';

type BlogIndexProps = {
  data: BlogIndexQuery;
} & ITemplateProps<{}>;

function BlogIndex(props: BlogIndexProps): React.ReactElement {
  const { data, location } = props;
  const siteTitle = data.site?.siteMetadata?.title || '';
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <Bio />
      {posts.map(({ node }, i) => (
        <PostLink key={node?.fields?.slug || i} post={node} />
      ))}
    </Layout>
  );
}

export default BlogIndex;

export const pageQuery = graphql`
  query BlogIndex {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { public: { ne: false } } }
      sort: { fields: [frontmatter___createdDate], order: DESC }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            createdDate(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`;
