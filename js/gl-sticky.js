/* jshint esversion: 6 */

import $ from 'jquery';
import throttle from 'lodash/throttle';

export class GlSticky {

    constructor(options) {
        
        this.debug = typeof window.debug !== 'undefined' ? window.debug : false;
        
        this.defaults = {
            el: 'body',
            active: false,
            className: 'is-sticky',
            stickedClassName: 'is-sticked',
            toggleTriggerPoint: 185,
            onStick: () => {
                
            },
            onUnstick: () => {
                
            },
        };
        
        this.setOptions(options);
        
        // // merge options with defaults
        // this.options = $.extend({}, this.defaults, options);
        
        // // merge this.option to this
        // $.extend(this, this.options);
    }
    
    consoleLog(log = '', prefix = 'GlSticky: ') {
        if (this.debug || window.debug) {
            if (prefix !== false) {
                console.log(prefix + log);
            } else {
                console.log(log);
            }
        }
    }
    
    setOptions(options) {
        
        this.consoleLog('setOptions');
        this.consoleLog(options);
        
        // merge options with defaults
        this.options = $.extend({}, this.defaults, options);
        
        // merge this.option to this
        $.extend(this, this.options);   
    }
    
    init() {
        if (this.check()) {
            this.prepare();
            this.run();
        }
    }
    
    reInit() {
        if (this.check()) {
            this.cleanup();
            this.run();
        }
    }
    
    check() {
        return $(this.el).length;
    }
    
    cleanup() {
        $(this.el).removeClass(this.className);
        $(this.el).removeClass(this.stickedClassName);
    }
    
    prepare() {
        this.consoleLog('prepare [' + $().jquery + ']');
        
        this.$window = $(window);
        this.$document = $(document);
        
        // preparing
        this.$el = $(this.el);
    }
    
    run() {
        this.consoleLog('run [' + $().jquery + ']');
        
        if (!this.active) {
            return;
        }
        
        this.sticked = false;
        
        this.$el.addClass(this.className);
        this.addCheckOnScroll();
        this.scrollCheck();
    }
    
    addCheckOnScroll() {
        
        this.debouncedScroll = throttle(() => {
            this.consoleLog('scrolling');
            
            this.scrollCheck();
            
        }, 100, {
            leading: false,
            trailing: true,
        });
        
        this.$document.on('scroll', () => {
            this.debouncedScroll();
        });
    }
    
    scrollCheck() {
        this.consoleLog('scroll check');
        this.scrollTop = this.$document.scrollTop();
        this.actionOnScroll();
    }
    
    actionOnScroll() {
        if (!this.active) {
            return;
        }
        
        // actions
        if (this.scrollTop > this.toggleTriggerPoint) {
            
            this.consoleLog('scroll is bigger than trigger point: ' + this.toggleTriggerPoint);
            this.addSticky();
            
        } else {
            
            this.consoleLog('scroll is lower or equal to trigger point: ' + this.toggleTriggerPoint);
            this.removeSticky();
            
        }
    }
    
    addSticky() {
        if (this.sticked === true) {
            this.consoleLog('already sticked');
            return;
        }
        this.sticked = true;
        this.consoleLog('add sticky class: ' + this.stickedClassName);
        this.$el.addClass(this.stickedClassName);
        this.onStick.call(this, this);
    }
    
    removeSticky() {
        if (this.sticked === false) {
            this.consoleLog('already unsticked');
            return;
        }
        this.sticked = false;
        this.consoleLog('remove sticky class: ' + this.stickedClassName);
        this.$el.removeClass(this.stickedClassName);
        this.onUnstick.call(this, this);
    }
}

///////////
// init  //
///////////

let xGlSticky = new GlSticky();

$(() => {
    xGlSticky.init();
});

export default xGlSticky;