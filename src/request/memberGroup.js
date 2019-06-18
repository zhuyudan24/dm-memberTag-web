import request from './index.js';

// 获取带标签数量的标签分组
export const getMemberTagCount = () =>
  request({
    url: '/memberTag/platformHomePageCountV2',
    method: 'get',
    params: {
      requestProject: 'gic-member-tag-web'
    }
  });
