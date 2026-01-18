import { apiClient } from './client'

/**
 * 부품 목록 조회
 * @returns {Promise} 부품 목록
 */
export const getItems = async () => {
  const response = await apiClient.get('/items')
  return response.data.body
}

/**
 * 부품 상세 조회
 * @param {number} id - 부품 ID
 * @returns {Promise} 부품 상세 정보
 */
export const getItem = async (id) => {
  const response = await apiClient.get(`/items/${id}`)
  return response.data.body
}

/**
 * 부품 생성 (MANAGER, ADMIN)
 * @param {Object} data - 부품 데이터 { code, name, description?, category? }
 * @returns {Promise} 생성된 부품 정보
 */
export const createItem = async (data) => {
  const response = await apiClient.post('/items', data)
  return response.data.body
}

/**
 * 부품 수정 (MANAGER, ADMIN)
 * @param {number} id - 부품 ID
 * @param {Object} data - 수정할 부품 데이터 { name?, description?, category? }
 * @returns {Promise} 수정된 부품 정보
 */
export const updateItem = async (id, data) => {
  const response = await apiClient.put(`/items/${id}`, data)
  return response.data.body
}

/**
 * 부품 삭제 (ADMIN)
 * @param {number} id - 부품 ID
 * @returns {Promise} 삭제 결과
 */
export const deleteItem = async (id) => {
  const response = await apiClient.delete(`/items/${id}`)
  return response.data.body
}
