import React from 'react';
import { graphql } from 'gatsby';

export const pageQuery = graphql`
  query TemplateTagPage($tag: String) {
    # Get tags
    tags: allMarkdownRemark {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }

    # Get posts
    posts: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___updatedDate] }
      filter: { frontmatter: { tags: { in: [$tag] } }, fileAbsolutePath: { regex: "/blog/" } }
    ) {
      totalCount
      edges {
        node {
          excerpt
          timeToRead
          fields {
            slug
          }
          frontmatter {
            title
            updatedDate(formatString: "DD MMMM, YYYY")
          }
        }
      }
    }
  }
`;
