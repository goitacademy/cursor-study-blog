import React from 'react'
import { Row, Col, Table, Button, Space, Spin, Typography, Flex, Tooltip, Tag } from 'antd'
import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAdminDashboard } from '@/hooks'
import moment from 'moment'
import { commentApi } from '@/api'
import toast from 'react-hot-toast'
import { DATE_FORMATS, TABLE_SCROLL, COLUMN_WIDTHS } from '@/constants/ui'
import './Dashboard.css'

const { Title, Text } = Typography

function Dashboard() {
  const { dashboardData, loading, refetch } = useAdminDashboard()
  const { t } = useTranslation()

  const handleApproveComment = async (id) => {
    try {
      const response = await commentApi.approve(id)
      if (response.data.success) {
        toast.success(t('messages.success.commentApproved'))
        refetch()
      } else {
        toast.error(response.data.message || t('messages.error.generic'))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || t('messages.error.generic'))
    }
  }

  const handleDeleteComment = async (id) => {
    try {
      const response = await commentApi.delete(id)
      if (response.data.success) {
        toast.success(t('messages.success.commentDeleted'))
        refetch()
      } else {
        toast.error(response.data.message || t('messages.error.generic'))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || t('messages.error.generic'))
    }
  }

  const handleUnapproveComment = async (id) => {
    try {
      const response = await commentApi.unapprove(id)
      if (response.data.success) {
        toast.success(t('messages.success.commentUnapproved'))
        refetch()
      } else {
        toast.error(response.data.message || t('messages.error.generic'))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || t('messages.error.generic'))
    }
  }

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
    },
    {
      title: t('admin.listBlog.columns.comments'),
      dataIndex: 'commentsCount',
      key: 'commentsCount',
      width: COLUMN_WIDTHS.COMMENTS,
      render: (count) => count || 0
    }
  ]

  const commentsColumns = [
    {
      title: t('admin.comments.columns.index'),
      key: 'index',
      width: COLUMN_WIDTHS.INDEX,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: t('admin.comments.columns.comment'),
      dataIndex: 'content',
      key: 'content',
      ellipsis: true
    },
    {
      title: t('admin.comments.columns.actions'),
      key: 'actions',
      width: COLUMN_WIDTHS.ACTIONS_SMALL,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          {!record.isApproved ? (
            <Tooltip title={t('comment.approve')}>
              <Button
                type="default"
                shape="circle"
                size="small"
                icon={<CheckOutlined className="admin-action-icon" />}
                className="admin-action-btn-approve"
                onClick={() => handleApproveComment(record._id)}
              />
            </Tooltip>
          ) : (
            <Tooltip title={t('comment.unapprove')}>
              <Button
                type="default"
                shape="circle"
                size="small"
                icon={<CloseOutlined className="admin-action-icon" />}
                className="admin-action-btn-unapprove"
                onClick={() => handleUnapproveComment(record._id)}
              />
            </Tooltip>
          )}
          <Tooltip title={t('comment.deleteComment')}>
            <Button
              type="default"
              shape="circle"
              size="small"
              icon={<DeleteOutlined className="admin-action-icon" />}
              className="admin-action-btn-delete"
              onClick={() => handleDeleteComment(record._id)}
            />
          </Tooltip>
        </Space>
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
        <Col xs={24} lg={14} className="admin-dashboard-col">
          <div className="admin-dashboard-stats-container">
            <Row gutter={[16, 16]} className="admin-dashboard-stats-row">
              <Col xs={24} sm={8}>
                <div className="admin-stat-card">
                  <Text type="secondary" className="admin-stat-label">
                    {t('admin.dashboard.articles')}
                  </Text>
                  <div className="admin-stat-value">
                    {dashboardData.blogs || 0}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="admin-stat-card">
                  <Text type="secondary" className="admin-stat-label">
                    {t('admin.dashboard.comments')}
                  </Text>
                  <div className="admin-stat-value">
                    {dashboardData.comments || 0}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
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

        <Col xs={24} lg={10} className="admin-dashboard-col">
          <div className="admin-table-section">
            <div className="admin-table-header">
              <Title level={4} className="admin-table-header-title">
                {t('admin.dashboard.latestComments')}
              </Title>
            </div>
            <div className="admin-table-content">
              <Table
                columns={commentsColumns}
                dataSource={dashboardData.recentComments || []}
                rowKey="_id"
                pagination={false}
                size="small"
                scroll={{ x: TABLE_SCROLL.DASHBOARD_COMMENTS }}
                className="admin-dashboard-table"
              />
            </div>
          </div>
        </Col>
      </Row>
    </Flex>
  )
}

export default Dashboard
