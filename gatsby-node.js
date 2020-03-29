const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

const kebabCase = arg =>
  arg
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const templates = ['blogPost', 'tagsPage', 'blogPage'].reduce((mem, templateName) => {
      return Object.assign({}, mem, { [templateName]: path.resolve(`./src/templates/${kebabCase(templateName)}.tsx`) });
    }, {});
    graphql(
      `
        {
          allMarkdownRemark(sort: { fields: [frontmatter___createdDate], order: DESC }, limit: 1000) {
            edges {
              node {
                fields {
                  slug
                }
                frontmatter {
                  tags
                  public
                }
              }
            }
          }
        }
      `,
    ).then(result => {
      if (result.errors) {
        return reject(result.errors);
      }

      // Create blog posts pages.
      const posts = result.data.allMarkdownRemark.edges
        .map(p => p.node)
        .filter(node => node.frontmatter.public != false);

      posts
        // .filter(post => post.fields.slug.startsWith('/blog/'))
        .forEach((post, index) => {
          const previous = index === posts.length - 1 ? null : posts[index + 1];
          const next = index === 0 ? null : posts[index - 1];
          createPage({
            path: post.fields.slug,
            component: templates.blogPost,
            context: {
              slug: post.fields.slug,
              previous,
              next,
            },
          });
        });

      /* for tags page */
      // posts
      //   .reduce((mem, post) => {
      //     return [...new Set(mem.concat(post.frontmatter.tags))];
      //   }, [])
      //   .forEach(tag => {
      //     createPage({
      //       path: `/blog/tags/${kebabCase(tag)}/`,
      //       component: templates.tagsPage,
      //       context: {
      //         tag,
      //       },
      //     });
      //   });

      resolve();
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode, basePath: `content/blog/` });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
