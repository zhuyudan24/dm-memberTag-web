import request from './index';

// 会员 /memberTag/getTagById
export const getTagType = params =>
  request({
    url: '/memberTag/getTagById',
    method: 'get',
    params: params
  });

// 获取模板
export const findWidget = params =>
  request({
    url: '/memberTag/findWidget',
    method: 'get',
    params: params
  });

export const findOndJson = params =>
  request({
    url: '/member-tag-value/findOne.json',
    method: 'get',
    params: params
  });

export const getCityTree = params =>
  request({
    url: '/api-plug/dict-district-tree',
    method: 'post',
    params
  });
