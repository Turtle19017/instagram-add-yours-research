Java.perform(function() {
    console.log("[*] Phase 7: Initializing robust drag_template_layer.js with full touch tracing...");

    var containerCls = Java.use("com.instagram.ui.widget.interactive.InteractiveDrawableContainer");
    var Hj5Cls = Java.use("X.0Hj5");
    var ListCls = Java.use("java.util.List");

    var STATE_IDLE = 0;
    var STATE_DRAGGING = 1;

    var currentState = STATE_IDLE;
    var activeControllerIndex = -1;

    var initialTouchX = 0.0;
    var initialTouchY = 0.0;
    var initialControllerX = 0.0;
    var initialControllerY = 0.0;
    var activePointerId = -1;

    // Bitmap original metadata (ARGB_8888 720x1280)
    var BITMAP_WIDTH = 720.0;
    var BITMAP_HEIGHT = 1280.0;
    // Bounding box of decorative nameplate in 720x1280 asset
    var NP_LEFT = 124.0;
    var NP_TOP = 346.0;
    var NP_RIGHT = 597.0;
    var NP_BOTTOM = 535.0;

    function findTemplateControllerIndex(container) {
        try {
            var fieldA17 = container.getClass().getDeclaredField("A17");
            fieldA17.setAccessible(true);
            var obj = fieldA17.get(container);
            if (!obj) return -1;
            var list = Java.cast(obj, ListCls);
            if (!list || list.size() === 0) return -1;

            for (var i = 0; i < list.size(); i++) {
                var item = list.get(i);
                if (!item) continue;
                var hj = Java.cast(item, Hj5Cls);
                var drawable = hj.BWj();
                if (!drawable) continue;

                try {
                    var fA0A = drawable.getClass().getDeclaredField("A0A");
                    fA0A.setAccessible(true);
                    var listA0A = Java.cast(fA0A.get(drawable), ListCls);
                    if (listA0A && listA0A.size() > 0) {
                        var hgi = listA0A.get(0);
                        var fA0J = hgi.getClass().getDeclaredField("A0J");
                        fA0J.setAccessible(true);
                        var tag = "" + fA0J.get(hgi);
                        if (tag.indexOf("STORIES_TEMPLATE_GALLERY_OVERLAY") !== -1) {
                            return i;
                        }
                    }
                } catch(e) {}
            }
        } catch(err) {
            console.log("[-] findTemplateControllerIndex err: " + err);
        }
        return -1;
    }

    containerCls.onTouchEvent.overload("android.view.MotionEvent").implementation = function(ev) {
        var action = ev.getActionMasked();

        if (action === 0) { // ACTION_DOWN
            var container = this;
            var idx = findTemplateControllerIndex(container);

            if (idx >= 0) {
                var fieldA17 = container.getClass().getDeclaredField("A17");
                fieldA17.setAccessible(true);
                var list = Java.cast(fieldA17.get(container), ListCls);
                var controller = Java.cast(list.get(idx), Hj5Cls);

                var cW = container.getWidth();
                var cH = container.getHeight();

                if (cW > 0 && cH > 0) {
                    var scaleX = cW / BITMAP_WIDTH;
                    var scaleY = cH / BITMAP_HEIGHT;

                    // Relative nameplate bounds inside unshifted layer
                    var relLeft = NP_LEFT * scaleX;
                    var relTop = NP_TOP * scaleY;
                    var relRight = NP_RIGHT * scaleX;
                    var relBottom = NP_BOTTOM * scaleY;

                    // Controller center translation
                    var curCenterX = controller.CzU();
                    var curCenterY = controller.CzV();

                    var offsetX = curCenterX - (cW / 2.0);
                    var offsetY = curCenterY - (cH / 2.0);

                    // Dynamic hitbox translated with active layer
                    var hitLeft = relLeft + offsetX;
                    var hitTop = relTop + offsetY;
                    var hitRight = relRight + offsetX;
                    var hitBottom = relBottom + offsetY;

                    var touchX = ev.getX();
                    var touchY = ev.getY();

                    console.log("[TOUCH_DOWN] Point=(" + touchX.toFixed(1) + ", " + touchY.toFixed(1) + 
                                ") | Hitbox=[" + hitLeft.toFixed(1) + ", " + hitTop.toFixed(1) + 
                                " -> " + hitRight.toFixed(1) + ", " + hitBottom.toFixed(1) + "]");

                    if (touchX >= hitLeft && touchX <= hitRight && touchY >= hitTop && touchY <= hitBottom) {
                        currentState = STATE_DRAGGING;
                        activeControllerIndex = idx;
                        activePointerId = ev.getPointerId(0);
                        initialTouchX = touchX;
                        initialTouchY = touchY;
                        initialControllerX = curCenterX;
                        initialControllerY = curCenterY;

                        // Lock parent to prevent drawer / gesture stealing
                        try {
                            container.getParent().requestDisallowInterceptTouchEvent(true);
                        } catch(pErr) {}

                        console.log("[+] CAPTURE: Nameplate drag captured! initialCenter=(" + 
                                    curCenterX.toFixed(1) + ", " + curCenterY.toFixed(1) + ")");
                        return true;
                    }
                }
            }

            currentState = STATE_IDLE;
            activeControllerIndex = -1;
            return this.onTouchEvent(ev);
        }

        if (action === 2) { // ACTION_MOVE
            if (currentState === STATE_DRAGGING && activeControllerIndex >= 0) {
                var pIndex = ev.findPointerIndex(activePointerId);
                if (pIndex < 0) pIndex = 0;

                var curX = ev.getX(pIndex);
                var curY = ev.getY(pIndex);

                var deltaX = curX - initialTouchX;
                var deltaY = curY - initialTouchY;

                var targetX = initialControllerX + deltaX;
                var targetY = initialControllerY + deltaY;

                try {
                    var fieldA17 = this.getClass().getDeclaredField("A17");
                    fieldA17.setAccessible(true);
                    var list = Java.cast(fieldA17.get(this), ListCls);
                    var ctrl = Java.cast(list.get(activeControllerIndex), Hj5Cls);

                    ctrl.HC7(targetX);
                    ctrl.HC8(targetY);
                    this.invalidate();
                } catch(moveErr) {
                    console.log("[-] ACTION_MOVE err: " + moveErr);
                }

                return true; // Consumed
            }
            return this.onTouchEvent(ev);
        }

        if (action === 1 || action === 3) { // ACTION_UP or ACTION_CANCEL
            if (currentState === STATE_DRAGGING && activeControllerIndex >= 0) {
                currentState = STATE_IDLE;
                try {
                    this.getParent().requestDisallowInterceptTouchEvent(false);
                } catch(pErr) {}

                var pIndex = ev.findPointerIndex(activePointerId);
                if (pIndex < 0) pIndex = 0;
                var curX = ev.getX(pIndex);
                var curY = ev.getY(pIndex);
                var deltaX = curX - initialTouchX;
                var deltaY = curY - initialTouchY;
                var targetX = initialControllerX + deltaX;
                var targetY = initialControllerY + deltaY;

                try {
                    var fieldA17 = this.getClass().getDeclaredField("A17");
                    fieldA17.setAccessible(true);
                    var list = Java.cast(fieldA17.get(this), ListCls);
                    var ctrl = Java.cast(list.get(activeControllerIndex), Hj5Cls);

                    // Finalize position on UP
                    ctrl.HC7(targetX);
                    ctrl.HC8(targetY);
                    this.invalidate();
                    this.requestLayout();

                    var endX = ctrl.CzU();
                    var endY = ctrl.CzV();
                    console.log("[+] RELEASE: Drag completed (" + (action === 1 ? "UP" : "CANCEL") + 
                                ") | TouchDelta=(" + deltaX.toFixed(1) + ", " + deltaY.toFixed(1) + 
                                ") -> Final Center=(" + endX.toFixed(1) + ", " + endY.toFixed(1) + ")");
                } catch(upErr) {
                    console.log("[-] ACTION_UP err: " + upErr);
                }
                activeControllerIndex = -1;
                activePointerId = -1;
                return true;
            }
            return this.onTouchEvent(ev);
        }

        if (action === 6) { // ACTION_POINTER_UP
            if (currentState === STATE_DRAGGING) {
                var pointerIndex = ev.getActionIndex();
                var pointerId = ev.getPointerId(pointerIndex);
                if (pointerId === activePointerId) {
                    var nextIndex = pointerIndex === 0 ? 1 : 0;
                    if (nextIndex < ev.getPointerCount()) {
                        activePointerId = ev.getPointerId(nextIndex);
                        initialTouchX = ev.getX(nextIndex);
                        initialTouchY = ev.getY(nextIndex);
                        try {
                            var fieldA17 = this.getClass().getDeclaredField("A17");
                            fieldA17.setAccessible(true);
                            var list = Java.cast(fieldA17.get(this), ListCls);
                            var ctrl = Java.cast(list.get(activeControllerIndex), Hj5Cls);
                            initialControllerX = ctrl.CzU();
                            initialControllerY = ctrl.CzV();
                        } catch(e) {}
                    } else {
                        currentState = STATE_IDLE;
                        activeControllerIndex = -1;
                    }
                    return true;
                }
            }
        }

        return this.onTouchEvent(ev);
    };

    console.log("[+] Verified drag_template_layer.js active. Ready.");
});
