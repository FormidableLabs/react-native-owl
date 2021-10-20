import React from 'react';
import Link from '@docusaurus/Link';
import { useThemeConfig } from '@docusaurus/theme-common';

import styles from './styles.module.css';

const FormidableLogo =
  require('../../../static/images/formidable-logo.svg').default;

export default function Footer() {
  const { footer } = useThemeConfig();
  const links = footer.links ?? [];

  return (
    <footer className="footer footer--dark">
      <div className="container container--fluid">
        <FormidableLogo className={styles.footerLogo} />
      </div>

      <div className="container container--fluid">
        {links && links.length > 0 && (
          <div className="footer__links">
            {links.map((linkItem, i) => (
              <div key={i} className="margin-vert--md">
                {linkItem.title && (
                  <h4 className="footer__title">{linkItem.title}</h4>
                )}
                {linkItem.items != null &&
                Array.isArray(linkItem.items) &&
                linkItem.items.length > 0
                  ? linkItem.items.map((item, key) => (
                      <span key={item.to}>
                        <Link className="footer__link-item" to={item.to}>
                          {item.label}
                        </Link>
                        {key !== linkItem.items.length - 1 && (
                          <span className="footer__link-separator">·</span>
                        )}
                      </span>
                    ))
                  : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="container container--fluid">
        <small className="footer__copyright">
          Copyright © {new Date().getFullYear()} Formidable Labs, LLC.
        </small>
      </div>
    </footer>
  );
}
