Java.perform(function() {
    console.log("[*] Phase 7: Initializing touch_diagnostics.js...");

    var MotionEvent = Java.use("android.view.MotionEvent");
    var containerCls = Java.use("com.instagram.ui.widget.interactive.InteractiveDrawableContainer");

    function actionToString(action) {
        var masked = action & 0xff; // MotionEvent.ACTION_MASK
        switch (masked) {
            case 0: return "ACTION_DOWN";
            case 1: return "ACTION_UP";
            case 2: return "ACTION_MOVE";
            case 3: return "ACTION_CANCEL";
            case 5: return "ACTION_POINTER_DOWN";
            case 6: return "ACTION_POINTER_UP";
            default: return "ACTION_" + masked;
        }
    }

    // 1. Hook dispatchTouchEvent
    var dispatchTouchEvent = containerCls.dispatchTouchEvent;
    if (dispatchTouchEvent) {
        dispatchTouchEvent.overload("android.view.MotionEvent").implementation = function(ev) {
            var actionStr = actionToString(ev.getAction());
            var x = ev.getX();
            var y = ev.getY();
            var ret = this.dispatchTouchEvent(ev);
            if (actionStr !== "ACTION_MOVE" || Math.random() < 0.05) { // throttle moves in logs
                console.log("[DISPATCH] " + actionStr + " at (" + x.toFixed(1) + ", " + y.toFixed(1) + ") -> ret=" + ret);
            }
            return ret;
        };
    }

    // 2. Hook onInterceptTouchEvent if it exists on container
    try {
        var onInterceptTouchEvent = containerCls.onInterceptTouchEvent;
        if (onInterceptTouchEvent) {
            onInterceptTouchEvent.overload("android.view.MotionEvent").implementation = function(ev) {
                var actionStr = actionToString(ev.getAction());
                var x = ev.getX();
                var y = ev.getY();
                var ret = this.onInterceptTouchEvent(ev);
                console.log("[INTERCEPT] " + actionStr + " at (" + x.toFixed(1) + ", " + y.toFixed(1) + ") -> ret=" + ret);
                return ret;
            };
        }
    } catch(e) {
        console.log("[-] onInterceptTouchEvent not declared on InteractiveDrawableContainer directly.");
    }

    // 3. Hook onTouchEvent
    var onTouchEvent = containerCls.onTouchEvent;
    if (onTouchEvent) {
        onTouchEvent.overload("android.view.MotionEvent").implementation = function(ev) {
            var actionStr = actionToString(ev.getAction());
            var x = ev.getX();
            var y = ev.getY();
            var ret = this.onTouchEvent(ev);
            if (actionStr !== "ACTION_MOVE" || Math.random() < 0.05) {
                console.log("[ON_TOUCH] " + actionStr + " at (" + x.toFixed(1) + ", " + y.toFixed(1) + ") -> ret=" + ret);
            }
            return ret;
        };
    }

    // 4. Hook Gesture listener methods on container
    var onDown = containerCls.onDown;
    if (onDown) {
        onDown.overload("android.view.MotionEvent").implementation = function(ev) {
            console.log("[GESTURE] onDown at (" + ev.getX().toFixed(1) + ", " + ev.getY().toFixed(1) + ")");
            return this.onDown(ev);
        };
    }

    var onScroll = containerCls.onScroll;
    if (onScroll) {
        onScroll.overload("android.view.MotionEvent", "android.view.MotionEvent", "float", "float").implementation = function(e1, e2, dx, dy) {
            if (Math.random() < 0.1) {
                console.log("[GESTURE] onScroll dx=" + dx.toFixed(1) + ", dy=" + dy.toFixed(1));
            }
            return this.onScroll(e1, e2, dx, dy);
        };
    }

    console.log("[+] touch_diagnostics.js hooks active. Ready for touch events.");
});
