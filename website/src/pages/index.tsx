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
      <main className="container">
        <p>
          This library enables developers to introduce visual regression tests
          to their apps for <strong>iOS</strong> and <strong>Android</strong>.
          Being heavily inspired by{' '}
          <a href="https://wix.github.io/Detox/">Detox</a>, an end-to-end
          testing and automation framework, this library uses a similar API that
          makes setting up react-native-owl and running the tests locally and on
          your preferred CI service, seamless.
        </p>

        {/* REMOVE INITIALLY AS THIS WILL BE DEPLOYED BEFORE THE BLOG IN PUBLISHED
        <p>
          Learn more about the background behind this library in{' '}
          <a href="https://formidable.com/blog/" target="_blank">
            the announcement on the Formidable Blog
          </a>
          .
        </p> */}

        <p>
          <em>
            Note: This library is{' '}
            <a href="/docs/introduction/work-in-progress">work-in-progress</a>.
            We are still working on adding additional functionality to allow
            full control of the app being tested.
          </em>
        </p>

        <HomepageFeatures />
      </main>
    </Layout>
  );
}
