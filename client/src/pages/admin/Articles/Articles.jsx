import React, { useState } from 'react'
import { Table, Button, Space, Typography, Spin, Flex, Segmented, Tag, Tooltip } from 'antd'
import { DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAdminBlogs } from '@/hooks'
import moment from 'moment'
import { blogApi } from '@/api'
import toast from 'react-hot-toast'
import { DATE_FORMATS, SORT_OPTIONS, TABLE_SCROLL, COLUMN_WIDTHS } from '@/constants/ui'
import '../shared/AdminTable.css'
import './Articles.css'

const { Title, Text } = Typography

function Articles() {
  const { blogs, loading, refetch } = useAdminBlogs()
  const { t } = useTranslation()
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.BLOGS[0])

  const handleDelete = async (id) => {
    try {
      const response = await blogApi.deleteBlog(id)
      if (response.data.success) {
        toast.success(t('messages.success.blogDeleted'))
        refetch()
      } else {
        toast.error(response.data.message || t('messages.error.generic'))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || t('messages.error.generic'))
    }
  }

  const handlePublish = async (id) => {
    try {
      const response = await blogApi.publish(id)
      if (response.data.success) {
        toast.success(t('messages.success.blogPublished'))
        refetch()
      } else {
        toast.error(response.data.message || t('messages.error.generic'))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || t('messages.error.generic'))
    }
  }

  const handleUnpublish = async (id) => {
    try {
      const response = await blogApi.unpublish(id)
      if (response.data.success) {
        toast.success(t('messages.success.blogUnpublished'))
        refetch()
      } else {
        toast.error(response.data.message || t('messages.error.generic'))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || t('messages.error.generic'))
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => {
    if (sortBy === t('admin.listBlog.sortLatest') || sortBy === 'Latest') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (sortBy === t('admin.listBlog.sortAZ') || sortBy === 'A-Z') {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  const columns = [
    {
      title: t('admin.listBlog.columns.index'),
      key: 'index',
      width: COLUMN_WIDTHS.INDEX,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: t('admin.listBlog.columns.blogTitle'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: t('admin.listBlog.columns.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: COLUMN_WIDTHS.DATE_LARGE,
      render: (date) => moment(date).format(DATE_FORMATS.DISPLAY_WITH_TIME)
    },
    {
      title: t('admin.listBlog.columns.status'),
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: COLUMN_WIDTHS.STATUS_LARGE,
      render: (isPublished) => (
        <Tag
          color={isPublished ? 'success' : 'warning'}
          className={isPublished ? 'admin-status-tag-published' : 'admin-status-tag-draft'}
        >
          {isPublished ? t('blog.status.published') : t('blog.status.draft')}
        </Tag>
      )
    },
    {
      title: t('admin.listBlog.columns.actions'),
      key: 'actions',
      width: COLUMN_WIDTHS.ACTIONS_MEDIUM,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          {!record.isPublished ? (
            <Tooltip title={t('common.publish')}>
              <Button
                type="default"
                shape="circle"
                size="small"
                icon={<CheckOutlined className="admin-action-icon" />}
                className="admin-action-btn-approve"
                onClick={() => handlePublish(record._id)}
              />
            </Tooltip>
          ) : (
            <Tooltip title={t('common.unpublish')}>
              <Button
                type="default"
                shape="circle"
                size="small"
                icon={<CloseOutlined className="admin-action-icon" />}
                className="admin-action-btn-unapprove"
                onClick={() => handleUnpublish(record._id)}
              />
            </Tooltip>
          )}
          <Tooltip title={t('common.delete')}>
            <Button
              type="default"
              shape="circle"
              size="small"
              icon={<DeleteOutlined className="admin-action-icon" />}
              className="admin-action-btn-delete"
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  if (loading) {
    return (
      <Flex justify="center" align="center" className="admin-articles-loading">
        <Spin size="large" />
      </Flex>
    )
  }

  return (
    <Flex vertical className="admin-articles">
      <Flex justify="space-between" align="center" className="admin-page-header admin-articles-header">
        <Title level={1} className="admin-articles-title">
          {t('admin.listBlog.title')}
        </Title>

        <Flex align="center" gap="middle">
          <Text strong className="admin-articles-count">
            {t('admin.listBlog.articlesCount')} {blogs.length}
          </Text>

          <Flex align="center" gap="small">
            <Text>{t('admin.listBlog.sorting')}</Text>
            <Segmented
              options={SORT_OPTIONS.BLOGS}
              value={sortBy}
              onChange={setSortBy}
              size="large"
            />
          </Flex>
        </Flex>
      </Flex>

      <div className="admin-table-section">
        <Table
          columns={columns}
          dataSource={sortedBlogs}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => t('admin.listBlog.totalArticles', { count: total })
          }}
          scroll={{ x: TABLE_SCROLL.ARTICLES }}
          className="admin-table"
        />
      </div>
    </Flex>
  )
}

export default Articles
