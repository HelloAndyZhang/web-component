const SwiperItemHTMLTemplate = `
<style>
.uu-swiper_container-item{
    position: relative;
    width: 100%;
    height: 100%;
    flex-shrink: 0;
}
.uu-swiper_container-item_wrapper{
    position: absolute;
    z-index: 2017;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
::slotted(img) { 
    display: block;
    max-width: 100%;
    max-height: 100%;
}
/* 
:host {
    position: relative;
    width: 100%;
    height: 100%;
    flex-shrink: 0;
}
*/
</style>
<div class="uu-swiper_container-item" >
    <div class="uu-swiper_container-item_wrapper">
      <slot><slot>
    </div>
</div>
`
class SwiperItem extends HTMLElement {
    _onSlotChange: (event: any) => void;
    _wheel: (event: WheelEvent) => void;
    static get observedAttributes() {
        return [ "width", "height","maxZoom","minZoom" ];
    }
    private props: any;
    private state:any;
    private ele:HTMLElement;
    private attr:any;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const tpl = document.createElement('template')
        tpl.innerHTML = SwiperItemHTMLTemplate
        this.shadowRoot!.appendChild(tpl.content.cloneNode(true));
        this.state = {
            _width: '',
            _height: '',
            zooming:1, // 当前缩放等级
        }
        this.props = {
            maxZoom:2,
            minZoom:0.4,
        }
        //@ts-ignore
        this.ele = this.shadowRoot.querySelector('img');
        this._onSlotChange = this.onSlotChange.bind(this);
        this._wheel = this.wheel.bind(this)
        this.shadowRoot!.lastElementChild!.addEventListener('slotchange', this._onSlotChange);
    }
    connectedCallback() {
        this._initAttr()
        // this._initProps()
        this.addEvent();
    }
    set width(value: string) {
        this.state._width = value;
        // @ts-ignore
        this.shadowRoot.lastElementChild.style.width = `${value}px`
    }
    disconnectedCallback() {
        this.romoveEvent();
    }
    addEvent(){
        this.addEventListener('wheel', this._wheel)
    }
    romoveEvent(){
        this.removeEventListener('wheel', this._wheel)
        this.removeEventListener('wheel',this._onSlotChange)
    }
    wheel(event:WheelEvent){
        event.preventDefault()
        let delta = 1
        if (event.deltaY) {
          delta = event.deltaY > 0 ? 1 : -1
          //@ts-ignore
        } else if (event?.wheelDelta) {
          //@ts-ignore
          delta = -event.wheelDelta / 120
        } else if (event.detail) {
          delta = event.detail > 0 ? 1 : -1
        }
        this.zoom(-delta * 0.1)
    }
    zoom(scale:any){
        const newZoom = Number((this.state.zooming + scale).toFixed(1))
        const { maxZoom, minZoom } = this.props
        if (newZoom > maxZoom || newZoom < minZoom) {
          return
        }
        this.state.zooming = newZoom
        this.updateStyle();
    }
    updateStyle(){
        let {zooming } = this.state
        this.ele.style.transform = `scale(${zooming}, ${zooming})`;

    }
    onSlotChange(event: any){
        let slot = event.target;
        /**
         * 🦐写
         */
        slot.assignedElements().map((element:HTMLElement) => {
            this.ele = element;
        })
    }
    attributeChangedCallback(attr: string, o: string, n: string) {
        const attribute = attr.toLowerCase()
        switch (attribute) {
            case 'width':
                if (n !== this.state._width) {
                    this.width = n
                }
                break;
            case 'maxzoom':
                if (n !== this.props.maxZoom) {
                    this.props.maxZoom = n
                }
                break;
            case 'minzoom':
                if (n !== this.props.minZoom) {
                    this.props.minZoom = n
                }
                break;
        }
    }
    /**
     * @method: 获取传入数据   对 props 实现数据监听
     */
    _initProps(){
        let _props = this.attr
        this.props = {}
        const prefix = '_p_'
        for (const p in _props) {
          if (_props[p] !== '&') {
            Object.defineProperty(this.props, p, {
              get: () => {
                //@ts-ignore
                return this[prefix + p]
              },
              set: (value) => {
                //@ts-ignore
                this[prefix + p] = value
              },
            })
          }
        }
    }
    _initAttr() {
        this.attr = {}
        this.getAttributeNames().forEach((name) => {
          this.attr[name] = this.getAttribute(name)
        })
    }
};

const FrozenSwiperItem = Object.freeze(SwiperItem)
customElements.define('uu-swiper-item', FrozenSwiperItem)
