import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/promoteGoods',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/promoteGoods/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/promoteGoods',
    method: 'put',
    data
  })
}
