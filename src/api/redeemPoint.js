import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/redeemPoint',
    method: 'post',
    data
  })
}

export function del(code) {
  return request({
    url: 'api/redeemPoint/' + code,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/redeemPoint',
    method: 'put',
    data
  })
}
