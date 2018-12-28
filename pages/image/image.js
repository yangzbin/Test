import { $init, $digest } from '../../utils/common.util'
//获取应用实例
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    images: []
  },
  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },
  gotoShow: function () {
    var _this = this
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        app.startOperating("保存中");
        console.log(res)
        var filePath = res.tempFilePaths[0];
        // _this.setData({
        //   src: res.tempFilePaths
        // })
        const images = _this.data.images.concat(res.tempFilePaths)
        _this.data.images = images.length <= 9 ? images : images.slice(0,9)
        $digest(_this)
        // _this.setData({
        //   images: _this.data.images
        // })
        app.stopOperating();
        //上传
        // wx.uploadFile({
        //   url: '',
        //   filePath: filePath,
        //   name: 'file',
        //   success:function(res){
        //     var data = JSON.parse(res);
        //     if (parseInt(data.status) === 1) {
        //       app.showSuccess('文件保存成功');
        //     } else {
        //       app.showError("文件保存失败");
        //     }
        //   }
        // })
      },
      fail: function () {
        app.stopOperating();
        console.error("调用本地相册文件时出错")
        console.warn("调用本地相册文件时出错")
      },
      complete: function () {
        // complete
      }
    })
  },
  //上传图片
  submitForm:function() {
    // const title = this.data.title
    // const content = this.data.content

    if (1===1) {
      const arr = []

      //将选择的图片组成一个Promise数组，准备进行并行上传
      for (let path of this.data.images) {
        arr.push(wx.uploadFile({
          url: "https://apis.map.qq.com" + '/image/upload',
          filePath: path,
          name: 'file',
        }))
      }

      // wx.showLoading({
      //   title: '正在创建...',
      //   mask: true
      // })
      app.startOperating("上传中...");

      // 开始并行上传图片
      Promise.all(arr).then(res => {
        // 上传成功，获取这些图片在服务器上的地址，组成一个数组
        return res.map(item => JSON.parse(item.data).url)
      }).catch(err => {
        console.log(">>>> upload images error:", err)
      }).then(urls => {
        // 调用保存问题的后端接口
        return createQuestion({
          title: title,
          content: content,
          images: urls
        })
      }).then(res => {
        // 保存问题成功，返回上一页（通常是一个问题列表页）
        const pages = getCurrentPages();
        const currPage = pages[pages.length - 1];
        const prevPage = pages[pages.length - 2];

        // 将新创建的问题，添加到前一页（问题列表页）第一行
        prevPage.data.questions.unshift(res)
        $digest(prevPage)

        wx.navigateBack()
      }).catch(err => {
        console.log(">>>> create question error:", err)
      }).then(() => {
        wx.hideLoading()
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $init(this)
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