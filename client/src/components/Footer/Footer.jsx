import React from 'react'
import { theme } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import { IMAGE } from '@/constants/ui'
import { assets } from '@/assets/assets'
import './Footer.css'

function Footer() {
  const { navigate } = useAppContext()
  const { token } = theme.useToken()
  const { t } = useTranslation()

  const quickLinks = [
    { label: t('footer.allArticles'), onClick: () => navigate(ROUTES.HOME) },
    { label: t('nav.login'), onClick: () => navigate(ROUTES.ADMIN) },
    { label: t('nav.register'), onClick: () => navigate(ROUTES.ADMIN) }
  ]

  const socialLinks = [
    { label: t('footer.instagram'), href: '#' },
    { label: t('footer.twitter'), href: '#' },
    { label: t('footer.facebook'), href: '#' },
    { label: t('footer.youtube'), href: '#' }
  ]

  return (
    <footer
      style={{
        background: token.colorPrimaryBg,
        borderTop: `${token.lineWidthBold * 2}px solid ${token.colorPrimary}`,
        padding: `${token.paddingXL}px ${token.paddingXL * 2}px`,
        marginTop: token.marginXL * 2
      }}
    >
      <div
        className="footer"
        style={{ gap: token.marginXL }}
      >
        <div>
          <div
            className="footer-logo"
            style={{
              gap: token.marginXS,
              marginBottom: token.marginMD,
              fontSize: token.fontSizeHeading4,
              fontWeight: token.fontWeightStrong,
              color: token.colorPrimary
            }}
          >
            <img
              src={assets.sprint}
              alt={t('common.appName')}
              style={{
                width: IMAGE.LOGO_SIZE,
                height: IMAGE.LOGO_SIZE
              }}
            />
            <span>{t('common.appName')}</span>
          </div>
          <p
            style={{
              fontSize: token.fontSize,
              color: token.colorTextSecondary,
              margin: 0
            }}
          >
            {t('common.copyright')}
          </p>
        </div>

        <div
          className="footer-links"
          style={{ gap: token.marginXL * 2 }}
        >
          <div>
            <h3
              style={{
                fontSize: token.fontSizeLG,
                fontWeight: token.fontWeightStrong,
                color: token.colorText,
                marginBottom: token.marginSM,
                marginTop: 0
              }}
            >
              {t('footer.quickLinks')}
            </h3>
            <ul
              className="footer-link-list"
              style={{ gap: token.marginXS }}
            >
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    onClick={link.onClick}
                    className="footer-link"
                    style={{
                      fontSize: token.fontSize,
                      color: token.colorTextSecondary,
                      cursor: 'pointer'
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              style={{
                fontSize: token.fontSizeLG,
                fontWeight: token.fontWeightStrong,
                color: token.colorText,
                marginBottom: token.marginSM,
                marginTop: 0
              }}
            >
              {t('footer.followUs')}
            </h3>
            <ul
              className="footer-link-list"
              style={{ gap: token.marginXS }}
            >
              {socialLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="footer-link"
                    style={{
                      fontSize: token.fontSize,
                      color: token.colorTextSecondary
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer





