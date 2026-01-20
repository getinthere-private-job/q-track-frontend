import { apiClient } from './client'

/**
 * 일별 생산 데이터 목록 조회
 * @param {Object} params - 쿼리 파라미터 (선택사항)
 *   - page: 페이지 번호 (0부터 시작)
 *   - size: 페이지 크기
 *   - itemId: 부품 ID 필터
 *   - startDate: 시작 날짜 (yyyy-MM-dd)
 *   - endDate: 종료 날짜 (yyyy-MM-dd)
 * @returns {Promise} Page 객체 { content: [...], totalElements, totalPages, ... }
 */
export const getDailyProductions = async (params = {}) => {
  // 필터링 파라미터와 페이징 파라미터를 함께 전달
  const queryParams = {
    page: params.page ?? 0,
    size: params.size ?? 10,
    ...(params.itemId && { itemId: params.itemId }),
    ...(params.startDate && { startDate: params.startDate }),
    ...(params.endDate && { endDate: params.endDate }),
  }
  const queryString = new URLSearchParams(queryParams).toString()
  const url = `/daily-productions?${queryString}`
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
