

const request = require('../../utils/request.js')

const WxNotificationCenter = require("../../utils/WxNotificationCenter.js");
const coordtransform = require('../../lib/coordtransform.js');
import { LoginStatusUnLogin, LoginStatusNormal, LoginStatusTokenInvalid, userManager } from '../../utils/userManager.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: '',
    pwd: '',
    userInfo: userManager.userInfo,
    pwdInputDisabled: true,
    pwdInputFocus: false,
    userInputFocus: false,
    userInputDisabled: false,
    loginBtndisable: true,
    animating: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('login onLoad')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.userInputAnimation = wx.createAnimation({
      duration: this.data.animationDuration,
      timingFunction: 'ease',
      delay: 0,
    })

    this.pwdInputAnimation = wx.createAnimation({
      duration: this.data.animationDuration,
      timingFunction: 'ease',
      delay: 0,
    })

    this.inputViewAnimation = wx.createAnimation({
      duration: this.data.animationDuration,
      timingFunction: 'ease',
      delay: 0,
    })

    //登录按钮动画
    this.loginAnimation = wx.createAnimation({
      duration: 700,
      timingFunction: 'line',
      delay: 0,
    })

    //初始化
    if (userManager.userInfo.account != undefined) {
      this.setData({
        user: userManager.userInfo.account
      })
    }
    if (this.data.user.length >= 8) {
      this.animationPwdInputShow(true)


    } else {
      this.animationPwdInputShow(false)
      //清空密码
      this.setData({ pwd: '' })
    }
  },

  animationPwdInputShow: function (show) {

    var opacity = 0;
    if (show) {
      opacity = 1;
    } else {
      opacity = 0;
    }

    this.pwdInputAnimation.opacity(opacity).step()
    this.setData({
      pwdInputAnimation: this.pwdInputAnimation.export(),
    })
  },

  //用户名输入事件
  userBindinput: function (e) {
    this.setData({
      user: e.detail.value,
    })
    if (this.data.user.length >= 8) {
      this.animationPwdInputShow(true)
    } else {
      this.animationPwdInputShow(false)
      //清空密码
      this.setData({
        pwd: '',
        userInputFocus: true,
      })
    }
  },





  animationLoginBtnHeight: function (value) {
    //登录按钮：高度变化
    this.loginAnimation.height(value).step()
    this.setData({
      loginAnimation: this.loginAnimation.export()
    })
  },
  animationMoveReset: function () {
    // Y轴移动，并缩放，以及透明度--还原
    this.inputViewAnimation.translateY(0).opacity(1).step()
    this.userInputAnimation.opacity(1).step()
    var pwdOpacity = 0
    if (this.data.user.length >= 8) { pwdOpacity = 0.65 }
    this.pwdInputAnimation.opacity(pwdOpacity).step()
    this.setData({
      userInputAnimation: this.userInputAnimation.export(),
      inputViewAnimation: this.inputViewAnimation.export(),
      pwdInputAnimation: this.pwdInputAnimation.export(),

    })
  },

  animationMoveUp: function () {
    //用户输入框：Y轴移动、缩放、透明度
    this.inputViewAnimation.translateY(-50).step()
    this.userInputAnimation.opacity(0.65).step()
    this.pwdInputAnimation.opacity(1).step()
    this.setData({
      userInputAnimation: this.userInputAnimation.export(),
      inputViewAnimation: this.inputViewAnimation.export(),
      pwdInputAnimation: this.pwdInputAnimation.export(),
    })
  },

  userBindtap: function () {

    if (this.data.animating) {
      setTimeout(function () {
        this.bindUserInputTap()
      }.bind(this), 100)
      console.log('动画中，延时执行')
      return;
    }
    //屏蔽所有
    this.disableAllInput()
    this.animationMoveReset()
    this.animationLoginBtnHeight(0.5)

    setTimeout(function () {
      this.setData({
        userInputDisabled: false,
        userInputFocus: true,

      })

    }.bind(this), 400)

    setTimeout(function () {
      this.setData({
        animating: false,
      })

    }.bind(this), 1300)

  },


  pwdBindtap: function () {

    if (this.data.animating) {
      setTimeout(function () {
        this.pwdBindtap()
      }.bind(this), 100)
      console.log('动画中，延时执行')
      return;
    }

    if (this.data.user.length < 8) {
      return;
    }

    this.animationMoveUp()

    if (this.data.pwd.length >= 8) {
      this.animationLoginBtnHeight(44)
    } else {
      this.animationLoginBtnHeight(0.5)
    }

    setTimeout(function () {
      this.setData({
        pwdInputDisabled: false,
        pwdInputFocus: true,

      })

    }.bind(this), 400)

    setTimeout(function () {
      this.setData({
        animating: false,
      })

    }.bind(this), 1300)

  },



  disableAllInput: function () {
    this.setData({
      pwdInputFocus: false,
      userInputFocus: false,
      userInputDisabled: true,
      pwdInputDisabled: true,
      animating: true,
    })
  },

  //密码输入事件
  pwdBindinput: function (e) {
    this.setData({
      pwd: e.detail.value,
    })

    if (this.data.pwd.length >= 8) {
      this.animationLoginBtnHeight(44)
    } else {
      this.animationLoginBtnHeight(0.5)
    }

  },

  //登录
  loginBindtap: function (e) {
    wx.showLoading({
      title: '登录中...',
      mask: true,
    })

    var that = this
    request.login({
      user: this.data.user,
      pwd: this.data.pwd,
      success: function (res) {
        var responseCode = res.data.responseCode
        var responseMsg = res.data.responseMsg
        if (responseCode != 0) {
          wx.showToast({
            title: res.data.responseMsg,
            icon: 'none',
          })
        } else {
          //跳转到打卡界面
          wx.hideLoading()
          wx.reLaunch({
            url: '../index/index',
          })

        }

      },
      fail: function (res) {
        wx.showToast({
          title: '请求失败',
          icon: 'none',
        })
      }
    })
  },
})