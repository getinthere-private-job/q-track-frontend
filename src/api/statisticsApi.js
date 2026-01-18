import { apiClient } from './client'

/**
 * 공정별 NG 비율 통계 조회
 * @param {Object} params - 쿼리 파라미터 { startDate?, endDate? }
 * @returns {Promise} 공정별 통계 데이터 배열
 */
export const getStatisticsByProcess = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  const url = queryString
    ? `/quality-records/statistics/by-process?${queryString}`
    : '/quality-records/statistics/by-process'
  const response = await apiClient.get(url)
  return response.data.body
}

/**
 * 부품별 NG 비율 통계 조회
 * @param {Object} params - 쿼리 파라미터 { startDate?, endDate? }
 * @returns {Promise} 부품별 통계 데이터 배열
 */
export const getStatisticsByItem = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  const url = queryString
    ? `/quality-records/statistics/by-item?${queryString}`
    : '/quality-records/statistics/by-item'
  const response = await apiClient.get(url)
  return response.data.body
}
