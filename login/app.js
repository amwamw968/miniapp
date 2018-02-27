//app.js


const userManager = require('./utils/userManager.js');
const systemInfo = require('./utils/systemInfo.js');



App({
  onLaunch: function () {
    //获取系统信息
    var that = this
    var system = wx.getSystemInfo({
      success: function (res) {
        systemInfo.systemInfo = res
        console.log(systemInfo.systemInfo)
      }
    })
    //获取缓存数据
    try {
      var userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        userManager.userInfo = userInfo
      }
    } catch (e) {
      //不做任何处理
      console.log("用户缓存数据被清空，请重新登录");
    }

  //获取用户信息

    console.log(userManager.userInfo)
  },

 


  globalData: {

  },


  
})