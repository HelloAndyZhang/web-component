
const SwiperHTMLTemplate = `
<style>
    .uu-swiper{
        width: 100vw;
        height: 100vh;
        position: relative;
        overflow: hidden;
        z-index: 2017;
    }
    .uu-swiper .uu-swiper_container{
        height: 100%;
        display: flex;
    }
    .uu-swiper .uu-swiper_container .uu-swiper_container-item{
        position: relative;
        width: 100%;
        height: 100%;
        flex-shrink: 0;
    }
    .uu-swiper .uu-swiper_container .uu-swiper_container-item_wrapper{
        position: absolute;
        z-index: 2017;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .uu-swiper_dots{
        position: absolute;
        z-index: 2;
        left: 50%;
        top: 12px;
        transform: translateX(-50%);
        color: #e6e6e6;
        font-size: 14px;
    }
    .uu-swiper .uu-swiper_container .uu-swiper_container-item_wrapper img { 
        display: block;
        max-width: 100%;
        max-height: 100%;
    }
    .uu-swiper_close{
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
    .uu-swiper_switch-left{
        position: absolute;
        top: 50%;
        right: 10px;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        margin-top: -22px;
        color: #ffffff40;
        background: rgba(0,0,0,.1);
        border-radius: 50%;
        cursor: pointer;
        pointer-events: auto;
        left: 10px;
        font-size: 18px;
    }
    .uu-swiper_switch-right{
        position: absolute;
        top: 50%;
        right: 10px;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        margin-top: -22px;
        color: #ffffffd9;
        background: rgba(0,0,0,.1);
        border-radius: 50%;
        cursor: pointer;
        pointer-events: auto;
        font-size: 18px;
    }
    ::slotted(uu-swiper-item) {
        position: relative;
        width: 100%;
        height: 100%;
        flex-shrink: 0;
    }
</style>
    <div id="swiper" class="uu-swiper">
        <div class="uu-swiper_dots">  </div>
        <div class="uu-swiper_switch-left"><svg viewBox="64 64 896 896" focusable="false" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg></div>
        <div class="uu-swiper_switch-right"><svg viewBox="64 64 896 896" focusable="false" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path></svg> </div>
        <div class="uu-swiper_container">
            <slot><slot>
        </div>
    </div>
`

class Swiper extends HTMLElement {
    _touchStart: (event: TouchEvent | MouseEvent) => void;
    _touchMove: (event: TouchEvent | MouseEvent) => void;
    _touchEnd: (event: TouchEvent | MouseEvent) => void;
    _onSlotChange: (event: any) => void;
    _prev: () => void;
    _next: () => void;
    _resetWindow: () => void;
    static get observedAttributes() {
        return [ "width", "height", "duration", "touchable", "stopPropagation"];
    }
    elements: any;
    state: any;
    props: any;
    isTouch: any
    containerEle:HTMLElement
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const tpl = document.createElement('template')
        tpl.innerHTML = SwiperHTMLTemplate
        this.shadowRoot!.appendChild(tpl.content.cloneNode(true))
        // 一些状态
        this.state = {
            active: 0, // 当前滑块的下标，从0开始
            offset: 0,  // container的一个left位置
            swiping: false, //滚动中
            touchTrack: {
                start: null,    // 手指触摸/鼠标按下时的位置
                old: null,      // 手指/鼠标上一次的位置
            },
            swiperItemNum: 0,
        };
        // 检测是在pc端还是移动端
        this.isTouch = 'ontouchstart' in window;
        this.props = {
            duration: 3000, // 滚动间隔
            touchable: true, //是否可以通过手势滑动
            stopPropagation: true, // 阻止时间冒泡
            autoplay:true,// 自动播放
        }
        this.containerEle = this.findQS('.uu-swiper_container') as HTMLElement;
        this._touchStart = this.touchStart.bind(this);
        this._touchMove = this.touchMove.bind(this);
        this._touchEnd = this.touchEnd.bind(this);
        this._onSlotChange = this.onSlotChange.bind(this);
        this._touchStart = this.touchStart.bind(this);
        this._prev = this.prev.bind(this);
        this._next = this.next.bind(this);
        this._resetWindow = this.resetWindow.bind(this);
        this.shadowRoot!.lastElementChild!.addEventListener('slotchange', this._onSlotChange);
    }
    connectedCallback() {
        this.initProps()
        this.initState();
        this.updateStyle();
        this.updateDots()
        this.addContainerEvent();
        this.addControlEvent();
    }
    disconnectedCallback() {
        this.removeContainerEvent();
    }
    attributeChangedCallback(attr: string, o: string, n: string) {
        const attribute = attr.toLowerCase()
        switch (attribute) {
            case 'autoplay':
                if (n !== this.props.autoplay) {
                    Object.assign(this.props, { autoplay: n })
                }
                break;
        }

    }
    /**
    * @method: 初始化props 好像并没有什么用
    **/
    initProps() {

    }
    /**
     * @method: 初始化state
     **/
    initState() {
        const rect = {
            width: this.containerEle.offsetWidth,
            height: this.containerEle.offsetHeight,
        };
        this.state.width = +(rect.width);
        this.state.height = +(rect.height);
        this.state.swiping = true;
    }
    initHTML(){
        
    }
     //  设置框高问题 
    onSlotChange(event: any){
        let slot = event.target;
        // 获取插槽长度
        this.state.swiperItemNum = slot.assignedElements().length;
        /** TOD 设置宽 解决子组件设置width 不生效  使用解决  ::slotted(uu-swiper-item) */
        // slot.assignedElements().map((element:HTMLElement) => {
        //     // element.setAttribute('width', this.state.width);
        // })
        this.updateDots();
    }
    /**
     * @method: 更新容器样式
     **/
    updateStyle() {
        this.containerEle.setAttribute('style', `
            transform: translate3d(${this.state.offset}px,0px, 0px);
        `);
    }
    /**
     * @method: 更新角标
     **/
    updateDots() {
        this.findQS('.uu-swiper_dots')!.innerHTML = `${this.state.active + 1}/${this.state.swiperItemNum}`
    }
    /**
     * @method: 查询多个DOM
     **/
    findQSA(className: string) {
        return this.shadowRoot!.querySelectorAll(className) 
    }
    /**
     * @method: 查询单个DOM
     **/
    findQS(className: string) {
        return this.shadowRoot!.querySelector(className) as HTMLElement;
    }
    addContainerEvent() {
        if (this.isTouch) {
            this.containerEle.addEventListener('touchstart', this._touchStart);
            this.containerEle.addEventListener('touchmove', this._touchMove);
            this.containerEle.addEventListener('touchend', this._touchEnd);
        }
        else {
            this.containerEle.addEventListener('mousedown', this._touchStart);
            this.containerEle.addEventListener('mousemove', this._touchMove);
            this.containerEle.addEventListener('mouseup', this._touchEnd);
        }
    }
    addControlEvent(){
        this.findQS('.uu-swiper_switch-left').addEventListener('click', this._prev)
        this.findQS('.uu-swiper_switch-right').addEventListener('click', this._next)
        window.addEventListener('resize', this._resetWindow);
    }
    resetWindow(){
        this.initState();
        this.updateStyle();
        this.change();
    }
    prev(){
        this.state.active--;
        this.change();
    }
    next(){
        this.state.active++;
        this.change();
    }
    removeContainerEvent() {
        this.containerEle.removeEventListener('touchstart', this._touchStart);
        this.containerEle.removeEventListener('touchmove', this._touchMove);
        this.containerEle.removeEventListener('touchend', this._touchEnd);
        this.findQS('.uu-swiper_switch-left')?.removeEventListener('click', this._prev)
        this.findQS('.uu-swiper_switch-right')?.removeEventListener('click', this._next)
        window.removeEventListener('resize', this._resetWindow);
    }
    onClick() {
        /** 调用父组件方法示例 */
        // @ts-ignore 
        this.getRootNode().host.onClose();
    }
    touchStart(event: TouchEvent | MouseEvent) {
        if (!this.props.touchable) return;
        this.state.swiping = true;
        // @ts-ignore
        this.state.touchTrack.start = this.state.touchTrack.old = event.touches ? event.touches[0] : event;
    }

    touchMove(event: TouchEvent | MouseEvent) {
        event.preventDefault();
        if (this.props.touchable && this.state.swiping) {
            // @ts-ignore
            let _event = event.touches ? event.touches[0] : event;
            if (_event.pageX < this.state.touchTrack.old?.pageX) {
                this.state.offset -= this.state.touchTrack.old.pageX - _event.pageX;
            }
            else {
                this.state.offset += _event.pageX - this.state.touchTrack.old?.pageX;
            }
            this.state.touchTrack.old = _event;
            // if (touch.deltaX < 0) {
            //     this.state.offset -= touch.offsetX;
            // }
            // else {
            //     this.state.offset  += touch.offsetX;
            // }
            this.updateStyle();
        }
    }
    touchEnd(event: TouchEvent | MouseEvent) {
        if (!this.props.touchable || !this.state.swiping) {
            return;
        }
        // @ts-ignore
        let _event = event.changedTouches ? event.changedTouches[0] : event;
        this.state.swiping = false;
        if (_event.pageX < this.state.touchTrack.start.pageX) {
            this.state.active++;
        } else {
            this.state.active--;
        }
        //   if (_event.clientX < touch.startX) {
        //       this.state.active ++;
        //   }else {
        //       this.state.active --;
        //   }
        // 防止滑块溢出

        this.change();
    }

    change() {
        if (this.state.active < 0) {
            this.state.active = 0;
        } else if (this.state.active > this.state.swiperItemNum - 1) {
            this.state.active = this.state.swiperItemNum - 1;
        }
        // 当前滑块的index乘以滑块宽度的相反数即为container的left位置。
        this.state.offset = -(this.state.width * this.state.active);
        this.updateStyle()
        this.updateDots()
        this.containerEle.style.cssText += `transition: all 0.3s ease-in;`;
        this.containerEle.addEventListener('transitionend', () => {
            this.containerEle.style.cssText =  this.containerEle.style.cssText.replace('transition', '');
        });
    }
}

const FrozenSwiper = Object.freeze(Swiper);
customElements.define('uu-swiper', FrozenSwiper);