import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/promoteCode',
    method: 'post',
    data
  })
}

export function del(code) {
  return request({
    url: 'api/promoteCode/' + code,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/promoteCode',
    method: 'put',
    data
  })
}
