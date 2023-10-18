import {DefineComponent, reactive} from "vue";

export interface IDialogItem {
  name: string
  title?: string
  component: any
  properties?: {
    allowClose?: true
  }
  props?: any
}

export class Dialog {
  dialogs: Array<IDialogItem> = reactive([])

  push(dialog: IDialogItem) {
    this.dialogs.push(dialog)
  }

  get(dialogName: string) {
    return this.dialogs.find(({name}) => name === dialogName)
  }

  remove(nameOrIndex: string | number) {
    const index = typeof nameOrIndex === 'number'
      ? nameOrIndex
      : this.dialogs.findIndex(({name}) => name === nameOrIndex)

    if (index !== -1) this.dialogs.splice(index, 1)
  }

  clear() {
    this.dialogs.length = 0
  }
}
