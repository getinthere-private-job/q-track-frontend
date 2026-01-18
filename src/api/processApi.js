import { apiClient } from './client'

/**
 * 공정 목록 조회
 * @returns {Promise} 공정 목록
 */
export const getProcesses = async () => {
  const response = await apiClient.get('/processes')
  return response.data.body
}

/**
 * 공정 상세 조회
 * @param {number} id - 공정 ID
 * @returns {Promise} 공정 상세 정보
 */
export const getProcess = async (id) => {
  const response = await apiClient.get(`/processes/${id}`)
  return response.data.body
}
