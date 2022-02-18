const ModalHTMLTemplate = `
<style>
    .modal {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow: hidden;
        visibility: hidden;
        display: table;
    }
    .modal__overlay{
        position: fixed; 
        z-index: 1;  
        left: 0;
        top: 0;
        width: 100%; 
        height: 100%; 
        overflow: auto; 
        background-color: rgba(0,0,0,0.4); 
    }
    .modal__container  {
		display: table-cell;
		text-align: center;
		vertical-align: middle;
    }
	.modal__overlay,
	.modal__container {
		opacity: 0;
		transition: opacity 200ms ease-in;
	}
    /* modifiers */
	.modal--active {
		visibility: visible;
		z-index: 2017;
	}
    .modal--active .modal__overlay,
    .modal--active .modal__container {
        opacity: 1;
    }
    .modal-body{
        width: 100%;
        margin: 0 auto;
		box-sizing: border-box;
    }
    :host{
        color:red;
    }
</style>
<div class="modal">
    <div class='modal__overlay' ></div>
    <div class="modal__container">
        <div class="modal-body">
            <slot><slot>
        </div>
    </div>
</div>`
class Modal extends HTMLElement {
  static get observedAttributes() {
    return ['isopened']
  }
  private _isOpened: string
  private element!: HTMLElement
  private closeOnClickOverlay: boolean
  constructor() {
    super()
    this._isOpened = 'false'
    this.attachShadow({ mode: 'open' })
    this.shadowRoot!.innerHTML = ModalHTMLTemplate
    this.closeOnClickOverlay = true
  }
  set isOpened(value: string) {
    this._isOpened = value
    if (this._isOpened === 'true') {
      this.onShow()
    } else {
      this.onHide()
    }
  }
  /**
   * connectedCallback
   * 当元素插入到 DOM 中时，将调用 connectedCallback。
   * 这是运行安装代码的好地方，比如获取数据或设置默认属性。
   * 可以将其与React的componentDidMount方法进行比较
   * vue的mount方法作比较
   */
  connectedCallback() {
    this.element = this.shadowRoot!.querySelector('.modal')!
    this.isOpened = this.getAttribute('isopened') || 'false'
    this.shadowRoot!.querySelector('.modal__overlay')!.addEventListener(
      'click',
      this.handleClickOverlay.bind(this)
    )
    /*监听插槽变化 */
    this.shadowRoot!.firstElementChild!.addEventListener('slotchange', this.onSlotChange.bind(this))
  }
  /**
   * disconnectedCallback
   * 只要从 DOM 中移除元素，就会调用 disconnectedCallback。清理时间到了！
   * 我们可以使用 disconnectedCallback 删除事件监听，或取消记时。
   * 但是请记住，当用户直接关闭浏览器或浏览器标签时，这个方法将不会被调用。
   *
   * 可以用window.unload beforeunload或者widow.close 去触发在浏览器关闭是的回调
   *
   * 可以与 react 中的 componentWillUnmount 的方法进行比较
   * vue 中的 destory中是生命周期函数进行对比
   */
  disconnectedCallback() {
    this.shadowRoot!.querySelector('.modal__overlay')!.removeEventListener(
      'click',
      this.handleClickOverlay
    )
  }
  /**
   * 每次将自定义元素移动到新文档时，都会调用 adoptedCallback。只有当您的页面中有 < iframe > 元素时，您才会遇到这个用例。
   * 通过调用document.adoptnode (element)调用它，基本上用不上
   */
  adoptedCallback() {}
  /**
   * @param {*} attr
   * @param {*} o
   * @param {*} n
   * 每当添加到observedAttributes数组的属性发生变化时，就会调用这个函数。使用属性的名称、旧值和新值调用该方法
   * react 中的 static getDerivedStateFromProps(props, state) 有些类似
   * 基本上和vue中的watch使用和observedAttributes + attributeChangedCallback使用雷同；
   */
  attributeChangedCallback(attr: string, o: string, n: string) {
    if (!this.element) {
      return
    }
    const attribute = attr.toLowerCase()
    if (attribute === 'isopened') {
      if (n !== this._isOpened) {
        this.isOpened = n
      }
    }
  }

  onSlotChange(event: any) {
    const slot = event.target
    // if (slot.name == 'item') {
    //   this.items = slot.assignedElements().map(elem => elem.textContent);
    //   alert("Items: " + this.items);
    // }
  }
  //点击遮罩层关闭
  handleClickOverlay() {
    if (!this.closeOnClickOverlay) {
      return
    }
    this.handleClose()
  }
  //关闭
  handleClose() {
    // 调用父组建通讯
    // @ts-ignore
    this.getRootNode().host.onClose()
  }
  onShow() {
    this.element.classList.add('modal--active')
  }
  onHide() {
    this.element.classList.remove('modal--active')
  }
}
/**
 * 生命周期的执行顺序  挂载的时候 按照react 或者vue中的执行顺序是相同的
 * constructor -> attributeChangedCallback -> connectedCallback
 */

const FrozenModal = Object.freeze(Modal)
customElements.define('uu-modal', FrozenModal)
