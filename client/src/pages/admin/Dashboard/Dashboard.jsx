import React from 'react'
import { Row, Col, Table, Spin, Typography, Flex, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAdminDashboard } from '@/hooks'
import moment from 'moment'
import { DATE_FORMATS, TABLE_SCROLL, COLUMN_WIDTHS } from '@/constants/ui'
import './Dashboard.css'

const { Title, Text } = Typography

function Dashboard() {
  const { dashboardData, loading } = useAdminDashboard()
  const { t } = useTranslation()

  const articlesColumns = [
    {
      title: t('admin.listBlog.columns.index'),
      dataIndex: 'index',
      key: 'index',
      width: COLUMN_WIDTHS.INDEX,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: t('admin.listBlog.columns.blogTitle'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: true
    },
    {
      title: t('admin.listBlog.columns.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: COLUMN_WIDTHS.DATE,
      render: (date) => moment(date).format(DATE_FORMATS.DISPLAY)
    },
    {
      title: t('admin.listBlog.columns.status'),
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: COLUMN_WIDTHS.STATUS,
      render: (isPublished) => (
        <Tag
          color={isPublished ? 'success' : 'volcano'}
          className={isPublished ? 'admin-status-tag-published' : 'admin-status-tag-draft'}
        >
          {isPublished ? t('blog.status.published') : t('blog.status.draft')}
        </Tag>
      )
    }
  ]

  if (loading) {
    return (
      <Flex justify="center" align="center" className="admin-dashboard-loading">
        <Spin size="large" />
      </Flex>
    )
  }

  return (
    <Flex vertical className="admin-dashboard">
      <Title level={2} className="admin-dashboard-title">
        {t('admin.dashboard.title')}
      </Title>

      <Row gutter={[16, 16]} className="admin-dashboard-row">
        <Col xs={24} className="admin-dashboard-col">
          <div className="admin-dashboard-stats-container">
            <Row gutter={[16, 16]} className="admin-dashboard-stats-row">
              <Col xs={24} sm={12}>
                <div className="admin-stat-card">
                  <Text type="secondary" className="admin-stat-label">
                    {t('admin.dashboard.articles')}
                  </Text>
                  <div className="admin-stat-value">
                    {dashboardData.blogs || 0}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="admin-stat-card">
                  <Text type="secondary" className="admin-stat-label">
                    {t('admin.dashboard.drafts')}
                  </Text>
                  <div className="admin-stat-value">
                    {dashboardData.drafts || 0}
                  </div>
                </div>
              </Col>
            </Row>

            <div className="admin-table-section">
              <div className="admin-table-header">
                <Title level={4} className="admin-table-header-title">
                  {t('admin.dashboard.latestArticles')}
                </Title>
              </div>
              <div className="admin-table-content">
                <Table
                  columns={articlesColumns}
                  dataSource={dashboardData.recentBlogs || []}
                  rowKey="_id"
                  pagination={false}
                  size="small"
                  scroll={{ x: TABLE_SCROLL.DASHBOARD_ARTICLES }}
                  className="admin-dashboard-table"
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Flex>
  )
}

export default Dashboard
