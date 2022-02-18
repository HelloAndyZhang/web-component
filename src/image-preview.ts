import './modal'
import './swiper'
import './swiper-item'
const HTMLTemplate = `
<style>
    .imagePreview_close{
        position: absolute;
        z-index: 2022;
        right: 20px;
        top: 12px;
        color: #e6e6e6;
        font-size: 16px;
        border: 1px solid #f5f5f5;
        border-radius: 12px;
        line-height: 26px;
        height: 24px;
        padding:0px 12px;
    }
    :host{
        position: relative;
        height: 100%;
        width: 100%;
    }
</style>
<uu-modal isOpened=false >
    <div class="imagePreview_close"> 关闭 </div>
    <uu-swiper> </uu-swiper>
</uu-modal>
`
class ImagePreview extends HTMLElement {
    _onClose: () => void;
    static get observedAttributes() {
        return ['images', 'isopened',];
    }
    private _isOpened: string;
    private _images: string;
    constructor() {
        super()
        this._isOpened = 'false';
        this._images = '';
        this.attachShadow({ mode: 'open' });
        this._onClose  = this.onClose.bind(this);
    }
    /**
     * 监听组件展开关闭  组件 setAttr 也可以触发当前变化
     **/
    set isOpened(value: string) {
        this._isOpened = value;
        if (this._isOpened == 'true') {
            this.render();
            this.findQS('uu-modal').setAttribute('isOpened', 'true')
        } else {
            this.findQS('uu-modal')?.remove();
        }
    }
    /**
     * 监听传入图片列表
     **/
    set images(value: string) {
        this._images = value;
        // DOM 加载结束 创建元素
        if(this._isOpened ==  'true'){
            this.createElement();
        }
    }
    get images():any {
        return this._images.split(',') || [];
    }
    connectedCallback() {
    }
    createElement() {        
        let imgs = this.images;
         // 先删除节点
         while(this.findQS('uu-swiper').lastChild){
            this.findQS('uu-swiper').removeChild(this.findQS('uu-swiper').lastChild as HTMLElement);
        }
        for (let i = 0; i < imgs.length; i++) {
            let swiperTpl = `<uu-swiper-item><img src=${imgs[i]} /> </uu-swiper-item>`
            const tpl = document.createElement('template');
            tpl.innerHTML = swiperTpl
            this.findQS('uu-swiper').appendChild(tpl.content.cloneNode(true));
        }
    }
    disconnectedCallback() { 
        console.log('组件销毁')
    }
    /**
     * @method: 监听属性变化
     * @param attr  属性名
     * @param o  旧值
     * @param n 新值
     */
    attributeChangedCallback(attr: string, o: string, n: string) {
        const attribute = attr.toLowerCase()
        switch (attribute) {
            case 'isopened':
                if (n !== this._isOpened) {
                    this.isOpened = n
                }
                break
            case 'images':
                if (n !== this._images) {
                    this.images = n
                }
                break
        }
    }
    /**
     * @method: 关闭组件
     */
    onClose() {
        this.setAttribute('isOpened', 'false')
    }
    /**
     * @method: 展示组件
     */
    onShow() {
        this.setAttribute('isOpened', 'true')
    }
    findQS(className: string):HTMLElement{
       return  this.shadowRoot!.querySelector(className) as HTMLElement;
    }
    addControlEvent(){
        this.findQS('.imagePreview_close')?.addEventListener('click',  this._onClose)
    }
    render(){
        const tpl = document.createElement('template')
        tpl.innerHTML = HTMLTemplate
        this.shadowRoot!.appendChild(tpl.content.cloneNode(true));
        this.createElement();
        this.addControlEvent();
    }
}

const FrozenImagePreview = Object.freeze(ImagePreview)
customElements.define('uu-imagepreview', FrozenImagePreview)
