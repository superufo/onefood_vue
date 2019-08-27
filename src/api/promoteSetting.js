import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/promoteSetting',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/promoteSetting/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/promoteSetting',
    method: 'put',
    data
  })
}
