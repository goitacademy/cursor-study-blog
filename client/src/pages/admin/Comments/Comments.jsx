import React, { useState, useMemo } from 'react'
import { Table, Button, Space, Typography, Spin, Flex, Segmented, Tooltip } from 'antd'
import { DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAdminComments } from '@/hooks'
import { commentApi } from '@/api'
import toast from 'react-hot-toast'
import { SORT_OPTIONS, TABLE_SCROLL, COLUMN_WIDTHS } from '@/constants/ui'
import '../shared/AdminTable.css'
import './Comments.css'

const { Title, Text } = Typography

function Comments() {
  const { comments, loading, refetch } = useAdminComments()
  const { t } = useTranslation()
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.COMMENTS[0])

  const handleDelete = async (id) => {
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

  const handleApprove = async (id) => {
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

  const handleUnapprove = async (id) => {
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

  const sortedComments = useMemo(() => {
    let sorted = [...comments]
    if (sortBy === t('admin.listBlog.sortLatest') || sortBy === 'Latest') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return sorted
  }, [comments, sortBy, t])

  const columns = [
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
      ellipsis: true,
    },
    {
      title: t('admin.comments.columns.article'),
      dataIndex: ['blog', 'title'],
      key: 'article',
      ellipsis: true,
      width: COLUMN_WIDTHS.ARTICLE,
      responsive: ['md']
    },
    {
      title: t('admin.comments.columns.author'),
      dataIndex: 'name',
      key: 'author',
      width: COLUMN_WIDTHS.AUTHOR,
      responsive: ['lg']
    },
    {
      title: t('admin.comments.columns.actions'),
      key: 'actions',
      width: COLUMN_WIDTHS.ACTIONS_MEDIUM,
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
                onClick={() => handleApprove(record._id)}
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
                onClick={() => handleUnapprove(record._id)}
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
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  if (loading) {
    return (
      <Flex justify="center" align="center" className="admin-comments-loading">
        <Spin size="large" />
      </Flex>
    )
  }

  return (
    <Flex vertical className="admin-comments">
      <Flex justify="space-between" align="center" className="admin-page-header admin-comments-header">
        <Title level={1} className="admin-comments-title">
          {t('admin.comments.title')}
        </Title>

        <Flex align="center" gap="middle">
          <Text strong className="admin-comments-count">
            {t('admin.comments.commentsCount')} {comments.length}
          </Text>

          <Flex align="center" gap="small">
            <Text>{t('admin.listBlog.sorting')}</Text>
            <Segmented
              options={SORT_OPTIONS.COMMENTS}
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
          dataSource={sortedComments}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => t('admin.comments.totalComments', { count: total })
          }}
          scroll={{ x: TABLE_SCROLL.COMMENTS }}
          className="admin-table"
        />
      </div>
    </Flex>
  )
}

export default Comments
