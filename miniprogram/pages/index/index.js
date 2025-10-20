Page({
  data: {
    device: ''
  },
  onLoad() {
    try {
      const sys = wx.getSystemInfoSync()
      this.setData({ device: `${sys.brand || ''} ${sys.model}`.trim() })
    } catch (e) {
      this.setData({ device: '' })
    }
  },
  goToAbout() {
    wx.navigateTo({ url: '/pages/about/about' })
  }
})
