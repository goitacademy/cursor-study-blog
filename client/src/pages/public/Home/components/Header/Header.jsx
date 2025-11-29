import React from 'react'
import { Input, Button, Tag, theme } from 'antd'
import { SearchOutlined, StarFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'
import { LAYOUT } from '@/constants/ui'
import './Header.css'

const { Search } = Input

function Header() {
  const { setInput, input } = useAppContext()
  const { token } = theme.useToken()
  const { t } = useTranslation()

  const handleSearch = (value) => {
    setInput(value)
  }

  const handleClear = () => {
    setInput('')
  }

  return (
    <div
      className="header-section"
      style={{
        padding: `${token.paddingXL * 2}px ${token.paddingXL * 2}px ${token.paddingXL}px`,
        background: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorBgContainer} 100%)`
      }}
    >
      <div
        className="header-content"
        style={{
          maxWidth: LAYOUT.CONTENT_MAX_WIDTH,
          margin: '0 auto'
        }}
      >
        <Tag
          icon={<StarFilled />}
          color="volcano"
          style={{
            marginBottom: token.marginLG,
            padding: `${token.paddingXXS}px ${token.paddingMD}px`,
            fontSize: token.fontSize,
            borderRadius: token.borderRadiusLG * 2
          }}
        >
          {t('header.tagline')}
        </Tag>

        <h1
          className="header-title"
          style={{
            fontSize: token.fontSizeHeading1 * 1.8,
            fontWeight: token.fontWeightStrong,
            color: token.colorText,
            marginBottom: token.marginLG
          }}
        >
          {t('header.title')} <span style={{ color: token.colorPrimary }}>{t('header.titleHighlight')}</span><br /> {t('header.titleEnd')}
        </h1>

        <p
          style={{
            fontSize: token.fontSizeLG,
            color: token.colorTextSecondary,
            marginBottom: token.marginXL,
            maxWidth: LAYOUT.CARD_MAX_WIDTH,
            margin: `0 auto ${token.marginXL}px`
          }}
        >
          {t('header.description')}
        </p>

        <div
          className="header-search-container"
          style={{ maxWidth: LAYOUT.CARD_MAX_WIDTH }}
        >
          <Search
            placeholder={t('header.searchPlaceholder')}
            enterButton={
              <Button
                type="primary"
                icon={<SearchOutlined />}
                style={{ height: token.controlHeightLG + 8 }}
              >
                {t('common.search')}
              </Button>
            }
            size="large"
            onSearch={handleSearch}
            defaultValue={input}
            style={{
              borderRadius: token.borderRadius,
            }}
            styles={{
              input: {
                height: token.controlHeightLG + 8,
                fontSize: token.fontSizeLG
              }
            }}
          />
          {input && (
            <Button
              type="text"
              onClick={handleClear}
              style={{
                marginTop: token.marginMD,
                color: token.colorTextSecondary
              }}
            >
              {t('common.clearSearch')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header

