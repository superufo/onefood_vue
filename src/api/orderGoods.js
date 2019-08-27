import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/orderGoods',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/orderGoods/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/orderGoods',
    method: 'put',
    data
  })
}
