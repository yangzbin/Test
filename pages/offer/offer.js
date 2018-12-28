//获取应用实例
var app = getApp();
// 引入SDK核心类
var QQMapWX = require('../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var mLatitude;
var mLongitude;
var area = require('../../datas/area')
var p = 0, c = 0, d = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinceNames: [],
    provinceName:[],
    provinceCode: [],
    provinceSelIndex: '',
    cityNames: [],
    cityNames:[],
    cityCode: [],
    citySelIndex: '',
    districtNames: [],
    districtName:[],
    districtCode: [],
    districtSelIndex: '',
    showMessage: false,
    messageContent: '',
    showDistpicker: false
  },
  bindAddress: function () {
    wx.navigateTo({
      url: '../address/addr'
    })
  },
  bindImg: function () {
    wx.navigateTo({
      url: '../image/image'
    })
  },
  //计算价格
  bindCalculate:function(e){
    var cost = parseFloat(e.detail.value.cost == "" ? 0 : e.detail.value.cost)
    var dry = parseInt(e.detail.value.dry == "" ? 0 : e.detail.value.dry) 
    var oil = parseInt(e.detail.value.oil == "" ? 0 : e.detail.value.oil) 
    var cabinet = parseInt(e.detail.value.cabinet == "" ? 0 : e.detail.value.cabinet) 
    var inter = parseInt(e.detail.value.inter == "" ? 0 : e.detail.value.inter) 
    var count = cost + dry * 240 + oil * 80 + cabinet * 900 + inter*750
    this.setData({
      price:count
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载地区数据
    this.setAreaData()
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'ZVCBZ-MOK35-3UEIC-QGK6Z-OZC7V-XEFCN'
    });
    var _this = this;
    wx.getLocation({//获取位置
      type: 'wgs84',
      success: (res) => {
        mLatitude = res.latitude.toString(), // 纬度
        mLongitude = res.longitude.toString() // 经度

        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: mLatitude,
            longitude: mLongitude
          },
          success: function (addr) {
            console.log(res);
            _this.setData({ address: addr.result.address })
          },
          fail: function (addr) {
            console.log(addr);
          },
          complete: function (addr) {
            console.log(addr);
          }
        });
      }
    });
  },
  setAreaData: function (p, c, d) {
    var p = p || 0 // provinceSelIndex
    var c = c || 0 // citySelIndex
    var d = d || 0 // districtSelIndex
    // 设置省的数据
    var province = area['100000']
    var provinceName = [];
    var provinceCode = [];
    for (var item in province) {
      provinceName.push(province[item])
      provinceCode.push(item)
    }
    this.setData({
      provinceNames: provinceName,
      provinceCode: provinceCode
    })
    // 设置市的数据
    var city = area[provinceCode[p]]
    var cityName = [];
    var cityCode = [];
    for (var item in city) {
      cityName.push(city[item])
      cityCode.push(item)
    }
    this.setData({
      cityNames: cityName,
      cityCode: cityCode
    })
    // 设置区的数据
    var district = area[cityCode[c]]
    var districtName = [];
    var districtCode = [];
    for (var item in district) {
      districtName.push(district[item])
      districtCode.push(item)
    }
    this.setData({
      districtNames: districtName,
      districtCode: districtCode
    })
  },
  changeArea: function (e) {
    if (this.data.showDistpicker){
        p = e.detail.value[0]
        c = e.detail.value[1]
        d = e.detail.value[2]
        this.setAreaData(p, c, d)
      }
  },
  showDistpicker: function () {
    this.setData({
      showDistpicker: true
    })
  },
  distpickerCancel: function () {
    this.setData({
      showDistpicker: false
    })
  },
  distpickerSure: function () {
    var _this = this
    // for (var item in this.data.provinceNames) {
    //   this.data.provinceName.push(this.data.provinceNames[item])
    // }
    // for (var item in this.data.cityNames) {
    //   this.data.cityName.push(this.data.cityNames[item])
    // }
    // for (var item in this.data.dadistrictNames) {
    //   this.data.districtName.push(this.data.dadistrictNames[item])
    // }
      this.setData({
        provinceName:_this.data.provinceNames,
        cityName:_this.data.cityNames,
        districtName:_this.data.districtNames,
        provinceSelIndex: p,
        citySelIndex: c,
        districtSelIndex: d
      })
    this.distpickerCancel()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})