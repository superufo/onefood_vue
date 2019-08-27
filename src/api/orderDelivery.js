import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/orderDelivery',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/orderDelivery/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/orderDelivery',
    method: 'put',
    data
  })
}
