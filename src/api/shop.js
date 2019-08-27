import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/shop',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/shop/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/shop',
    method: 'put',
    data
  })
}

export function getFromId(id) {
  return request({
    url: 'api/shop/' + id,
    method: 'get'
  })
}

export function getShopByZone(country, provice, city, street) {
  return request({
    url: 'api/shop/' + country + '/' + provice + '/' + city + '/' + street,
    method: 'get'
  })
}

