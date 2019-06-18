import request from './index';
import qs from 'qs';

// 请求我的用户 标签分类
export const getMemberTag = () =>
  request({
    url: '/memberTag/platformHomePageV2',
    method: 'get',
    params: {
      requestProject: 'gic-member-tag-web'
    }
  });

// 查询标签列表
export const getMemberTagList = params =>
  request({
    url: '/memberTag/platformTagPageListV2',
    method: 'get',
    params: params
  });

// 手工标签新增三级
export const newHandTag = params =>
  request({
    url: '/tagLevel/addHand',
    method: 'get',
    params: params
  });

// 手工三级标签列表
export const thirdHandTagList = params =>
  request({
    url: '/tagLevel/handThirdLevel',
    method: 'get',
    params: params
  });

// 上手手工标签三级
export const deleteThirdTag = params =>
  request({
    url: '/tagLevel/delHand',
    method: 'get',
    params: params
  });

// 修改三级手工标签
export const editThirdTag = params =>
  request({
    url: '/tagLevel/editHand',
    method: 'get',
    params: params
  });

// 删除手工标签
export const delThirdHandTag = params =>
  request({
    url: '/memberTag/delHandMemberTag',
    method: 'get',
    params: params
  });

// 会员分组分类 查询
export const memberGroupList = params =>
  request({
    url: '/member-tag-group-classify/list',
    method: 'get',
    params: params
  });

// 会员分组分类 新增 编辑  memberTagGroupClassifyId 新增不需要，编辑需要
export const memberGroupModify = params =>
  request({
    url: '/member-tag-group-classify/save',
    method: 'get',
    params: params
  });

// 会员分组删除分类
export const memberGroupDelete = params =>
  request({
    url: '/member-tag-group-classify/delete',
    method: 'get',
    params: params
  });

export const recommendGroupList = () =>
  request({
    url: '/member-tag-group-recommend/list?requestProject=gic-member-tag-web',
    method: 'get'
  });

// 推荐会员分组-列表
export const recommendList = params =>
  request({
    url: '/member-tag-group-recommend/group',
    method: 'get',
    params: params
  });

// 会员分组查列表第二级别
export const findSecondMemberList = params =>
  request({
    url: '/member-tag-group/findList.json',
    method: 'get',
    params: params
  });

/**
 * 批量修改失效
 */
export const batchModifyEffective = params =>
  request({
    url: '/member-tag-group/simpleUpdateBatch',
    method: 'get',
    params: params
  });

// 删除分组
export const batchDeleteGroup = params =>
  request({
    url: '/member-tag-group/deleteBatch',
    method: 'get',
    params: params
  });

// 分组归属
export const batchChangeGroup = params =>
  request({
    url: '/member-tag-group/changeClassify',
    method: 'get',
    params: params
  });

// 会员分组新增 /member-tag-group/add

export const addNewGroup = params =>
  request({
    url: '/member-tag-group/add',
    method: 'post',
    data: qs.stringify(params)
  });


// 批量更新会员分组的人
export const refershMemberCount = params =>
  request({
    url: '/member-tag-member/getMemberCountByGroupIdBatch',
    method: 'get',
    params
  });

export const memberTagGroupList = params =>
  request({
    url: '/member-tag-group/findList.json',
    method: 'get',
    params
  });
