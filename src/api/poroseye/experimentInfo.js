import request from '@/utils/request'

// 查询实验基本信息列表
export function listExperimentInfo(query) {
  return request({
    url: '/glxt/experimentInfo/list',
    method: 'get',
    params: query
  })
}

// 查询实验基本信息详细
export function getExperimentInfo(id) {
  return request({
    url: '/glxt/experimentInfo/' + id,
    method: 'get'
  })
}

// 新增实验基本信息
export function addExperimentInfo(data) {
  return request({
    url: '/glxt/experimentInfo',
    method: 'post',
    data: data
  })
}

// 修改实验基本信息
export function updateExperimentInfo(data) {
  return request({
    url: '/glxt/experimentInfo',
    method: 'put',
    data: data
  })
}

// 审核实验
export function toExamine(id) {
  return request({
    url: '/glxt/experimentInfo/toExamine/' + id,
    method: 'put'
  })
}

// 删除实验基本信息
export function delExperimentInfo(id) {
  return request({
    url: '/glxt/experimentInfo/' + id,
    method: 'delete'
  })
}


// 根据学校类型、学段、科目、版本、分册查询实验列表
export function listExperimentInfoMountsystem(query) {
  return request({
    url: '/glxt/experimentInfoMountsystem/list',
    method: 'get',
    params: query
  })
}


// 查询实验详细信息
export function getExperimentDataRes(id) {
  return request({
    url: '/glxt/experimentInfo/getExperimentData/' + id,
    method: 'get'
  })
}