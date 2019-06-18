export const baseList = [
     {
       type: 'one',
       name: '图片广告',
       template: '1',
       isSpace: 'Y',
       imgList: [
         {
           imgUrl: '',
           imglink: '',
           crowd: ''
         }
       ],
       linkUrl: ''
     },
     {
       type: 'two',
       name: '魔方',
       template: '1',
       isSpace: 'Y',
       imgList: [
         {
           imgUrl: '',
           imglink: '',
           crowd: ''
         }
       ],
       crowd: {
         type: 'Y',
         condition: ''
       },
       linkUrl: ''
     },
     {
       type: 'three',
       name: '文本',
       content: '',
       textcolor: '#333',
       bgcolor: '#fff',
       showPosition: '',
       isSpace: 'Y',
       crowd: {
         type: 'Y',
         condition: ''
       }
     },
     {
       type: 'four',
       name: '横栏',
       template: 'one',
       tip: 'true',
       textcolor: '#333',
       bgcolor: '#fff',
       imgList: [
         {
           label: '',
           imgUrl: '',
           linkUrl: '',
           crowd: {
             type: 'Y',
             condition: ''
           }
         }
       ]
      },
      {
        type: 'five',
        name: '辅助线',
        color: '#333',
        margin: '10px',
        style: 'solid'
      },
      {
        type: 'six',
        name: '辅助空白',
        height: '10'
      }
];

export const mainList = [
  {
    name:"进入积分", id: 1
  },
  {
    name:"数据icon", id: 2
  },
  {
    name:"卡券兑换", id: 3
  },
  {
    name:"礼品兑换", id: 4
  },
  {
    name:"订单分组", id: 5
  }
];

export const mallList = [
  {
    name:"商品", id: 1
  },
  {
    name:"商品分组", id: 2
  },
  {
    name:"商品搜索", id: 3
  }
];

export const saleList = [
  {
    name:"优惠券", id: 1
  },
  {
    name:"拼团", id: 2
  },
  {
    name:"周期购", id: 3
  },
  {
    name:"限时折扣", id: 4
  },
  {
    name:"秒杀", id: 5
  },
  {
    name:"预售", id: 6
  }
];
