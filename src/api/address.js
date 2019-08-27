import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/address',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/address/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/address',
    method: 'put',
    data
  })
}
