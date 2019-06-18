<template>
  <div style="background:#f0f2f5;margin-top: -20px;height:100%;">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" :src="img_403" alt="403" />
      </div>
      <div class="bullshit">
        <!-- <div class="bullshit__oops">403</div> -->
        <div class="bullshit__headline">{{ message }}</div>
        <a @click="changeRoute('/myTagLib')" class="bullshit__return-home">返回首页</a>
      </div>
    </div>
  </div>
</template>

<script>
import img_403 from '@/assets/403_images/error_403.svg';

export default {
  name: 'page403',
  data() {
    return {
      img_403
    };
  },
  methods: {
    /**
     * 路由跳转
     */
    changeRoute(route) {
      this.$router.push(route);
    }
  },
  computed: {
    message() {
      return '抱歉，你无权访问该页面';
    }
  }
};
</script>

<style lang="scss" scoped>
.wscn-http404 {
  position: relative;
  width: 1200px;
  margin: 20px auto 60px;
  padding: 0 100px;
  overflow: hidden;
  .pic-404 {
    position: relative;
    float: left;
    width: 600px;
    padding: 150px 152px 150px 0;
    text-align: right;
    overflow: hidden;
    &__parent {
      width: 100%;
      max-width: 430px;
    }
    &__child {
      position: absolute;
      &.left {
        width: 80px;
        top: 17px;
        left: 220px;
        opacity: 0;
        animation-name: cloudLeft;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      &.mid {
        width: 46px;
        top: 10px;
        left: 420px;
        opacity: 0;
        animation-name: cloudMid;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1.2s;
      }
      &.right {
        width: 62px;
        top: 100px;
        left: 500px;
        opacity: 0;
        animation-name: cloudRight;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      @keyframes cloudLeft {
        0% {
          top: 17px;
          left: 220px;
          opacity: 0;
        }
        20% {
          top: 33px;
          left: 188px;
          opacity: 1;
        }
        80% {
          top: 81px;
          left: 92px;
          opacity: 1;
        }
        100% {
          top: 97px;
          left: 60px;
          opacity: 0;
        }
      }
      @keyframes cloudMid {
        0% {
          top: 10px;
          left: 420px;
          opacity: 0;
        }
        20% {
          top: 40px;
          left: 360px;
          opacity: 1;
        }
        70% {
          top: 130px;
          left: 180px;
          opacity: 1;
        }
        100% {
          top: 160px;
          left: 120px;
          opacity: 0;
        }
      }
      @keyframes cloudRight {
        0% {
          top: 100px;
          left: 500px;
          opacity: 0;
        }
        20% {
          top: 120px;
          left: 460px;
          opacity: 1;
        }
        80% {
          top: 180px;
          left: 340px;
          opacity: 1;
        }
        100% {
          top: 200px;
          left: 300px;
          opacity: 0;
        }
      }
    }
  }
  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 150px 0;
    overflow: hidden;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    height: 360px;
    &__oops {
      color: #434e59;
      font-size: 72px;
      font-weight: 600;
      line-height: 72px;
      margin-bottom: 24px;
      /*animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;*/
    }
    &__headline {
      color: rgba(0, 0, 0, 0.45);
      font-size: 20px;
      line-height: 28px;
      margin-bottom: 16px;
      /*animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;*/
    }

    &__return-home {
      display: inline-block;
      height: 32px;
      line-height: 32px;
      font-weight: 400;
      text-align: center;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
      background-image: none;
      white-space: nowrap;
      padding: 0 15px;
      font-size: 14px;
      border-radius: 4px;
      border: 1px solid #1890ff;
      color: #fff;
      background-color: #1890ff;
      text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
      -webkit-box-shadow: 0 2px 0 rgba(0, 0, 0, 0.035);
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.035);
      cursor: pointer;
      /*animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;*/
    }
    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}
</style>
