import React from 'react';
import Layout from '@theme/Layout';

import { Hero } from '../components/Hero';
import { HomepageFeatures } from '../components/HomepageFeatures';

export default function Home() {
  return (
    <Layout
      title="Visual Regression Testing"
      description="Description will go into a meta tag in <head />"
    >
      <Hero />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
