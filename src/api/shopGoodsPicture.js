import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/shopGoodsPicture',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/shopGoodsPicture/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/shopGoodsPicture',
    method: 'put',
    data
  })
}
