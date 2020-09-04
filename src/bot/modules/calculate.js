
export default {
  calculate: function () {
    if (this.nextList.length > 0) return

    this.makeBoardMap()
    this.calculateNextList()
  }
}
