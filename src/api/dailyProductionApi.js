import { apiClient } from './client'

/**
 * 일별 생산 데이터 목록 조회
 * @param {Object} params - 쿼리 파라미터 (선택사항)
 * @returns {Promise} 일별 생산 데이터 목록
 */
export const getDailyProductions = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  const url = queryString ? `/daily-productions?${queryString}` : '/daily-productions'
  const response = await apiClient.get(url)
  // Spring Page 객체 형식인 경우 content 추출, 배열인 경우 그대로 반환
  const body = response.data.body
  return Array.isArray(body) ? body : (body?.content || body)
}

/**
 * 일별 생산 데이터 상세 조회
 * @param {number} id - 일별 생산 데이터 ID
 * @returns {Promise} 일별 생산 데이터 상세 정보
 */
export const getDailyProduction = async (id) => {
  const response = await apiClient.get(`/daily-productions/${id}`)
  return response.data.body
}

/**
 * 일별 생산 데이터 생성
 * @param {Object} data - 일별 생산 데이터 { itemId, productionDate, totalQuantity }
 * @returns {Promise} 생성된 일별 생산 데이터
 */
export const createDailyProduction = async (data) => {
  const response = await apiClient.post('/daily-productions', data)
  return response.data.body
}

/**
 * 일별 생산 데이터 수정
 * @param {number} id - 일별 생산 데이터 ID
 * @param {Object} data - 수정할 데이터 { totalQuantity? }
 * @returns {Promise} 수정된 일별 생산 데이터
 */
export const updateDailyProduction = async (id, data) => {
  const response = await apiClient.put(`/daily-productions/${id}`, data)
  return response.data.body
}

/**
 * 일별 생산 데이터 삭제
 * @param {number} id - 일별 생산 데이터 ID
 * @returns {Promise} 삭제 결과
 */
export const deleteDailyProduction = async (id) => {
  const response = await apiClient.delete(`/daily-productions/${id}`)
  return response.data.body
}
