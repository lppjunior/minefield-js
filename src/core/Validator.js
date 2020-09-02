import { CHECKER, STATUS } from '../config'

export default {
  validateLastTurn: function () {
    if (this.state.get('updated').length === 0) return

    this.state.set('status',
      this.state.get('updated')[0].value === CHECKER.MINE ? STATUS.LOSS
        : this.state.get('checked') === this.state.get('total') ? STATUS.WIN
          : STATUS.PLAYING
    )
  }
}
