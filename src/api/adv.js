import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/adv',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/adv/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/adv',
    method: 'put',
    data
  })
}
