import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';

import styles from './styles.module.css';

const LogoBadge = require('../../../static/images/badge.svg').default;

const heroExample = `describe('App.tsx', () => {
  it('takes a screenshot of the first screen', async () => {
    const screen = await takeScreenshot('homescreen');

    expect(screen).toMatchBaseline();
  });
});`;

export const Hero = () => {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx('hero hero--dark', styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <LogoBadge className={styles.logoBadge} />
            <h1 className="hero__title">{siteConfig.title}</h1>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/docs/introduction/getting-started"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className={clsx('col col--6', styles.codeSampleWrapper)}>
            <CodeBlock title="App.owl.ts" className="typescript">
              {heroExample}
            </CodeBlock>
          </div>
        </div>
      </div>
    </header>
  );
};
