Java.perform(function() {
    console.log("[*] Phase 6B: Safe test_drawable_transform.js (HC7/HC8 on Main Thread only)...");

    var Handler = Java.use("android.os.Handler");
    var Looper = Java.use("android.os.Looper");
    var mainHandler = Handler.$new(Looper.getMainLooper());

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            var fieldA17 = null;
            try {
                fieldA17 = container.getClass().getDeclaredField("A17");
                fieldA17.setAccessible(true);
            } catch(e) {
                return;
            }

            var list = null;
            try {
                list = Java.cast(fieldA17.get(container), Java.use("java.util.List"));
            } catch(e) {
                return;
            }
            if (!list || list.size() === 0) return;

            var Hj5Cls = Java.use("X.0Hj5");
            var found = false;

            for (var i = 0; i < list.size(); i++) {
                try {
                    var item = list.get(i);
                    if (!item) continue;

                    var hj = Java.cast(item, Hj5Cls);
                    var drawable = hj.BWj();
                    if (!drawable) continue;

                    // Verify whether this wraps STORIES_TEMPLATE_GALLERY_OVERLAY
                    var isTemplate = false;
                    try {
                        var fA0A = drawable.getClass().getDeclaredField("A0A");
                        fA0A.setAccessible(true);
                        var listA0A = Java.cast(fA0A.get(drawable), Java.use("java.util.List"));
                        if (listA0A && listA0A.size() > 0) {
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
                        found = true;
                        var origX = hj.CzU();
                        var origY = hj.CzV();
                        console.log("[+] Identified target Template controller at index #" + i);
                        console.log("    Original translation: X=" + origX + ", Y=" + origY);

                        // Move up by -160 pixels along Y into header region
                        var targetX = origX;
                        var targetY = origY - 160.0;

                        // Execute ONLY HC7 and HC8 directly on Main Thread via container.post
                        var targetHj = hj;
                        var targetContainer = container;

                        var RunnableCls = Java.use("java.lang.Runnable");
                        var task = Java.registerClass({
                            name: "com.research.TransformTask_" + Math.floor(Math.random() * 1000000),
                            implements: [RunnableCls],
                            methods: {
                                run: function() {
                                    try {
                                        // Pure HC7 / HC8 call, NO field modification of A01/A02, NO A05 call
                                        targetHj.HC7(targetX);
                                        targetHj.HC8(targetY);
                                        targetContainer.invalidate();
                                        targetContainer.requestLayout();
                                        console.log("[+] Applied HC7(" + targetX + ") & HC8(" + targetY + ") successfully on Main Thread.");
                                    } catch(err) {
                                        console.log("[-] Error inside run: " + err);
                                    }
                                }
                            }
                        });

                        mainHandler.post(task.$new());
                        break;
                    }
                } catch(itemErr) {
                    // Safe catch per item ensures loop continues cleanly
                    continue;
                }
            }

            if (!found) {
                console.log("[-] Template layer not found in this container instance.");
            }
        },
        onComplete: function() {
            console.log("[*] Enumeration finished.");
        }
    });
});
