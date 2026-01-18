import { apiClient } from './client'

/**
 * 시스템 코드 조회
 * @param {string} codeGroup - 코드 그룹 (선택사항)
 * @returns {Promise} 시스템 코드 목록
 */
export const getSystemCodes = async (codeGroup = null) => {
  const url = codeGroup ? `/system-codes?codeGroup=${codeGroup}` : '/system-codes'
  const response = await apiClient.get(url)
  return response.data.body
}
