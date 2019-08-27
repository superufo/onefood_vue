import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/shopGoodsCatagrory',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/shopGoodsCatagrory/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/shopGoodsCatagrory',
    method: 'put',
    data
  })
}

export function index() {
  return request({
    url: 'api/shopGoodsCatagrory',
    method: 'get'
  })
}

export function getChildren(id) {
  return request({
    method: 'get',
    url: 'api/shopGoodsCatagrory/' + id
  })
}

