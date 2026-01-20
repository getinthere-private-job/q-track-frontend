import { apiClient } from './client'

/**
 * 품질 기록 목록 조회
 * @param {Object} params - 쿼리 파라미터 (선택사항)
 *   - page: 페이지 번호 (0부터 시작)
 *   - size: 페이지 크기
 *   - itemId: 부품 ID 필터
 *   - productionDate: 생산일 필터 (yyyy-MM-dd)
 *   - startDate: 시작 날짜 (yyyy-MM-dd)
 *   - endDate: 종료 날짜 (yyyy-MM-dd)
 *   - year: 년도 필터
 *   - month: 월 필터
 * @returns {Promise} Page 객체 { content: [...], totalElements, totalPages, ... }
 */
export const getQualityRecords = async (params = {}) => {
  // 필터링 파라미터와 페이징 파라미터를 함께 전달
  const queryParams = {
    page: params.page ?? 0,
    size: params.size ?? 20,
    ...(params.itemId && { itemId: params.itemId }),
    ...(params.productionDate && { productionDate: params.productionDate }),
    ...(params.startDate && { startDate: params.startDate }),
    ...(params.endDate && { endDate: params.endDate }),
    ...(params.year && { year: params.year }),
    ...(params.month && { month: params.month }),
  }
  const queryString = new URLSearchParams(queryParams).toString()
  const url = `/quality-records?${queryString}`
  const response = await apiClient.get(url)
  // Spring Page 객체 형식: { content: [...], totalElements, totalPages, ... }
  const body = response.data.body
  // Page 객체인 경우 그대로 반환, 배열인 경우 Page 객체 형태로 변환 (하위 호환성)
  if (Array.isArray(body)) {
    return {
      content: body,
      totalElements: body.length,
      totalPages: 1,
      size: body.length,
      number: 0,
      first: true,
      last: true
    }
  }
  // Page 객체가 아니지만 content가 있는 경우
  if (body?.content) {
    return body
  }
  // content도 없는 경우 빈 Page 객체 반환
  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: params.size || 10,
    number: params.page || 0,
    first: true,
    last: true
  }
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
