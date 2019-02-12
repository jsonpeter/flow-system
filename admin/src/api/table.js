import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/auth/list',
    method: 'get',
    params
  })
}
