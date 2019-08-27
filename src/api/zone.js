import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/zone',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/zone/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/zone',
    method: 'put',
    data
  })
}

export function getCountry() {
  return request({
    url: 'api/zone/getCountry/',
    method: 'get'
  })
}

export function getProvince(countryId) {
  return request({
    url: 'api/zone/getProvince/' + countryId,
    method: 'get'
  })
}

export function getCity(provinceID) {
  return request({
    url: 'api/zone/getCity/' + provinceID,
    method: 'get'
  })
}

export function getDistrict(cityId) {
  return request({
    url: 'api/zone/getDistrict/' + cityId,
    method: 'get'
  })
}

export function getZoneByType(pid) {
  return request({
    url: 'api/zone/getZoneByType/'+pid,
    method: 'get'
  })
}
