
export default class Throttle {
    
    nextCallback?: Function;
    lastKnownParams?: any[];

    ticking = false;

    invokeWithAnimationFrame(callback: Function, ...params: any[]) {
        
        this.nextCallback = callback;
        this.lastKnownParams = params;

        if (!this.ticking) {

            const _this = this;

            const dispatch = (fn: Function, ...params: any[]) => {
                _this.ticking = true;
                _this.nextCallback = undefined;
                _this.lastKnownParams = undefined;
                window.requestAnimationFrame(() => {
                    fn(...params);
                    _this.ticking = false;
                    if (_this.nextCallback) {
                        dispatch(_this.nextCallback, ..._this.lastKnownParams!);            
                    }
                });
            }

            dispatch(this.nextCallback, ...this.lastKnownParams);

        }
    }
}
