import React, { useState, useMemo } from 'react'
import { Tabs, Card, Row, Col, Tag, Empty, theme } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'
import { BLOG_CATEGORIES } from '@/constants/categories'
import { truncateHtml } from '@/utils/formatters'
import { getBlogDetailPath } from '@/constants/routes'
import { IMAGE, RICH_TEXT } from '@/constants/ui'
import './BlogList.css'

function BlogList() {
  const [activeCategory, setActiveCategory] = useState('All')
  const { blogs, input } = useAppContext()
  const navigate = useNavigate()
  const { token } = theme.useToken()
  const { t } = useTranslation()

  const filteredBlogs = useMemo(() => {
    let result = blogs

    if (input) {
      result = result.filter((blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
      )
    }

    if (activeCategory !== 'All') {
      result = result.filter((blog) => blog.category === activeCategory)
    }

    return result
  }, [blogs, input, activeCategory])

  const tabItems = BLOG_CATEGORIES.map(category => ({
    key: category,
    label: category,
  }))

  return (
    <div
      className="blog-list-container"
      style={{ padding: `${token.paddingXL}px ${token.paddingXL * 2}px` }}
    >
      <Tabs
        activeKey={activeCategory}
        onChange={setActiveCategory}
        items={tabItems}
        centered
        size="large"
        type="card"
        style={{ marginBottom: token.marginXL }}
      />

      {filteredBlogs.length === 0 ? (
        <Empty
          description={t('blog.noBlogs')}
          style={{ padding: `${token.paddingXL * 2}px 0` }}
        />
      ) : (
        <Row gutter={[token.marginLG, token.marginLG]}>
          {filteredBlogs.map((blog) => (
            <Col xs={24} sm={12} md={8} lg={6} key={blog._id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={blog.title}
                    src={blog.image}
                    style={{
                      height: IMAGE.BLOG_CARD_HEIGHT,
                      objectFit: 'cover',
                      borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`
                    }}
                  />
                }
                onClick={() => navigate(getBlogDetailPath(blog._id))}
                style={{ borderRadius: token.borderRadiusLG, overflow: 'hidden' }}
                styles={{ body: { padding: token.paddingMD } }}
              >
                <Tag color="volcano" style={{ marginBottom: token.marginSM }}>
                  {blog.category}
                </Tag>
                <Card.Meta
                  title={
                    <div className="blog-card-title" style={{
                      fontSize: token.fontSizeLG,
                      fontWeight: token.fontWeightStrong,
                      marginBottom: token.marginXS
                    }}>
                      {blog.title}
                    </div>
                  }
                  description={
                    <div className="blog-card-description" style={{
                      fontSize: token.fontSize,
                      color: token.colorTextSecondary
                    }}>
                      {truncateHtml(blog.description, RICH_TEXT.TRUNCATE_LENGTH)}
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default BlogList





