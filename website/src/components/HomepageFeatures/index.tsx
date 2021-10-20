import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Take screenshots from your app',
    Svg: require('../../../static/images/homepage/undraw_docusaurus_mountain.svg')
      .default,
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
    ),
  },
  {
    title: 'Compare screenshots taken',
    Svg: require('../../../static/images/homepage/undraw_docusaurus_tree.svg')
      .default,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
  },
  {
    title: 'Find the differences',
    Svg: require('../../../static/images/homepage/visual-example.svg').default,
    svgClassName: styles.visualExample,
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
    ),
  },
];

export const HomepageFeatures = () => {
  return FeatureList.map(({ Svg, svgClassName, title, description }, idx) => {
    return (
      <section className="container" key={idx}>
        <div className={styles.feature}>
          <h3>{title}</h3>
          <p className="hero__subtitle">{description}</p>

          <div className="padding--md">
            <Svg
              className={svgClassName ? svgClassName : styles.featureSvg}
              alt={title}
            />
          </div>
        </div>
      </section>
    );
  });
};
