import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/member',
    method: 'post',
    data
  })
}

export function del(mid) {
  return request({
    url: 'api/member/' + mid,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/member',
    method: 'put',
    data
  })
}

export function getMembers(mid, midName) {
  return request({
    url: 'api/member/' + mid + '/' + midName,
    method: 'get'
  })
}

