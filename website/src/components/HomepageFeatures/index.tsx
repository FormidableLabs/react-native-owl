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
        Owl was designed make it easy to add visual regression testing to your
        react native app.
      </>
    ),
  },
  {
    title: 'Compare screenshots taken',
    Svg: require('../../../static/images/homepage/undraw_docusaurus_tree.svg')
      .default,
    description: (
      <>We've created a simple api for capturing and comparing screenshots.</>
    ),
  },
  {
    title: 'View the differences',
    Svg: require('../../../static/images/homepage/visual-example.svg').default,
    svgClassName: styles.visualExample,
    description: (
      <>
        Owl clearly highlights all visual differences, so no need to play
        spot-the-difference yourself!
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
