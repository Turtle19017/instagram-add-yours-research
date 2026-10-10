Java.perform(function() {
    console.log("[*] Robust, crash-free transform targeting STORIES_TEMPLATE_GALLERY_OVERLAY...");

    var ActivityThread = Java.use("android.app.ActivityThread");
    var Handler = Java.use("android.os.Handler");
    var Looper = Java.use("android.os.Looper");

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            var fieldA17 = null;
            try {
                fieldA17 = container.getClass().getDeclaredField("A17");
                fieldA17.setAccessible(true);
            } catch(e) {
                return;
            }

            var list = Java.cast(fieldA17.get(container), Java.use("java.util.List"));
            if (!list || list.size() === 0) return;

            // Search through controllers to find the exact one holding STORIES_TEMPLATE_GALLERY_OVERLAY
            for (var i = 0; i < list.size(); i++) {
                var item = list.get(i);
                if (!item) continue;

                var hj = Java.cast(item, Java.use("X.0Hj5"));
                var drawable = hj.BWj();
                if (!drawable) continue;

                // Check if this drawable wraps STORIES_TEMPLATE_GALLERY_OVERLAY
                var isTemplate = false;
                try {
                    var fA0A = drawable.getClass().getDeclaredField("A0A");
                    fA0A.setAccessible(true);
                    var listA0A = Java.cast(fA0A.get(drawable), Java.use("java.util.List"));
                    if (listA0A.size() > 0) {
                        var hgi = listA0A.get(0);
                        var fA0J = hgi.getClass().getDeclaredField("A0J");
                        fA0J.setAccessible(true);
                        var tag = "" + fA0J.get(hgi);
                        if (tag.indexOf("STORIES_TEMPLATE_GALLERY_OVERLAY") !== -1) {
                            isTemplate = true;
                        }
                    }
                } catch(e) {}

                if (isTemplate) {
                    console.log("[+] Found target Template controller at index #" + i);
                    var origX = hj.CzU();
                    var origY = hj.CzV();
                    console.log("    Original position: (" + origX + ", " + origY + ")");

                    var targetX = origX;
                    var targetY = origY - 180.0; // Shift up cleanly

                    // Execute safely on main looper
                    var mainHandler = Handler.$new(Looper.getMainLooper());
                    var Runnable = Java.use("java.lang.Runnable");
                    var SafeTransformRunnable = Java.registerClass({
                        name: "com.research.SafeTransformRunnable_" + Date.now(),
                        implements: [Runnable],
                        methods: {
                            run: function() {
                                try {
                                    hj.HC7(targetX);
                                    hj.HC8(targetY);
                                    
                                    // Update translation fields directly without invoking dangerous native A05
                                    var fA01 = hj.getClass().getDeclaredField("A01"); fA01.setAccessible(true);
                                    var fA02 = hj.getClass().getDeclaredField("A02"); fA02.setAccessible(true);
                                    fA01.set(hj, Java.use("java.lang.Float").valueOf(0.0));
                                    fA02.set(hj, Java.use("java.lang.Float").valueOf(targetY - origY));

                                    container.invalidate();
                                    container.requestLayout();
                                    console.log("[+] Safe transform applied: (" + targetX + ", " + targetY + ")");
                                } catch(err) {
                                    console.log("[-] Error during safe transform: " + err);
                                }
                            }
                        }
                    });

                    mainHandler.post(SafeTransformRunnable.$new());
                    break;
                }
            }
        },
        onComplete: function() {
            console.log("[*] Search completed.");
        }
    });
});
