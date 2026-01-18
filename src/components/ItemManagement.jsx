import { useState } from 'react'
import useUserStore from '../stores/userStore'
import { useItems, useCreateItem, useUpdateItem, useDeleteItem } from '../hooks/useItems'

const ItemManagement = () => {
  const user = useUserStore((state) => state.user)
  const { data: items, isLoading, error } = useItems()
  const createItemMutation = useCreateItem()
  const updateItemMutation = useUpdateItem()
  const deleteItemMutation = useDeleteItem()

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: ''
  })
  const [formErrors, setFormErrors] = useState({})

  // 권한 확인: MANAGER, ADMIN만 접근 가능
  const canManage = user && (user.role === 'MANAGER' || user.role === 'ADMIN')
  const canDelete = user && user.role === 'ADMIN'

  if (!canManage) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <p className="text-sm text-gray-600">부품 관리 기능은 MANAGER 이상 권한이 필요합니다.</p>
      </div>
    )
  }

  const handleCreateClick = () => {
    setFormData({ code: '', name: '', description: '', category: '' })
    setFormErrors({})
    setEditingItem(null)
    setIsCreateFormOpen(true)
  }

  const handleEditClick = (item) => {
    setFormData({
      code: item.code,
      name: item.name || '',
      description: item.description || '',
      category: item.category || ''
    })
    setFormErrors({})
    setEditingItem(item)
    setIsCreateFormOpen(true)
  }

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validate = () => {
    const errors = {}
    if (!formData.code.trim()) {
      errors.code = '부품 코드를 입력하세요'
    }
    if (!formData.name.trim()) {
      errors.name = '부품 이름을 입력하세요'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      if (editingItem) {
        // 수정
        await updateItemMutation.mutateAsync({
          id: editingItem.id,
          data: {
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            category: formData.category.trim() || null
          }
        })
      } else {
        // 생성
        await createItemMutation.mutateAsync({
          code: formData.code.trim(),
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          category: formData.category.trim() || null
        })
      }
      setIsCreateFormOpen(false)
      setFormData({ code: '', name: '', description: '', category: '' })
      setEditingItem(null)
    } catch (error) {
      console.error('부품 저장 실패:', error)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return

    try {
      await deleteItemMutation.mutateAsync(deleteConfirmId)
      setDeleteConfirmId(null)
    } catch (error) {
      console.error('부품 삭제 실패:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <p className="text-sm text-gray-600">로딩 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <p className="text-sm text-red-600">데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 부품 생성 폼 모달 */}
      {isCreateFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? '부품 수정' : '부품 추가'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {/* 부품 코드 (생성 시에만 표시) */}
              {!editingItem && (
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    부품 코드 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                      formErrors.code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="부품 코드를 입력하세요"
                  />
                  {formErrors.code && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>
                  )}
                </div>
              )}

              {/* 부품 이름 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  부품 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="부품 이름을 입력하세요"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              {/* 설명 (선택) */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  설명
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                  placeholder="부품 설명을 입력하세요 (선택사항)"
                />
              </div>

              {/* 카테고리 (선택) */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="카테고리를 입력하세요 (선택사항)"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateFormOpen(false)
                    setEditingItem(null)
                    setFormData({ code: '', name: '', description: '', category: '' })
                  }}
                  className="px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={createItemMutation.isPending || updateItemMutation.isPending}
                  className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createItemMutation.isPending || updateItemMutation.isPending
                    ? '저장 중...'
                    : '저장'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">부품 삭제</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-700 mb-4">
                정말로 이 부품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deleteItemMutation.isPending}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteItemMutation.isPending ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 부품 목록 */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">부품 목록</h2>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            부품 추가
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  부품 코드
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  부품 이름
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  카테고리
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  설명
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                  액션
                </th>
              </tr>
            </thead>
            <tbody>
              {items && items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 border-b">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.category || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.description || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="px-3 py-1 text-xs bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
                        >
                          수정
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-sm text-gray-500">
                    부품이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ItemManagement
