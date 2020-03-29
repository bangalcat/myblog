import { Link } from 'gatsby';
import React, { ReactElement } from 'react';
import { rhythm } from '../utils/typography';

export default function PostLink({ post }): ReactElement {
  const title = post?.frontmatter?.title || post?.fields?.slug;
  console.log(post?.fields?.slug);
  return (
    <article>
      <header>
        <h3
          style={{
            marginBottom: rhythm(1 / 4),
          }}
        >
          <Link style={{ boxShadow: `none` }} to={post?.fields?.slug || ''}>
            {title}
          </Link>
        </h3>
        <small>{post?.frontmatter?.createdDate}</small>
      </header>
      <section>
        <p
          dangerouslySetInnerHTML={{
            __html: post?.frontmatter?.description || post.excerpt || '',
          }}
        />
      </section>
    </article>
  );
}
