import { apiClient } from './client'

/**
 * 품질 기록 목록 조회
 * @param {Object} params - 쿼리 파라미터 (선택사항)
 * @returns {Promise} 품질 기록 목록 배열 (Page 객체의 content 추출)
 */
export const getQualityRecords = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  const url = queryString ? `/quality-records?${queryString}` : '/quality-records'
  const response = await apiClient.get(url)
  // Spring Page 객체 형식: { content: [...], totalElements, totalPages, ... }
  const body = response.data.body
  // Page 객체인 경우 content 배열 반환, 배열인 경우 그대로 반환 (하위 호환성)
  return Array.isArray(body) ? body : (body?.content || [])
}

/**
 * 품질 기록 상세 조회
 * @param {number} id - 품질 기록 ID
 * @returns {Promise} 품질 기록 상세 정보
 */
export const getQualityRecord = async (id) => {
  const response = await apiClient.get(`/quality-records/${id}`)
  return response.data.body
}

/**
 * 품질 기록 생성
 * @param {Object} data - 품질 기록 { dailyProductionId, processId, okQuantity, ngQuantity }
 * @returns {Promise} 생성된 품질 기록
 */
export const createQualityRecord = async (data) => {
  const response = await apiClient.post('/quality-records', data)
  return response.data.body
}

/**
 * 품질 기록 수정
 * @param {number} id - 품질 기록 ID
 * @param {Object} data - 수정할 데이터 { okQuantity?, ngQuantity? }
 * @returns {Promise} 수정된 품질 기록
 */
export const updateQualityRecord = async (id, data) => {
  const response = await apiClient.put(`/quality-records/${id}`, data)
  return response.data.body
}

/**
 * 품질 기록 삭제
 * @param {number} id - 품질 기록 ID
 * @returns {Promise} 삭제 결과
 */
export const deleteQualityRecord = async (id) => {
  const response = await apiClient.delete(`/quality-records/${id}`)
  return response.data.body
}

/**
 * 품질 기록 평가
 * @param {number} id - 품질 기록 ID
 * @param {Object} data - 평가 데이터 { expertEvaluation }
 * @returns {Promise} 평가된 품질 기록
 */
export const evaluateQualityRecord = async (id, data) => {
  const response = await apiClient.put(`/quality-records/${id}/evaluate`, data)
  return response.data.body
}

/**
 * 평가 필요 목록 조회
 * @returns {Promise} 평가 필요 품질 기록 목록
 */
export const getEvaluationRequired = async () => {
  const response = await apiClient.get('/quality-records/evaluation-required')
  return response.data.body
}
