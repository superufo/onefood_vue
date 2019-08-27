import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/shopGoods',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/shopGoods/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/shopGoods',
    method: 'put',
    data
  })
}

export function index() {
  return request({
    url: 'api/shopGoods',
    method: 'get'
  })
}
